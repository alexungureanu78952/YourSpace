using Xunit;
using Moq;
using System.Threading.Tasks;
using YourSpace.ApiService.Services;
using YourSpace.ApiService.DTOs;
using YourSpace.Data;
using YourSpace.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace YourSpace.ApiService.Tests
{
    public class UserServiceTests
    {


        [Fact]
        public async Task GetAllUsersAsync_ReturnsAllUsers()
        {
            var usersList = new[]
            {
                new User { Id = 1, Username = "ana", Email = "ana@email.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow },
                new User { Id = 2, Username = "bob", Email = "bob@email.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow }
            };
            var repo = new Mock<YourSpace.Data.Repositories.IUserRepository>();
            repo.Setup(r => r.GetAllUsersAsync()).ReturnsAsync(usersList);
            var logger = new Mock<Microsoft.Extensions.Logging.ILogger<UserService>>();
            var service = new UserService(repo.Object, logger.Object);
            var users = await service.GetAllUsersAsync();
            Assert.Equal(2, users.Count());
        }

        [Fact]
        public async Task GetUserByIdAsync_ReturnsUser_WhenFound()
        {
            var userEntity = new User { Id = 1, Username = "ana", Email = "ana@email.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow };
            var repo = new Mock<YourSpace.Data.Repositories.IUserRepository>();
            repo.Setup(r => r.GetUserByIdAsync(1)).ReturnsAsync(userEntity);
            var logger = new Mock<Microsoft.Extensions.Logging.ILogger<UserService>>();
            var service = new UserService(repo.Object, logger.Object);
            var user = await service.GetUserByIdAsync(1);
            Assert.NotNull(user);
            Assert.Equal("ana", user.Username);
        }

        [Fact]
        public async Task GetUserByIdAsync_ReturnsNull_WhenNotFound()
        {
            var repo = new Mock<YourSpace.Data.Repositories.IUserRepository>();
            repo.Setup(r => r.GetUserByIdAsync(99)).ReturnsAsync((User?)null);
            var logger = new Mock<Microsoft.Extensions.Logging.ILogger<UserService>>();
            var service = new UserService(repo.Object, logger.Object);
            var user = await service.GetUserByIdAsync(99);
            Assert.Null(user);
        }
    }
}
