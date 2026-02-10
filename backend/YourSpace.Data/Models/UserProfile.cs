namespace YourSpace.Data.Models;

/// <summary>
/// Profilul personalizabil al utilizatorului - "blog-ul" lor MySpace-style
/// </summary>
public class UserProfile
{
    public int Id { get; set; }

    /// <summary>
    /// ID-ul utilizatorului căruia îi aparține profilul
    /// </summary>
    public int UserId { get; set; }

    /// <summary>
    /// Numele afișat (poate fi diferit de username)
    /// </summary>
    public string DisplayName { get; set; } = string.Empty;

    /// <summary>
    /// Bio/Descriere scurtă
    /// </summary>
    public string Bio { get; set; } = string.Empty;

    /// <summary>
    /// HTML custom pentru personalizarea profilului (sanitizat!)
    /// Aici utilizatorii își pot crea blog-ul complet personalizat
    /// </summary>
    public string CustomHtml { get; set; } = string.Empty;

    /// <summary>
    /// CSS custom pentru stilizare (sanitizat!)
    /// </summary>
    public string CustomCss { get; set; } = string.Empty;

    /// <summary>
    /// URL pentru avatar/poză de profil
    /// </summary>
    public string? AvatarUrl { get; set; }

    /// <summary>
    /// Ultima dată când profilul a fost actualizat
    /// </summary>
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;

    /// <summary>
    /// Navigare către utilizator
    /// </summary>
    public User User { get; set; } = null!;
}
