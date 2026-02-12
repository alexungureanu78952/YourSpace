using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YourSpace.ApiService.DTOs;
using YourSpace.ApiService.Services;
using Microsoft.Extensions.Logging;

namespace YourSpace.ApiService.Controllers;

/// <summary>
/// Controller pentru profiluri publice și update profil user
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProfilesController : ControllerBase
{
    private readonly IProfileService _profileService;
    private readonly ILogger<ProfilesController> _logger;

    public ProfilesController(IProfileService profileService, ILogger<ProfilesController> logger)
    {
        _profileService = profileService;
        _logger = logger;
    }

    /// <summary>
    /// Editare profil (avatar, html, css) pentru userul autentificat
    /// </summary>
    [Authorize]
    [HttpPost("edit")]
    public async Task<ActionResult<ProfileDto>> EditProfile([FromBody] EditProfileRequest request)
    {
        try
        {
            _logger.LogInformation("EditProfile called");
            // Extrage userId din JWT claims (folosește "sub" pentru JwtRegisteredClaimNames.Sub)
            var userIdClaim = User.FindFirst("sub")?.Value ?? User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value;
            _logger.LogInformation("UserId claim: {UserIdClaim}", userIdClaim);

            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
            {
                _logger.LogWarning("Unauthorized: userId claim missing or invalid");
                return Unauthorized(new { message = "Unauthorized" });
            }

            _logger.LogInformation("Updating profile for userId: {UserId}", userId);
            var updated = await _profileService.UpdateProfileAsync(userId, request);

            if (updated == null)
            {
                _logger.LogWarning("Profile not found for userId: {UserId}", userId);
                return NotFound(new { message = "Profilul nu a fost găsit" });
            }

            _logger.LogInformation("Profile updated successfully for userId: {UserId}", userId);
            return Ok(updated);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error updating profile");
            return StatusCode(500, new { message = "A apărut o eroare la actualizarea profilului.", detail = ex.Message });
        }
    }

    /// <summary>
    /// Obține profilul public după username
    /// </summary>
    [HttpGet("{username}")]
    [AllowAnonymous]
    public async Task<ActionResult<UserProfileDto>> GetProfile(string username)
    {
        try
        {
            var profile = await _profileService.GetProfileByUsernameAsync(username);
            if (profile == null) return NotFound(new { message = "Profilul nu a fost găsit" });
            return Ok(profile);
        }
        catch (Exception ex)
        {
            // TODO: Add logging here
            return StatusCode(500, new { message = "A apărut o eroare la obținerea profilului.", detail = ex.Message });
        }
    }

    /// <summary>
    /// Actualizează profilul utilizatorului curent (doar owner-ul)
    /// </summary>
    [Authorize]
    [HttpPut]
    public async Task<ActionResult<UserProfileDto>> UpdateProfile([FromBody] UpdateProfileDto dto)
    {
        try
        {
            // Extrage userId din JWT
            if (!int.TryParse(User.FindFirst("sub")?.Value, out var userId))
                return Unauthorized();
            var updated = await _profileService.UpdateProfileAsync(userId, dto);
            if (updated == null) return NotFound(new { message = "Profilul nu a fost găsit" });
            return Ok(updated);
        }
        catch (Exception ex)
        {
            // TODO: Add logging here
            return StatusCode(500, new { message = "A apărut o eroare la actualizarea profilului.", detail = ex.Message });
        }
    }
}
