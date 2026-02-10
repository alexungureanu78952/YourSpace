namespace YourSpace.Data.Models;

/// <summary>
/// Reprezintă un utilizator al platformei YourSpace
/// </summary>
public class User
{
    public int Id { get; set; }

    /// <summary>
    /// Username unic pentru utilizator
    /// </summary>
    public required string Username { get; set; }

    /// <summary>
    /// Email pentru autentificare și notificări
    /// </summary>
    public required string Email { get; set; }

    /// <summary>
    /// Hash-ul parolei (nu stocăm parola în clar!)
    /// </summary>
    public required string PasswordHash { get; set; }

    /// <summary>
    /// Data creării contului
    /// </summary>
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Profilul personalizabil al utilizatorului
    /// </summary>
    public UserProfile? Profile { get; set; }

    /// <summary>
    /// Postările din feed create de utilizator
    /// </summary>
    public List<Post> Posts { get; set; } = new();
}
