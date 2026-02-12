
using Microsoft.EntityFrameworkCore;
using YourSpace.ApiService.DTOs;
using YourSpace.Data;
using YourSpace.Data.Models;
using Ganss.Xss;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Implementare pentru gestionarea profilurilor utilizatorilor
/// </summary>
public class ProfileService : IProfileService
{
    private readonly YourSpaceDbContext _db;
    public ProfileService(YourSpaceDbContext db)
    {
        _db = db;
    }

    public async Task<UserProfileDto?> GetProfileByUsernameAsync(string username)
    {
        try
        {
            var profile = await _db.UserProfiles
                .Include(p => p.User)
                .FirstOrDefaultAsync(p => p.User.Username == username);
            if (profile == null) return null;
            return MapToDto(profile);
        }
        catch (Exception)
        {
            // Let the exception bubble up for test coverage
            throw;
        }
    }

    public async Task<UserProfileDto?> UpdateProfileAsync(int userId, UpdateProfileDto dto)
    {
        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null)
            throw new KeyNotFoundException($"Profile for userId {userId} not found.");

        // Validare lungime (max 50KB HTML, 20KB CSS)
        if (dto.CustomHtml.Length > 50_000 || dto.CustomCss.Length > 20_000)
            throw new ArgumentException("CustomHtml sau CustomCss depășește limita de dimensiune.");

        // Sanitizare HTML și CSS
        var htmlSanitizer = new HtmlSanitizer();
        htmlSanitizer.AllowedCssProperties.Add("background");
        htmlSanitizer.AllowedCssProperties.Add("color");
        htmlSanitizer.AllowedCssProperties.Add("font-size");
        htmlSanitizer.AllowedCssProperties.Add("font-family");
        htmlSanitizer.AllowedCssProperties.Add("margin");
        htmlSanitizer.AllowedCssProperties.Add("padding");
        htmlSanitizer.AllowedCssProperties.Add("border");
        htmlSanitizer.AllowedCssProperties.Add("text-align");
        htmlSanitizer.AllowedCssProperties.Add("width");
        htmlSanitizer.AllowedCssProperties.Add("height");
        htmlSanitizer.AllowedCssProperties.Add("display");
        htmlSanitizer.AllowedCssProperties.Add("max-width");
        htmlSanitizer.AllowedCssProperties.Add("min-width");
        htmlSanitizer.AllowedCssProperties.Add("max-height");
        htmlSanitizer.AllowedCssProperties.Add("min-height");
        // ...poți adăuga mai multe după nevoie

        var sanitizedHtml = htmlSanitizer.Sanitize(dto.CustomHtml);
        // TODO: Replace with a robust CSS sanitizer when available
        var sanitizedCss = SanitizeCss(dto.CustomCss);

        profile.DisplayName = dto.DisplayName;
        profile.Bio = dto.Bio;
        profile.CustomHtml = sanitizedHtml;
        profile.CustomCss = sanitizedCss;
        profile.AvatarUrl = dto.AvatarUrl;
        profile.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return MapToDto(profile);
    }

    /// <summary>
    /// Simple CSS sanitizer: removes <script> and expression() and strips comments. Not bulletproof, but blocks most attacks.
    /// </summary>
    private static string SanitizeCss(string css)
    {
        if (string.IsNullOrWhiteSpace(css)) return string.Empty;
        // Remove script tags
        css = System.Text.RegularExpressions.Regex.Replace(css, "<script.*?>.*?</script>", string.Empty, System.Text.RegularExpressions.RegexOptions.Singleline | System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        // Remove expression() (JS in CSS)
        css = System.Text.RegularExpressions.Regex.Replace(css, "expression\\s*\\(.*?\\)", string.Empty, System.Text.RegularExpressions.RegexOptions.IgnoreCase);
        // Remove comments
        css = System.Text.RegularExpressions.Regex.Replace(css, @"/\\*.*?\\*/", string.Empty, System.Text.RegularExpressions.RegexOptions.Singleline);
        // Optionally, restrict allowed properties here
        return css.Trim();
    }

    private static UserProfileDto MapToDto(UserProfile profile) => new()
    {
        Id = profile.Id,
        UserId = profile.UserId,
        DisplayName = profile.DisplayName,
        Bio = profile.Bio,
        CustomHtml = profile.CustomHtml,
        CustomCss = profile.CustomCss,
        AvatarUrl = profile.AvatarUrl,
        UpdatedAt = profile.UpdatedAt
    };

    /// <summary>
    /// Editare profil (avatar, html, css) pentru userul autentificat
    /// </summary>
    public async Task<ProfileDto?> UpdateProfileAsync(int userId, EditProfileRequest request)
    {
        var profile = await _db.UserProfiles.FirstOrDefaultAsync(p => p.UserId == userId);
        if (profile == null) return null;
        // Validare și sanitizare
        if (request.Html.Length > 50_000 || request.Css.Length > 20_000)
            throw new ArgumentException("Html sau Css depășește limita de dimensiune.");
        var htmlSanitizer = new Ganss.Xss.HtmlSanitizer();
        var sanitizedHtml = htmlSanitizer.Sanitize(request.Html);
        var sanitizedCss = SanitizeCss(request.Css);
        profile.AvatarUrl = request.AvatarUrl;
        profile.CustomHtml = sanitizedHtml;
        profile.CustomCss = sanitizedCss;
        profile.UpdatedAt = DateTime.UtcNow;
        await _db.SaveChangesAsync();
        return new ProfileDto
        {
            UserId = userId,
            AvatarUrl = profile.AvatarUrl,
            Html = profile.CustomHtml,
            Css = profile.CustomCss
        };
    }
}
