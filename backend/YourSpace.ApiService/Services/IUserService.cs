using YourSpace.ApiService.DTOs;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Interface pentru serviciul de gestionare utilizatori
/// Conține business logic și orchestrează operațiile
/// </summary>
public interface IUserService
{
    /// <summary>
    /// Obține lista tuturor utilizatorilor
    /// </summary>
    Task<IEnumerable<UserDto>> GetAllUsersAsync();

    /// <summary>
    /// Obține detalii complete despre un utilizator
    /// </summary>
    Task<UserDetailDto?> GetUserByIdAsync(int id);

    /// <summary>
    /// Obține un utilizator după username
    /// </summary>
    Task<UserDto?> GetUserByUsernameAsync(string username);
}
