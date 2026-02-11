using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using YourSpace.ApiService.Controllers;
using YourSpace.ApiService.Services;
using YourSpace.ApiService.DTOs;
using Microsoft.Extensions.Logging;
using System.Collections.Generic;

namespace YourSpace.ApiService.Tests
{
    public class UsersControllerTests
    {
        [Fact]
        public async Task GetUsers_ReturnsOkWithList()
        {
            var mock = new Mock<IUserService>();
            mock.Setup(s => s.GetAllUsersAsync()).ReturnsAsync(new List<UserDto> { new UserDto() });
            var logger = new Mock<ILogger<UsersController>>();
            var ctrl = new UsersController(mock.Object, logger.Object);
            var result = await ctrl.GetUsers();
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.IsAssignableFrom<IEnumerable<UserDto>>(ok.Value);
        }

        [Fact]
        public async Task GetUser_ReturnsOk_WhenFound()
        {
            var mock = new Mock<IUserService>();
            mock.Setup(s => s.GetUserByIdAsync(1)).ReturnsAsync(new UserDetailDto());
            var logger = new Mock<ILogger<UsersController>>();
            var ctrl = new UsersController(mock.Object, logger.Object);
            var result = await ctrl.GetUser(1);
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.IsType<UserDetailDto>(ok.Value);
        }

        [Fact]
        public async Task GetUser_ReturnsNotFound_WhenMissing()
        {
            var mock = new Mock<IUserService>();
            mock.Setup(s => s.GetUserByIdAsync(2)).ReturnsAsync((UserDetailDto)null);
            var logger = new Mock<ILogger<UsersController>>();
            var ctrl = new UsersController(mock.Object, logger.Object);
            var result = await ctrl.GetUser(2);
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetUsers_ReturnsServerError_WhenServiceThrows()
        {
            var mock = new Mock<IUserService>();
            mock.Setup(s => s.GetAllUsersAsync()).ThrowsAsync(new System.Exception("DB error"));
            var logger = new Mock<ILogger<UsersController>>();
            var ctrl = new UsersController(mock.Object, logger.Object);
            var result = await ctrl.GetUsers();
            Assert.IsType<ObjectResult>(result.Result);
            var obj = (ObjectResult)result.Result;
            Assert.Equal(500, obj.StatusCode);
        }

        [Fact]
        public async Task GetUser_ReturnsServerError_WhenServiceThrows()
        {
            var mock = new Mock<IUserService>();
            mock.Setup(s => s.GetUserByIdAsync(It.IsAny<int>())).ThrowsAsync(new System.Exception("DB error"));
            var logger = new Mock<ILogger<UsersController>>();
            var ctrl = new UsersController(mock.Object, logger.Object);
            var result = await ctrl.GetUser(1);
            Assert.IsType<ObjectResult>(result.Result);
            var obj = (ObjectResult)result.Result;
            Assert.Equal(500, obj.StatusCode);
        }
    }
}
