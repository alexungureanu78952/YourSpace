
using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using YourSpace.ApiService.Controllers;
using YourSpace.ApiService.Services;
using YourSpace.ApiService.DTOs;
using Microsoft.Extensions.Logging;


namespace YourSpace.ApiService.Tests
{
    public class AuthControllerTests
    {
        [Fact]
        public async Task Register_ReturnsServerError_WhenModelInvalid()
        {
            var mock = new Mock<IAuthService>();
            var logger = new Mock<ILogger<AuthController>>();
            var ctrl = new AuthController(mock.Object, logger.Object);
            ctrl.ModelState.AddModelError("Username", "Required");
            var result = await ctrl.Register(new CreateUserRequest());
            var objResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.True(objResult.StatusCode == 400 || objResult.StatusCode == 500);
        }

        [Fact]
        public async Task Register_ReturnsOk_WhenSuccess()
        {
            var mock = new Mock<IAuthService>();
            mock.Setup(s => s.RegisterAsync(It.IsAny<CreateUserRequest>())).ReturnsAsync(new AuthResponse { Success = true });
            var logger = new Mock<ILogger<AuthController>>();
            var ctrl = new AuthController(mock.Object, logger.Object);
            var result = await ctrl.Register(new CreateUserRequest());
            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task Register_ReturnsBadRequest_WhenFail()
        {
            var mock = new Mock<IAuthService>();
            mock.Setup(s => s.RegisterAsync(It.IsAny<CreateUserRequest>())).ReturnsAsync(new AuthResponse { Success = false });
            var logger = new Mock<ILogger<AuthController>>();
            var ctrl = new AuthController(mock.Object, logger.Object);
            var result = await ctrl.Register(new CreateUserRequest());
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task Register_ReturnsServerError_WhenServiceThrows()
        {
            var mock = new Mock<IAuthService>();
            mock.Setup(s => s.RegisterAsync(It.IsAny<CreateUserRequest>())).ThrowsAsync(new System.Exception("DB error"));
            var logger = new Mock<ILogger<AuthController>>();
            var ctrl = new AuthController(mock.Object, logger.Object);
            var result = await ctrl.Register(new CreateUserRequest());
            Assert.IsType<ObjectResult>(result.Result);
            var obj = (ObjectResult)result.Result;
            Assert.Equal(500, obj.StatusCode);
        }

        [Fact]
        public async Task Login_ReturnsOk_WhenSuccess()
        {
            var mock = new Mock<IAuthService>();
            mock.Setup(s => s.LoginAsync(It.IsAny<LoginRequest>())).ReturnsAsync(new AuthResponse { Success = true });
            var logger = new Mock<ILogger<AuthController>>();
            var ctrl = new AuthController(mock.Object, logger.Object);
            var result = await ctrl.Login(new LoginRequest());
            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task Login_ReturnsBadRequest_WhenFail()
        {
            var mock = new Mock<IAuthService>();
            mock.Setup(s => s.LoginAsync(It.IsAny<LoginRequest>())).ReturnsAsync(new AuthResponse { Success = false });
            var logger = new Mock<ILogger<AuthController>>();
            var ctrl = new AuthController(mock.Object, logger.Object);
            var result = await ctrl.Login(new LoginRequest());
            Assert.IsType<BadRequestObjectResult>(result.Result);
        }

        [Fact]
        public async Task Login_ReturnsServerError_WhenServiceThrows()
        {
            var mock = new Mock<IAuthService>();
            mock.Setup(s => s.LoginAsync(It.IsAny<LoginRequest>())).ThrowsAsync(new System.Exception("DB error"));
            var logger = new Mock<ILogger<AuthController>>();
            var ctrl = new AuthController(mock.Object, logger.Object);
            var result = await ctrl.Login(new LoginRequest());
            Assert.IsType<ObjectResult>(result.Result);
            var obj = (ObjectResult)result.Result;
            Assert.Equal(500, obj.StatusCode);
        }
    }
}
