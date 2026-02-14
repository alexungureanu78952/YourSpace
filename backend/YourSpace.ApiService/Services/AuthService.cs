using YourSpace.ApiService.DTOs;
using YourSpace.Data.Models;
using YourSpace.Data.Repositories;
using Microsoft.Extensions.Logging;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Implementare pentru serviciul de autentificare (register, login)
/// </summary>
public class AuthService : IAuthService
{
    private readonly IUserRepository _userRepository;
    private readonly JwtTokenService _jwtTokenService;
    private readonly ILogger<AuthService> _logger;

    public AuthService(IUserRepository userRepository, JwtTokenService jwtTokenService, ILogger<AuthService> logger)
    {
        _userRepository = userRepository;
        _jwtTokenService = jwtTokenService;
        _logger = logger;
    }

    public async Task<AuthResponse> RegisterAsync(CreateUserRequest request)
    {
        try
        {
            // Validare simplă (poți adăuga FluentValidation ulterior)
            if (string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return new AuthResponse { Success = false, Message = "Toate câmpurile sunt obligatorii." };
            }
            if (await _userRepository.UsernameExistsAsync(request.Username))
            {
                return new AuthResponse { Success = false, Message = "Username deja folosit." };
            }
            if (await _userRepository.EmailExistsAsync(request.Email))
            {
                return new AuthResponse { Success = false, Message = "Email deja folosit." };
            }

            var user = new User
            {
                Username = request.Username,
                Email = request.Email,
                PasswordHash = PasswordHasher.HashPassword(request.Password),
                CreatedAt = DateTime.UtcNow
            };
            await _userRepository.CreateUserAsync(user);

            // Generează JWT
            var token = _jwtTokenService.GenerateToken(user);
            return new AuthResponse
            {
                Success = true,
                Message = "Bine ai venit, " + user.Username + "!",
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt,
                    DisplayName = user.Username,
                    Profile = null
                },
                Token = token
            };
        }
        catch (Exception)
        {
            // Let the exception bubble up for test coverage
            throw;
        }
    }

    public async Task<AuthResponse> LoginAsync(LoginRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.UsernameOrEmail) || string.IsNullOrWhiteSpace(request.Password))
            {
                return new AuthResponse { Success = false, Message = "Toate câmpurile sunt obligatorii." };
            }

            var user = await _userRepository.GetUserByUsernameAsync(request.UsernameOrEmail)
                ?? await _userRepository.GetUserByEmailAsync(request.UsernameOrEmail);

            if (user == null || !PasswordHasher.VerifyPassword(request.Password, user.PasswordHash))
            {
                return new AuthResponse { Success = false, Message = "Username/email sau parolă incorectă." };
            }

            // Generează JWT
            var token = _jwtTokenService.GenerateToken(user);
            return new AuthResponse
            {
                Success = true,
                Message = "Bine ai revenit, " + user.Username + "!",
                User = new UserDto
                {
                    Id = user.Id,
                    Username = user.Username,
                    Email = user.Email,
                    CreatedAt = user.CreatedAt,
                    DisplayName = user.Username,
                    Profile = null
                },
                Token = token
            };
        }
        catch (Exception)
        {
            // Let the exception bubble up for test coverage
            throw;
        }
    }
}
