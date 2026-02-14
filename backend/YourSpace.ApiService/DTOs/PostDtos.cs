namespace YourSpace.ApiService.DTOs;

/// <summary>
/// DTO for creating a new post
/// </summary>
public class CreatePostDto
{
    public required string Content { get; set; }
    public string? MediaUrl { get; set; }
}

/// <summary>
/// DTO for a post response
/// </summary>
public class PostDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; } = string.Empty;
    public string DisplayName { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string Content { get; set; } = string.Empty;
    public string? MediaUrl { get; set; }
    public int LikesCount { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO for feed post with following indicator
/// </summary>
public class FeedPostDto : PostDto
{
    /// <summary>
    /// Indicates if the current user follows the post author
    /// </summary>
    public bool IsFollowing { get; set; }
}
