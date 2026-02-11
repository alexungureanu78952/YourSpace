using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using YourSpace.ApiService.Controllers;
using YourSpace.ApiService.Services;
using YourSpace.ApiService.DTOs;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using System;

namespace YourSpace.ApiService.Tests
{
    public class ProfilesControllerTests
    {
        [Fact]
        public async Task UpdateProfile_ReturnsUnauthorized_WhenNoAuth()
        {
            var mock = new Mock<IProfileService>();
            var ctrl = new ProfilesController(mock.Object);
            ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() };
            var result = await ctrl.UpdateProfile(new UpdateProfileDto());
            Assert.IsType<UnauthorizedResult>(result.Result);
        }
        [Fact]
        public async Task GetProfile_ReturnsOk_WhenFound()
        {
            var mock = new Mock<IProfileService>();
            mock.Setup(s => s.GetProfileByUsernameAsync("user")).ReturnsAsync(new UserProfileDto());
            var ctrl = new ProfilesController(mock.Object);
            var result = await ctrl.GetProfile("user");
            var ok = Assert.IsType<OkObjectResult>(result.Result);
            Assert.IsType<UserProfileDto>(ok.Value);
        }

        [Fact]
        public async Task GetProfile_ReturnsNotFound_WhenMissing()
        {
            var mock = new Mock<IProfileService>();
            mock.Setup(s => s.GetProfileByUsernameAsync("nouser")).ReturnsAsync((UserProfileDto)null);
            var ctrl = new ProfilesController(mock.Object);
            var result = await ctrl.GetProfile("nouser");
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task UpdateProfile_ReturnsUnauthorized_WhenNoUserId()
        {
            var mock = new Mock<IProfileService>();
            var ctrl = new ProfilesController(mock.Object);
            ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() };
            var result = await ctrl.UpdateProfile(new UpdateProfileDto());
            Assert.IsType<UnauthorizedResult>(result.Result);
        }

        [Fact]
        public async Task UpdateProfile_ReturnsOk_WhenSuccess()
        {
            var mock = new Mock<IProfileService>();
            mock.Setup(s => s.UpdateProfileAsync(1, It.IsAny<UpdateProfileDto>())).ReturnsAsync(new UserProfileDto());
            var ctrl = new ProfilesController(mock.Object);
            var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("sub", "1") }));
            ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user } };
            var result = await ctrl.UpdateProfile(new UpdateProfileDto());
            Assert.IsType<OkObjectResult>(result.Result);
        }

        [Fact]
        public async Task UpdateProfile_ReturnsNotFound_WhenMissing()
        {
            var mock = new Mock<IProfileService>();
            mock.Setup(s => s.UpdateProfileAsync(1, It.IsAny<UpdateProfileDto>())).ReturnsAsync((UserProfileDto)null);
            var ctrl = new ProfilesController(mock.Object);
            var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("sub", "1") }));
            ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user } };
            var result = await ctrl.UpdateProfile(new UpdateProfileDto());
            Assert.IsType<NotFoundObjectResult>(result.Result);
        }

        [Fact]
        public async Task GetProfile_ReturnsInternalServerError_OnException()
        {
            var mock = new Mock<IProfileService>();
            mock.Setup(s => s.GetProfileByUsernameAsync(It.IsAny<string>())).ThrowsAsync(new Exception("Test exception"));
            var ctrl = new ProfilesController(mock.Object);
            var result = await ctrl.GetProfile("user");
            var objectResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, objectResult.StatusCode);
        }

        [Fact]
        public async Task UpdateProfile_ReturnsInternalServerError_OnException()
        {
            var mock = new Mock<IProfileService>();
            mock.Setup(s => s.UpdateProfileAsync(It.IsAny<int>(), It.IsAny<UpdateProfileDto>())).ThrowsAsync(new Exception("Test exception"));
            var ctrl = new ProfilesController(mock.Object);
            var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("sub", "1") }));
            ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user } };
            var result = await ctrl.UpdateProfile(new UpdateProfileDto());
            var objectResult = Assert.IsType<ObjectResult>(result.Result);
            Assert.Equal(500, objectResult.StatusCode);
        }
    }
}
