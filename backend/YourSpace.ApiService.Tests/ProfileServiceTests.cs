using Xunit;
using Moq;
using System.Threading.Tasks;
using YourSpace.ApiService.Services;
using YourSpace.ApiService.DTOs;
using YourSpace.Data;
using YourSpace.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using Microsoft.EntityFrameworkCore.InMemory;
using System.Collections.Generic;

namespace YourSpace.ApiService.Tests
{
    /// <summary>
    /// Unit tests for ProfileService (sanitization, validation, mapping)
    /// </summary>
    public class ProfileServiceTests
    {


        [Fact]
        public async Task UpdateProfileAsync_SanitizesHtmlAndCss()
        {
            // Arrange
            var db = new YourSpace.Data.YourSpaceDbContext(new DbContextOptionsBuilder<YourSpace.Data.YourSpaceDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
            db.UserProfiles.Add(new UserProfile { Id = 1, UserId = 1, DisplayName = "Test", Bio = "", CustomHtml = "", CustomCss = "", AvatarUrl = null, UpdatedAt = DateTime.UtcNow });
            db.SaveChanges();
            var service = new ProfileService(db);
            var dto = new UpdateProfileDto
            {
                DisplayName = "Test",
                Bio = "bio",
                CustomHtml = "<div><script>alert('x')</script>safe</div>",
                CustomCss = "body{/*comment*/}expression(alert(1));color:red;<script>evil()</script>",
                AvatarUrl = null
            };
            // Act
            var result = await service.UpdateProfileAsync(1, dto);
            // Assert
            Assert.DoesNotContain("<script", result.CustomHtml, StringComparison.OrdinalIgnoreCase);
            Assert.DoesNotContain("expression", result.CustomCss, StringComparison.OrdinalIgnoreCase);
            Assert.DoesNotContain("<script", result.CustomCss, StringComparison.OrdinalIgnoreCase);
            Assert.DoesNotContain("/*", result.CustomCss, StringComparison.OrdinalIgnoreCase);
        }

        [Fact]
        public async Task UpdateProfileAsync_RejectsOversizeHtmlOrCss()
        {
            var db = new YourSpace.Data.YourSpaceDbContext(new DbContextOptionsBuilder<YourSpace.Data.YourSpaceDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
            db.UserProfiles.Add(new UserProfile { Id = 2, UserId = 2, DisplayName = "Test2", Bio = "", CustomHtml = "", CustomCss = "", AvatarUrl = null, UpdatedAt = DateTime.UtcNow });
            db.SaveChanges();
            var service = new ProfileService(db);
            var dto = new UpdateProfileDto
            {
                DisplayName = "Test2",
                Bio = "bio",
                CustomHtml = new string('a', 50_001),
                CustomCss = "css"
            };
            await Assert.ThrowsAsync<ArgumentException>(() => service.UpdateProfileAsync(2, dto));
            dto.CustomHtml = "html";
            dto.CustomCss = new string('b', 20_001);
            await Assert.ThrowsAsync<ArgumentException>(() => service.UpdateProfileAsync(2, dto));
        }

        [Fact]
        public async Task GetProfileByUsernameAsync_ReturnsNullIfNotFound()
        {
            var db = new YourSpace.Data.YourSpaceDbContext(new DbContextOptionsBuilder<YourSpace.Data.YourSpaceDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
            var service = new ProfileService(db);
            var result = await service.GetProfileByUsernameAsync("nouser");
            Assert.Null(result);
        }

        [Fact]
        public async Task UpdateProfileAsync_Throws_WhenProfileNotFound()
        {
            // Arrange
            var db = new YourSpace.Data.YourSpaceDbContext(new DbContextOptionsBuilder<YourSpace.Data.YourSpaceDbContext>().UseInMemoryDatabase(Guid.NewGuid().ToString()).Options);
            var service = new ProfileService(db);
            var dto = new UpdateProfileDto { DisplayName = "Test", Bio = "bio" };
            // Act & Assert
            await Assert.ThrowsAsync<KeyNotFoundException>(() => service.UpdateProfileAsync(999, dto));
        }


    }
}
