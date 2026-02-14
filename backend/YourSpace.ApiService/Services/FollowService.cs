using Microsoft.EntityFrameworkCore;
using YourSpace.ApiService.Common;
using YourSpace.ApiService.DTOs;
using YourSpace.Data;
using YourSpace.Data.Models;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Service for managing follow relationships between users
/// </summary>
public class FollowService : IFollowService
{
    private readonly YourSpaceDbContext _db;

    public FollowService(YourSpaceDbContext db)
    {
        _db = db;
    }

    public async Task<Result<FollowDto>> FollowUserAsync(int followerId, int followedId)
    {
        // Validate: can't follow yourself
        if (followerId == followedId)
        {
            return Result<FollowDto>.Failure("Cannot follow yourself");
        }

        // Check if follower exists
        var followerExists = await _db.Users.AnyAsync(u => u.Id == followerId);
        if (!followerExists)
        {
            return Result<FollowDto>.Failure("Follower user not found");
        }

        // Check if followed user exists
        var followedExists = await _db.Users.AnyAsync(u => u.Id == followedId);
        if (!followedExists)
        {
            return Result<FollowDto>.Failure("Followed user not found");
        }

        // Check if already following
        var existingFollow = await _db.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowedId == followedId);

        if (existingFollow != null)
        {
            return Result<FollowDto>.Failure("Already following this user");
        }

        // Create new follow relationship
        var follow = new Follow
        {
            FollowerId = followerId,
            FollowedId = followedId,
            CreatedAt = DateTime.UtcNow
        };

        _db.Follows.Add(follow);
        await _db.SaveChangesAsync();

        var dto = new FollowDto
        {
            Id = follow.Id,
            FollowerId = follow.FollowerId,
            FollowedId = follow.FollowedId,
            CreatedAt = follow.CreatedAt
        };

        return Result<FollowDto>.Success(dto);
    }

    public async Task<Result> UnfollowUserAsync(int followerId, int followedId)
    {
        var follow = await _db.Follows
            .FirstOrDefaultAsync(f => f.FollowerId == followerId && f.FollowedId == followedId);

        if (follow == null)
        {
            return Result.Failure("Not following this user");
        }

        _db.Follows.Remove(follow);
        await _db.SaveChangesAsync();

        return Result.Success();
    }

    public async Task<bool> IsFollowingAsync(int followerId, int followedId)
    {
        return await _db.Follows
            .AnyAsync(f => f.FollowerId == followerId && f.FollowedId == followedId);
    }

    public async Task<int> GetFollowersCountAsync(int userId)
    {
        return await _db.Follows
            .CountAsync(f => f.FollowedId == userId);
    }

    public async Task<int> GetFollowingCountAsync(int userId)
    {
        return await _db.Follows
            .CountAsync(f => f.FollowerId == userId);
    }

    public async Task<List<UserDetailDto>> GetFollowersAsync(int userId)
    {
        var followers = await _db.Follows
            .Where(f => f.FollowedId == userId)
            .Include(f => f.Follower)
            .ThenInclude(u => u.Profile)
            .Select(f => new UserDetailDto
            {
                Id = f.Follower.Id,
                Username = f.Follower.Username,
                Email = f.Follower.Email,
                CreatedAt = f.Follower.CreatedAt,
                DisplayName = f.Follower.Profile != null ? f.Follower.Profile.DisplayName : f.Follower.Username,
                Profile = f.Follower.Profile != null ? new UserProfileDto
                {
                    DisplayName = f.Follower.Profile.DisplayName,
                    Bio = f.Follower.Profile.Bio,
                    AvatarUrl = f.Follower.Profile.AvatarUrl,
                    CustomHtml = f.Follower.Profile.CustomHtml,
                    CustomCss = f.Follower.Profile.CustomCss
                } : null,
                PostsCount = f.Follower.Posts.Count
            })
            .ToListAsync();

        return followers;
    }

    public async Task<List<UserDetailDto>> GetFollowingAsync(int userId)
    {
        var following = await _db.Follows
            .Where(f => f.FollowerId == userId)
            .Include(f => f.Followed)
            .ThenInclude(u => u.Profile)
            .Select(f => new UserDetailDto
            {
                Id = f.Followed.Id,
                Username = f.Followed.Username,
                Email = f.Followed.Email,
                CreatedAt = f.Followed.CreatedAt,
                DisplayName = f.Followed.Profile != null ? f.Followed.Profile.DisplayName : f.Followed.Username,
                Profile = f.Followed.Profile != null ? new UserProfileDto
                {
                    DisplayName = f.Followed.Profile.DisplayName,
                    Bio = f.Followed.Profile.Bio,
                    AvatarUrl = f.Followed.Profile.AvatarUrl,
                    CustomHtml = f.Followed.Profile.CustomHtml,
                    CustomCss = f.Followed.Profile.CustomCss
                } : null,
                PostsCount = f.Followed.Posts.Count
            })
            .ToListAsync();

        return following;
    }
}
