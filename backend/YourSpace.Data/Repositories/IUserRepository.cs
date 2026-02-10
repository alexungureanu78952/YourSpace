using YourSpace.Data.Models;

namespace YourSpace.Data.Repositories;

/// <summary>
/// Interface pentru Repository pattern - accesul la datele utilizatorilor
/// Separă logica de acces la date de business logic
/// </summary>
public interface IUserRepository
{
    /// <summary>
    /// Obține toți utilizatorii cu profilurile lor
    /// </summary>
    Task<IEnumerable<User>> GetAllUsersAsync();

    /// <summary>
    /// Obține un utilizator după ID, cu profil și postări
    /// </summary>
    Task<User?> GetUserByIdAsync(int id);

    /// <summary>
    /// Obține un utilizator după username
    /// </summary>
    Task<User?> GetUserByUsernameAsync(string username);

    /// <summary>
    /// Obține un utilizator după email
    /// </summary>
    Task<User?> GetUserByEmailAsync(string email);

    /// <summary>
    /// Creează un utilizator nou
    /// </summary>
    Task<User> CreateUserAsync(User user);

    /// <summary>
    /// Actualizează un utilizator existent
    /// </summary>
    Task<User> UpdateUserAsync(User user);

    /// <summary>
    /// Șterge un utilizator
    /// </summary>
    Task<bool> DeleteUserAsync(int id);

    /// <summary>
    /// Verifică dacă un username există deja
    /// </summary>
    Task<bool> UsernameExistsAsync(string username);

    /// <summary>
    /// Verifică dacă un email există deja
    /// </summary>
    Task<bool> EmailExistsAsync(string email);
}
