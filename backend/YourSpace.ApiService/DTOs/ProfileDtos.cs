namespace YourSpace.ApiService.DTOs;

/// <summary>
/// DTO pentru profilul public al unui utilizator
/// </summary>
public class UserProfileDto
{
    public int Id { get; set; }
    public int UserId { get; set; }
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string CustomHtml { get; set; } = string.Empty;
    public string CustomCss { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public DateTime UpdatedAt { get; set; }
}

/// <summary>
/// DTO pentru update profil (PUT)
/// </summary>
public class UpdateProfileDto
{
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string CustomHtml { get; set; } = string.Empty;
    public string CustomCss { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
}
