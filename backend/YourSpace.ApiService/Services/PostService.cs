using Microsoft.EntityFrameworkCore;
using YourSpace.ApiService.Common;
using YourSpace.ApiService.DTOs;
using YourSpace.Data;
using YourSpace.Data.Models;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Service for managing posts and feed
/// </summary>
public class PostService : IPostService
{
    private readonly YourSpaceDbContext _db;

    public PostService(YourSpaceDbContext db)
    {
        _db = db;
    }

    public async Task<Result<PostDto>> CreatePostAsync(int userId, CreatePostDto createDto)
    {
        // Validate content
        if (string.IsNullOrWhiteSpace(createDto.Content))
        {
            return Result<PostDto>.Failure("Content cannot be empty");
        }

        // Check if user exists
        var userExists = await _db.Users.AnyAsync(u => u.Id == userId);
        if (!userExists)
        {
            return Result<PostDto>.Failure("User not found");
        }

        // Create post
        var post = new Post
        {
            UserId = userId,
            Content = createDto.Content.Trim(),
            MediaUrl = string.IsNullOrWhiteSpace(createDto.MediaUrl) ? null : createDto.MediaUrl.Trim(),
            CreatedAt = DateTime.UtcNow,
            LikesCount = 0
        };

        _db.Posts.Add(post);
        await _db.SaveChangesAsync();

        // Fetch with user info for DTO
        var postWithUser = await _db.Posts
            .Include(p => p.User)
            .ThenInclude(u => u.Profile)
            .FirstAsync(p => p.Id == post.Id);

        return Result<PostDto>.Success(MapToDto(postWithUser));
    }

    public async Task<PostDto?> GetPostByIdAsync(int postId)
    {
        var post = await _db.Posts
            .Include(p => p.User)
            .ThenInclude(u => u.Profile)
            .FirstOrDefaultAsync(p => p.Id == postId);

        return post == null ? null : MapToDto(post);
    }

    public async Task<List<FeedPostDto>> GetFeedAsync(int currentUserId, int skip, int take)
    {
        // Get IDs of users that current user follows
        var followedUserIds = await _db.Follows
            .Where(f => f.FollowerId == currentUserId)
            .Select(f => f.FollowedId)
            .ToListAsync();

        // Get all posts with user info
        var posts = await _db.Posts
            .Include(p => p.User)
            .ThenInclude(u => u.Profile)
            .OrderByDescending(p => followedUserIds.Contains(p.UserId)) // Followed users first
            .ThenByDescending(p => p.CreatedAt) // Then by date
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return posts.Select(p => MapToFeedDto(p, followedUserIds.Contains(p.UserId))).ToList();
    }

    public async Task<List<PostDto>> GetUserPostsAsync(int userId, int skip, int take)
    {
        var posts = await _db.Posts
            .Include(p => p.User)
            .ThenInclude(u => u.Profile)
            .Where(p => p.UserId == userId)
            .OrderByDescending(p => p.CreatedAt)
            .Skip(skip)
            .Take(take)
            .ToListAsync();

        return posts.Select(MapToDto).ToList();
    }

    public async Task<Result> DeletePostAsync(int postId, int userId)
    {
        var post = await _db.Posts.FirstOrDefaultAsync(p => p.Id == postId);

        if (post == null)
        {
            return Result.Failure("Post not found");
        }

        if (post.UserId != userId)
        {
            return Result.Failure("You are not authorized to delete this post");
        }

        _db.Posts.Remove(post);
        await _db.SaveChangesAsync();

        return Result.Success();
    }

    private PostDto MapToDto(Post post)
    {
        return new PostDto
        {
            Id = post.Id,
            UserId = post.UserId,
            Username = post.User.Username,
            DisplayName = post.User.Profile?.DisplayName ?? post.User.Username,
            AvatarUrl = post.User.Profile?.AvatarUrl,
            Content = post.Content,
            MediaUrl = post.MediaUrl,
            LikesCount = post.LikesCount,
            CreatedAt = post.CreatedAt
        };
    }

    private FeedPostDto MapToFeedDto(Post post, bool isFollowing)
    {
        var baseDto = MapToDto(post);
        return new FeedPostDto
        {
            Id = baseDto.Id,
            UserId = baseDto.UserId,
            Username = baseDto.Username,
            DisplayName = baseDto.DisplayName,
            AvatarUrl = baseDto.AvatarUrl,
            Content = baseDto.Content,
            MediaUrl = baseDto.MediaUrl,
            LikesCount = baseDto.LikesCount,
            CreatedAt = baseDto.CreatedAt,
            IsFollowing = isFollowing
        };
    }
}
