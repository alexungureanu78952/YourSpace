namespace YourSpace.Data.Models;

/// <summary>
/// Represents a follow relationship between two users
/// </summary>
public class Follow
{
    /// <summary>
    /// Primary key for the follow relationship
    /// </summary>
    public int Id { get; set; }

    /// <summary>
    /// The ID of the user who is following (the follower)
    /// </summary>
    public int FollowerId { get; set; }

    /// <summary>
    /// The user who is following
    /// </summary>
    public User Follower { get; set; } = null!;

    /// <summary>
    /// The ID of the user being followed (the followee)
    /// </summary>
    public int FollowedId { get; set; }

    /// <summary>
    /// The user being followed
    /// </summary>
    public User Followed { get; set; } = null!;

    /// <summary>
    /// When the follow relationship was created
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
}
