using Xunit;
using System;
using YourSpace.ApiService.Mappers;
using YourSpace.Data.Models;
using System.Collections.Generic;

namespace YourSpace.ApiService.Tests
{
    /// <summary>
    /// Unit tests for UserMapper
    /// </summary>
    public class UserMapperTests
    {
        [Fact]
        public void ToDto_MapsUserToUserDto()
        {
            // Arrange
            var user = new User
            {
                Id = 1,
                Username = "testuser",
                Email = "test@test.com",
                PasswordHash = "hash",
                CreatedAt = new DateTime(2024, 1, 1),
                Profile = new UserProfile { DisplayName = "Test User", Bio = "Bio", UpdatedAt = DateTime.UtcNow }
            };

            // Act
            var dto = UserMapper.ToDto(user);

            // Assert
            Assert.Equal(1, dto.Id);
            Assert.Equal("testuser", dto.Username);
            Assert.Equal("test@test.com", dto.Email);
            Assert.Equal(new DateTime(2024, 1, 1), dto.CreatedAt);
            Assert.Equal("Test User", dto.DisplayName);
        }

        [Fact]
        public void ToDto_UsesUsername_WhenProfileIsNull()
        {
            // Arrange
            var user = new User
            {
                Id = 2,
                Username = "noProfile",
                Email = "no@test.com",
                PasswordHash = "hash",
                CreatedAt = DateTime.UtcNow,
                Profile = null
            };

            // Act
            var dto = UserMapper.ToDto(user);

            // Assert
            Assert.Equal("noProfile", dto.DisplayName);
        }

        [Fact]
        public void ToDto_UsesUsername_WhenDisplayNameIsNull()
        {
            // Arrange
            var user = new User
            {
                Id = 3,
                Username = "user3",
                Email = "user3@test.com",
                PasswordHash = "hash",
                CreatedAt = DateTime.UtcNow,
                Profile = new UserProfile { DisplayName = null, Bio = "Bio", UpdatedAt = DateTime.UtcNow }
            };

            // Act
            var dto = UserMapper.ToDto(user);

            // Assert
            Assert.Equal("user3", dto.DisplayName);
        }

        [Fact]
        public void ToDetailDto_MapsUserToUserDetailDto()
        {
            // Arrange
            var user = new User
            {
                Id = 4,
                Username = "detailuser",
                Email = "detail@test.com",
                PasswordHash = "hash",
                CreatedAt = new DateTime(2024, 2, 1),
                Profile = new UserProfile { DisplayName = "Detail User", Bio = "Detail Bio", AvatarUrl = "avatar.jpg", CustomHtml = "<p>HTML</p>", CustomCss = "body {}", UpdatedAt = DateTime.UtcNow },
                Posts = new List<Post>
                {
                    new Post { Id = 1, Content = "Post 1", UserId = 4, CreatedAt = DateTime.UtcNow },
                    new Post { Id = 2, Content = "Post 2", UserId = 4, CreatedAt = DateTime.UtcNow }
                }
            };

            // Act
            var dto = UserMapper.ToDetailDto(user);

            // Assert
            Assert.Equal(4, dto.Id);
            Assert.Equal("detailuser", dto.Username);
            Assert.Equal("detail@test.com", dto.Email);
            Assert.Equal(new DateTime(2024, 2, 1), dto.CreatedAt);
            Assert.Equal("Detail User", dto.DisplayName);
            Assert.NotNull(dto.Profile);
            Assert.Equal("Detail Bio", dto.Profile.Bio);
            Assert.Equal(2, dto.PostsCount);
        }

        [Fact]
        public void ToDetailDto_ReturnsZeroPostsCount_WhenPostsIsNull()
        {
            // Arrange
            var user = new User
            {
                Id = 5,
                Username = "noposts",
                Email = "noposts@test.com",
                PasswordHash = "hash",
                CreatedAt = DateTime.UtcNow,
                Profile = new UserProfile { DisplayName = "No Posts", Bio = "Bio", UpdatedAt = DateTime.UtcNow },
                Posts = null
            };

            // Act
            var dto = UserMapper.ToDetailDto(user);

            // Assert
            Assert.Equal(0, dto.PostsCount);
        }

        [Fact]
        public void ToDetailDto_ReturnsNullProfile_WhenProfileIsNull()
        {
            // Arrange
            var user = new User
            {
                Id = 6,
                Username = "noprofile",
                Email = "noprofile@test.com",
                PasswordHash = "hash",
                CreatedAt = DateTime.UtcNow,
                Profile = null,
                Posts = new List<Post>()
            };

            // Act
            var dto = UserMapper.ToDetailDto(user);

            // Assert
            Assert.Null(dto.Profile);
        }

        [Fact]
        public void ToProfileDto_MapsUserProfileToDto()
        {
            // Arrange
            var profile = new UserProfile
            {
                Id = 1,
                UserId = 1,
                DisplayName = "Profile User",
                Bio = "Profile Bio",
                AvatarUrl = "avatar.png",
                CustomHtml = "<div>Custom HTML</div>",
                CustomCss = "div { color: red; }",
                UpdatedAt = DateTime.UtcNow
            };

            // Act
            var dto = UserMapper.ToProfileDto(profile);

            // Assert
            Assert.Equal("Profile User", dto.DisplayName);
            Assert.Equal("Profile Bio", dto.Bio);
            Assert.Equal("avatar.png", dto.AvatarUrl);
            Assert.Equal("<div>Custom HTML</div>", dto.CustomHtml);
            Assert.Equal("div { color: red; }", dto.CustomCss);
        }

        [Fact]
        public void ToProfileDto_HandlesNullValues()
        {
            // Arrange
            var profile = new UserProfile
            {
                Id = 2,
                UserId = 2,
                DisplayName = null,
                Bio = null,
                AvatarUrl = null,
                CustomHtml = null,
                CustomCss = null,
                UpdatedAt = DateTime.UtcNow
            };

            // Act
            var dto = UserMapper.ToProfileDto(profile);

            // Assert
            Assert.Equal(string.Empty, dto.DisplayName);
            Assert.Equal(string.Empty, dto.Bio);
            Assert.Null(dto.AvatarUrl);
            Assert.Equal(string.Empty, dto.CustomHtml);
            Assert.Equal(string.Empty, dto.CustomCss);
        }
    }
}
