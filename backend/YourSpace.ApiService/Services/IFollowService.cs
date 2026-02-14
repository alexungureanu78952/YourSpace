using YourSpace.ApiService.Common;
using YourSpace.ApiService.DTOs;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Interface for managing follow relationships between users
/// </summary>
public interface IFollowService
{
    /// <summary>
    /// Creates a follow relationship where followerId follows followedId
    /// </summary>
    Task<Result<FollowDto>> FollowUserAsync(int followerId, int followedId);

    /// <summary>
    /// Removes a follow relationship
    /// </summary>
    Task<Result> UnfollowUserAsync(int followerId, int followedId);

    /// <summary>
    /// Checks if a user is following another user
    /// </summary>
    Task<bool> IsFollowingAsync(int followerId, int followedId);

    /// <summary>
    /// Gets the number of followers for a user
    /// </summary>
    Task<int> GetFollowersCountAsync(int userId);

    /// <summary>
    /// Gets the number of users that a user is following
    /// </summary>
    Task<int> GetFollowingCountAsync(int userId);

    /// <summary>
    /// Gets the list of users who follow the specified user
    /// </summary>
    Task<List<UserDetailDto>> GetFollowersAsync(int userId);

    /// <summary>
    /// Gets the list of users that the specified user is following
    /// </summary>
    Task<List<UserDetailDto>> GetFollowingAsync(int userId);
}
