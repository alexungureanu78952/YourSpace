using Xunit;
using Moq;
using System.Threading.Tasks;
using System;
using YourSpace.ApiService.Services;
using YourSpace.Data.Models;
using YourSpace.Data.Repositories;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace YourSpace.ApiService.Tests
{
    public class UserServiceEdgeTests
    {
        [Fact]
        public async Task GetUserByUsernameAsync_ReturnsNull_WhenNotFound()
        {
            var repo = new Mock<IUserRepository>();
            repo.Setup(r => r.GetUserByUsernameAsync("nouser")).ReturnsAsync((User?)null);
            var logger = new Mock<ILogger<UserService>>();
            var service = new UserService(repo.Object, logger.Object);
            var result = await service.GetUserByUsernameAsync("nouser");
            Assert.Null(result);
        }

        [Fact]
        public async Task GetAllUsersAsync_ReturnsEmpty_WhenNoUsers()
        {
            var repo = new Mock<IUserRepository>();
            repo.Setup(r => r.GetAllUsersAsync()).ReturnsAsync(new List<User>());
            var logger = new Mock<ILogger<UserService>>();
            var service = new UserService(repo.Object, logger.Object);
            var result = await service.GetAllUsersAsync();
            Assert.Empty(result);
        }

        [Fact]
        public async Task GetUserByIdAsync_Throws_WhenRepositoryFails()
        {
            var repo = new Mock<IUserRepository>();
            repo.Setup(r => r.GetUserByIdAsync(It.IsAny<int>())).ThrowsAsync(new Exception("DB error"));
            var logger = new Mock<ILogger<UserService>>();
            var service = new UserService(repo.Object, logger.Object);
            await Assert.ThrowsAsync<Exception>(() => service.GetUserByIdAsync(1));
        }

        [Fact]
        public async Task GetAllUsersAsync_Throws_WhenRepositoryFails()
        {
            var repo = new Mock<IUserRepository>();
            repo.Setup(r => r.GetAllUsersAsync()).ThrowsAsync(new Exception("DB error"));
            var logger = new Mock<ILogger<UserService>>();
            var service = new UserService(repo.Object, logger.Object);
            await Assert.ThrowsAsync<Exception>(() => service.GetAllUsersAsync());
        }
    }
}
