using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using YourSpace.ApiService.DTOs;
using YourSpace.ApiService.Services;

namespace YourSpace.ApiService.Controllers;

/// <summary>
/// Controller pentru gestionarea utilizatorilor
/// Responsabilitate: doar HTTP handling și routing
/// Business logic delegată la UserService
/// </summary>
/// <summary>
/// Controller pentru gestionarea utilizatorilor
/// Responsabilitate: doar HTTP handling și routing
/// Business logic delegată la UserService
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UsersController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ILogger<UsersController> _logger;

    public UsersController(IUserService userService, ILogger<UsersController> logger)
    {
        _userService = userService;
        _logger = logger;
    }

    /// <summary>
    /// Obține lista tuturor utilizatorilor
    /// GET /api/users
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        try
        {
            var users = await _userService.GetAllUsersAsync();
            return Ok(users);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error in GetUsers");
            return StatusCode(500, new { message = "A apărut o eroare la preluarea utilizatorilor." });
        }
    }

    /// <summary>
    /// Obține un utilizator specific după ID
    /// GET /api/users/5
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDetailDto>> GetUser(int id)
    {
        try
        {
            var user = await _userService.GetUserByIdAsync(id);
            if (user == null)
            {
                return NotFound(new { message = "Utilizatorul nu a fost găsit" });
            }
            return Ok(user);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error in GetUser for id {id}");
            return StatusCode(500, new { message = "A apărut o eroare la preluarea utilizatorului." });
        }
    }
}
