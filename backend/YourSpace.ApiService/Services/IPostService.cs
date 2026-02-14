using YourSpace.ApiService.Common;
using YourSpace.ApiService.DTOs;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Interface for managing posts and feed
/// </summary>
public interface IPostService
{
    /// <summary>
    /// Creates a new post
    /// </summary>
    Task<Result<PostDto>> CreatePostAsync(int userId, CreatePostDto createDto);

    /// <summary>
    /// Gets a post by ID
    /// </summary>
    Task<PostDto?> GetPostByIdAsync(int postId);

    /// <summary>
    /// Gets the feed for a user (followed users' posts first, then others)
    /// </summary>
    Task<List<FeedPostDto>> GetFeedAsync(int currentUserId, int skip, int take);

    /// <summary>
    /// Gets posts by a specific user
    /// </summary>
    Task<List<PostDto>> GetUserPostsAsync(int userId, int skip, int take);

    /// <summary>
    /// Deletes a post (only by owner)
    /// </summary>
    Task<Result> DeletePostAsync(int postId, int userId);
}
