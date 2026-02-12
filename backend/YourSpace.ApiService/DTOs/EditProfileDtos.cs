using System;

namespace YourSpace.ApiService.DTOs
{
    /// <summary>
    /// DTO pentru request de editare profil (TDD, upload avatar, html, css)
    /// </summary>
    public class EditProfileRequest
    {
        public string? AvatarUrl { get; set; }
        public string Html { get; set; } = string.Empty;
        public string Css { get; set; } = string.Empty;
    }

    /// <summary>
    /// DTO pentru profil după editare
    /// </summary>
    public class ProfileDto
    {
        public int UserId { get; set; }
        public string? AvatarUrl { get; set; }
        public string Html { get; set; } = string.Empty;
        public string Css { get; set; } = string.Empty;
    }
}
