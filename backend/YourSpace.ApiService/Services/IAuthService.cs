using YourSpace.ApiService.DTOs;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Interfață pentru serviciul de autentificare (register, login)
/// </summary>
public interface IAuthService
{
    /// <summary>
    /// Înregistrează un utilizator nou
    /// </summary>
    Task<AuthResponse> RegisterAsync(CreateUserRequest request);

    /// <summary>
    /// Autentifică un utilizator existent
    /// </summary>
    Task<AuthResponse> LoginAsync(LoginRequest request);
}
