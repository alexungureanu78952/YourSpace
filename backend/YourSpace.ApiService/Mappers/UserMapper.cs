using YourSpace.ApiService.DTOs;
using YourSpace.Data.Models;

namespace YourSpace.ApiService.Mappers;

/// <summary>
/// Mapper pentru conversii între entități User și DTOs
/// Pattern: Static mapper pentru simplicitate (alternativa ar fi AutoMapper)
/// </summary>
public static class UserMapper
{
    /// <summary>
    /// Convertește User entity la UserDto
    /// </summary>
    public static UserDto ToDto(User user)
    {
        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            CreatedAt = user.CreatedAt,
            DisplayName = user.Profile?.DisplayName ?? user.Username
        };
    }

    /// <summary>
    /// Convertește User entity la UserDetailDto (cu detalii complete)
    /// </summary>
    public static UserDetailDto ToDetailDto(User user)
    {
        return new UserDetailDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            CreatedAt = user.CreatedAt,
            DisplayName = user.Profile?.DisplayName ?? user.Username,
            Profile = user.Profile != null ? ToProfileDto(user.Profile) : null,
            PostsCount = user.Posts?.Count ?? 0
        };
    }

    /// <summary>
    /// Convertește UserProfile entity la UserProfileDto
    /// </summary>
    public static UserProfileDto ToProfileDto(UserProfile profile)
    {
        return new UserProfileDto
        {
            Id = profile.Id,
            UserId = profile.UserId,
            DisplayName = profile.DisplayName ?? string.Empty,
            Bio = profile.Bio ?? string.Empty,
            AvatarUrl = profile.AvatarUrl,
            CustomHtml = profile.CustomHtml ?? string.Empty,
            CustomCss = profile.CustomCss ?? string.Empty,
            UpdatedAt = profile.UpdatedAt
        };
    }
}
