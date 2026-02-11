using BCrypt.Net;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Serviciu pentru hash-are și verificare parole folosind BCrypt
/// </summary>
public static class PasswordHasher
{
    /// <summary>
    /// Generează hash pentru o parolă
    /// </summary>
    public static string HashPassword(string password)
    {
        return BCrypt.Net.BCrypt.HashPassword(password);
    }

    /// <summary>
    /// Verifică dacă parola introdusă corespunde hash-ului
    /// </summary>
    public static bool VerifyPassword(string password, string passwordHash)
    {
        return BCrypt.Net.BCrypt.Verify(password, passwordHash);
    }
}
