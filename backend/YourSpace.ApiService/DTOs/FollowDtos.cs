namespace YourSpace.ApiService.DTOs;

/// <summary>
/// DTO for a follow relationship
/// </summary>
public class FollowDto
{
    public int Id { get; set; }
    public int FollowerId { get; set; }
    public int FollowedId { get; set; }
    public DateTime CreatedAt { get; set; }
}

/// <summary>
/// DTO for follow statistics
/// </summary>
public class FollowStatsDto
{
    public int UserId { get; set; }
    public int FollowersCount { get; set; }
    public int FollowingCount { get; set; }
}

/// <summary>
/// DTO for checking if a user is following another
/// </summary>
public class IsFollowingDto
{
    public int FollowerId { get; set; }
    public int FollowedId { get; set; }
    public bool IsFollowing { get; set; }
}
