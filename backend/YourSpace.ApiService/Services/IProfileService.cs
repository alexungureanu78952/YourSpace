using YourSpace.ApiService.DTOs;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Interfață pentru serviciul de gestionare a profilurilor utilizatorilor
/// </summary>
public interface IProfileService
{
    /// <summary>
    /// Obține profilul public după username
    /// </summary>
    Task<UserProfileDto?> GetProfileByUsernameAsync(string username);

    /// <summary>
    /// Actualizează profilul utilizatorului (doar owner-ul poate)
    /// </summary>
    Task<UserProfileDto?> UpdateProfileAsync(int userId, UpdateProfileDto dto);

    /// <summary>
    /// Editare profil (avatar, html, css) pentru userul autentificat
    /// </summary>
    Task<ProfileDto?> UpdateProfileAsync(int userId, EditProfileRequest request);
}
