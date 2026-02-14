namespace YourSpace.ApiService.DTOs;

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
    public UserProfileDto? Profile { get; set; }
}

public class UserDetailDto : UserDto
{
    public UserProfileDto? Profile { get; set; }
    public int PostsCount { get; set; }
}

