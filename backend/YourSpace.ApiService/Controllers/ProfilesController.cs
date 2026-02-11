using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YourSpace.ApiService.DTOs;
using YourSpace.ApiService.Services;

namespace YourSpace.ApiService.Controllers;

/// <summary>
/// Controller pentru profiluri publice și update profil user
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class ProfilesController : ControllerBase
{
    private readonly IProfileService _profileService;
    public ProfilesController(IProfileService profileService)
    {
        _profileService = profileService;
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
