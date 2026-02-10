namespace YourSpace.Data.Models;

/// <summary>
/// O postare în feed-ul social
/// </summary>
public class Post
{
    public int Id { get; set; }

    /// <summary>
    /// ID-ul utilizatorului care a creat postarea
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Conținutul postării
    /// </summary>
    public required string Content { get; set; }

    /// <summary>
    /// Data și ora creării postării
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Numărul de like-uri
    /// </summary>
    public int LikesCount { get; set; } = 0;

    /// <summary>
    /// Navigare către utilizatorul care a creat postarea
    /// </summary>
    public User User { get; set; } = null!;
}
