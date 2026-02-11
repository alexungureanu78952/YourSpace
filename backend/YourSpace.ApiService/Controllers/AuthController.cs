using Microsoft.AspNetCore.Mvc;
using YourSpace.ApiService.DTOs;
using YourSpace.ApiService.Services;

namespace YourSpace.ApiService.Controllers;

/// <summary>
/// Controller pentru autentificare (register, login)
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    /// <summary>
    /// Înregistrează un utilizator nou
    /// </summary>
    [HttpPost("register")]
    public async Task<ActionResult<AuthResponse>> Register([FromBody] CreateUserRequest request)
    {
        try
        {
            var result = await _authService.RegisterAsync(request);
            if (!result.Success)
                return BadRequest(result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in Register");
            return StatusCode(500, new { message = "A apărut o eroare la înregistrare." });
        }
    }

    /// <summary>
    /// Autentifică un utilizator existent
    /// </summary>
    [HttpPost("login")]
    public async Task<ActionResult<AuthResponse>> Login([FromBody] LoginRequest request)
    {
        try
        {
            var result = await _authService.LoginAsync(request);
            if (!result.Success)
                return BadRequest(result);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in Login");
            return StatusCode(500, new { message = "A apărut o eroare la autentificare." });
        }
    }
}
