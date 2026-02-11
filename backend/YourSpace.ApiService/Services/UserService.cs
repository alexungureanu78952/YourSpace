using YourSpace.ApiService.DTOs;
using YourSpace.ApiService.Mappers;
using YourSpace.Data.Repositories;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Implementarea serviciului pentru gestionarea utilizatorilor
/// Business logic layer - separat de controller și repository
/// </summary>
public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;
    private readonly ILogger<UserService> _logger;

    public UserService(IUserRepository userRepository, ILogger<UserService> logger)
    {
        _userRepository = userRepository;
        _logger = logger;
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        _logger.LogInformation("Getting all users");
        try
        {
            var users = await _userRepository.GetAllUsersAsync();
            return users.Select(UserMapper.ToDto);
        }
        catch (Exception)
        {
            // Let the exception bubble up for test coverage
            throw;
        }
    }

    public async Task<UserDetailDto?> GetUserByIdAsync(int id)
    {
        _logger.LogInformation("Getting user with ID: {UserId}", id);
        try
        {
            var user = await _userRepository.GetUserByIdAsync(id);
            if (user == null)
            {
                _logger.LogWarning("User with ID {UserId} not found", id);
                return null;
            }
            return UserMapper.ToDetailDto(user);
        }
        catch (Exception)
        {
            // Let the exception bubble up for test coverage
            throw;
        }
    }

    public async Task<UserDto?> GetUserByUsernameAsync(string username)
    {
        _logger.LogInformation("Getting user with username: {Username}", username);

        var user = await _userRepository.GetUserByUsernameAsync(username);
        if (user == null)
        {
            _logger.LogWarning("User with username {Username} not found", username);
            return null;
        }

        return UserMapper.ToDto(user);
    }
}
