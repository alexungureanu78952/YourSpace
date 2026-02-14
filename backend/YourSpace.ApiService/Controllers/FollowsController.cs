using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YourSpace.ApiService.DTOs;
using YourSpace.ApiService.Services;
using Microsoft.Extensions.Logging;

namespace YourSpace.ApiService.Controllers;

/// <summary>
/// Controller for managing follow relationships between users
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class FollowsController : ControllerBase
{
    private readonly IFollowService _followService;
    private readonly ILogger<FollowsController> _logger;

    public FollowsController(IFollowService followService, ILogger<FollowsController> logger)
    {
        _followService = followService;
        _logger = logger;
    }

    /// <summary>
    /// Follow a user
    /// </summary>
    [Authorize]
    [HttpPost("{followedId}")]
    public async Task<ActionResult<FollowDto>> FollowUser(int followedId)
    {
        try
        {
            var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var followerId))
            {
                _logger.LogWarning("Unauthorized: userId claim missing or invalid");
                return Unauthorized();
            }

            _logger.LogInformation("User {FollowerId} attempting to follow user {FollowedId}", followerId, followedId);

            var result = await _followService.FollowUserAsync(followerId, followedId);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("Follow failed: {Error}", result.Error);
                return BadRequest(new { message = result.Error });
            }

            _logger.LogInformation("User {FollowerId} successfully followed user {FollowedId}", followerId, followedId);
            return Ok(result.Value);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in FollowUser endpoint");
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Unfollow a user
    /// </summary>
    [Authorize]
    [HttpDelete("{followedId}")]
    public async Task<IActionResult> UnfollowUser(int followedId)
    {
        try
        {
            var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var followerId))
            {
                _logger.LogWarning("Unauthorized: userId claim missing or invalid");
                return Unauthorized();
            }

            _logger.LogInformation("User {FollowerId} attempting to unfollow user {FollowedId}", followerId, followedId);

            var result = await _followService.UnfollowUserAsync(followerId, followedId);

            if (!result.IsSuccess)
            {
                _logger.LogWarning("Unfollow failed: {Error}", result.Error);
                return BadRequest(new { message = result.Error });
            }

            _logger.LogInformation("User {FollowerId} successfully unfollowed user {FollowedId}", followerId, followedId);
            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in UnfollowUser endpoint");
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Check if a user is following another user
    /// </summary>
    [HttpGet("is-following")]
    public async Task<ActionResult<IsFollowingDto>> IsFollowing([FromQuery] int followerId, [FromQuery] int followedId)
    {
        try
        {
            var isFollowing = await _followService.IsFollowingAsync(followerId, followedId);

            return Ok(new IsFollowingDto
            {
                FollowerId = followerId,
                FollowedId = followedId,
                IsFollowing = isFollowing
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in IsFollowing endpoint");
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Get follow statistics for a user (followers and following counts)
    /// </summary>
    [HttpGet("stats/{userId}")]
    public async Task<ActionResult<FollowStatsDto>> GetFollowStats(int userId)
    {
        try
        {
            var followersCount = await _followService.GetFollowersCountAsync(userId);
            var followingCount = await _followService.GetFollowingCountAsync(userId);

            return Ok(new FollowStatsDto
            {
                UserId = userId,
                FollowersCount = followersCount,
                FollowingCount = followingCount
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetFollowStats endpoint");
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Get list of followers for a user
    /// </summary>
    [HttpGet("followers/{userId}")]
    public async Task<ActionResult<List<UserDetailDto>>> GetFollowers(int userId)
    {
        try
        {
            var followers = await _followService.GetFollowersAsync(userId);
            return Ok(followers);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetFollowers endpoint");
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }

    /// <summary>
    /// Get list of users that a user is following
    /// </summary>
    [HttpGet("following/{userId}")]
    public async Task<ActionResult<List<UserDetailDto>>> GetFollowing(int userId)
    {
        try
        {
            var following = await _followService.GetFollowingAsync(userId);
            return Ok(following);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetFollowing endpoint");
            return StatusCode(500, new { message = "An error occurred while processing your request" });
        }
    }
}
