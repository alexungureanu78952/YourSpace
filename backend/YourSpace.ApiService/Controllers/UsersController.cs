using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using YourSpace.Data;
using YourSpace.Data.Models;

namespace YourSpace.ApiService.Controllers;

/// <summary>
/// Controller pentru gestionarea utilizatorilor
/// API endpoints pentru operații CRUD pe utilizatori
/// </summary>
[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly YourSpaceDbContext _context;
    private readonly ILogger<UsersController> _logger;

    public UsersController(YourSpaceDbContext context, ILogger<UsersController> logger)
    {
        _context = context;
        _logger = logger;
    }

    /// <summary>
    /// Obține lista tuturor utilizatorilor
    /// GET /api/users
    /// </summary>
    [HttpGet]
    public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
    {
        var users = await _context.Users
            .Include(u => u.Profile) // Include și profilul utilizatorului
            .Select(u => new UserDto
            {
                Id = u.Id,
                Username = u.Username,
                Email = u.Email,
                CreatedAt = u.CreatedAt,
                DisplayName = u.Profile != null ? u.Profile.DisplayName : u.Username
            })
            .ToListAsync();

        return Ok(users);
    }

    /// <summary>
    /// Obține un utilizator specific după ID
    /// GET /api/users/5
    /// </summary>
    [HttpGet("{id}")]
    public async Task<ActionResult<UserDetailDto>> GetUser(int id)
    {
        var user = await _context.Users
            .Include(u => u.Profile)
            .Include(u => u.Posts)
            .FirstOrDefaultAsync(u => u.Id == id);

        if (user == null)
        {
            return NotFound(new { message = "Utilizatorul nu a fost găsit" });
        }

        var userDetail = new UserDetailDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            CreatedAt = user.CreatedAt,
            Profile = user.Profile != null ? new UserProfileDto
            {
                DisplayName = user.Profile.DisplayName,
                Bio = user.Profile.Bio,
                AvatarUrl = user.Profile.AvatarUrl,
                CustomHtml = user.Profile.CustomHtml,
                CustomCss = user.Profile.CustomCss
            } : null,
            PostsCount = user.Posts.Count
        };

        return Ok(userDetail);
    }
}

/// <summary>
/// DTO (Data Transfer Object) pentru răspunsuri API
/// Nu expunem direct entitățile de bază de date în API!
/// </summary>
public class UserDto
{
    public int Id { get; set; }
    public string Username { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime CreatedAt { get; set; }
    public string DisplayName { get; set; } = string.Empty;
}

public class UserDetailDto : UserDto
{
    public UserProfileDto? Profile { get; set; }
    public int PostsCount { get; set; }
}

public class UserProfileDto
{
    public string DisplayName { get; set; } = string.Empty;
    public string Bio { get; set; } = string.Empty;
    public string? AvatarUrl { get; set; }
    public string CustomHtml { get; set; } = string.Empty;
    public string CustomCss { get; set; } = string.Empty;
}
