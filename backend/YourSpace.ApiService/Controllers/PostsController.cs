using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YourSpace.ApiService.DTOs;
using YourSpace.ApiService.Services;
using System.Security.Claims;

namespace YourSpace.ApiService.Controllers;

/// <summary>
/// Controller for managing posts and feed
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class PostsController : ControllerBase
{
    private readonly IPostService _postService;

    public PostsController(IPostService postService)
    {
        _postService = postService;
    }

    /// <summary>
    /// Create a new post
    /// </summary>
    [Authorize]
    [HttpPost]
    public async Task<ActionResult<PostDto>> CreatePost([FromBody] CreatePostDto createDto)
    {
        var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var result = await _postService.CreatePostAsync(userId, createDto);

        if (!result.IsSuccess)
        {
            return BadRequest(result.Error);
        }

        return CreatedAtAction(nameof(GetPost), new { id = result.Value!.Id }, result.Value);
    }

    /// <summary>
    /// Get a post by ID
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<PostDto>> GetPost(int id)
    {
        var post = await _postService.GetPostByIdAsync(id);

        if (post == null)
        {
            return NotFound();
        }

        return Ok(post);
    }

    /// <summary>
    /// Get the feed (followed users' posts first, then others)
    /// </summary>
    [Authorize]
    [HttpGet("feed")]
    public async Task<ActionResult<List<FeedPostDto>>> GetFeed([FromQuery] int skip = 0, [FromQuery] int take = 20)
    {
        var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var feed = await _postService.GetFeedAsync(userId, skip, take);

        return Ok(feed);
    }

    /// <summary>
    /// Get posts by a specific user
    /// </summary>
    [HttpGet("user/{userId}")]
    public async Task<ActionResult<List<PostDto>>> GetUserPosts(int userId, [FromQuery] int skip = 0, [FromQuery] int take = 20)
    {
        var posts = await _postService.GetUserPostsAsync(userId, skip, take);

        return Ok(posts);
    }

    /// <summary>
    /// Delete a post (only by owner)
    /// </summary>
    [Authorize]
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeletePost(int id)
    {
        var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
        {
            return Unauthorized();
        }

        var result = await _postService.DeletePostAsync(id, userId);

        if (!result.IsSuccess)
        {
            if (result.Error == "Post not found")
            {
                return NotFound(result.Error);
            }

            // Authorization error
            return StatusCode(403, result.Error);
        }

        return NoContent();
    }
}
