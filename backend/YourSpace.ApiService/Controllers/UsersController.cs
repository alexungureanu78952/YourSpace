using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using YourSpace.ApiService.DTOs;
using YourSpace.ApiService.Services;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;
using System.Linq;

namespace YourSpace.ApiService.Controllers
{
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
        [AllowAnonymous]
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

        /// <summary>
        /// Obține user-ul curent autentificat (din JWT)
        /// GET /api/users/me
        /// </summary>
        [HttpGet("me")]
        public async Task<ActionResult<UserDetailDto>> GetCurrentUser()
        {
            try
            {
                var userIdClaim = User.Claims.FirstOrDefault(c => c.Type == "sub" || c.Type == "id" || c.Type.EndsWith("nameidentifier"));
                if (userIdClaim == null)
                    return Unauthorized(new { message = "Token invalid sau lipsă claim id" });
                if (!int.TryParse(userIdClaim.Value, out var userId))
                    return Unauthorized(new { message = "Id-ul din token nu este valid" });
                var user = await _userService.GetUserByIdAsync(userId);
                if (user == null)
                    return NotFound(new { message = "Utilizatorul nu a fost găsit" });
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error in GetCurrentUser (me)");
                return StatusCode(500, new { message = "A apărut o eroare la preluarea userului curent." });
            }
        }

        /// <summary>
        /// Obține un utilizator specific după username
        /// GET /api/users/by-username/johndoe
        /// </summary>
        [HttpGet("by-username/{username}")]
        public async Task<ActionResult<UserDto>> GetUserByUsername(string username)
        {
            try
            {
                var user = await _userService.GetUserByUsernameAsync(username);
                if (user == null)
                {
                    return NotFound(new { message = "Utilizatorul nu a fost găsit" });
                }
                return Ok(user);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Error in GetUserByUsername for username {username}");
                return StatusCode(500, new { message = "A apărut o eroare la preluarea utilizatorului." });
            }
        }
    }
}
