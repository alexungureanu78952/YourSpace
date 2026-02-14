using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using System.Threading.Tasks;
using YourSpace.ApiService.Controllers;
using YourSpace.ApiService.Services;
using YourSpace.ApiService.DTOs;
using YourSpace.ApiService.Common;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Logging;

namespace YourSpace.ApiService.Tests;

/// <summary>
/// Unit tests for FollowsController (TDD - Test First approach)
/// </summary>
public class FollowsControllerTests
{
    [Fact]
    public async Task FollowUser_ReturnsUnauthorized_WhenNoAuth()
    {
        // Arrange
        var mock = new Mock<IFollowService>();
        var logger = new Mock<ILogger<FollowsController>>();
        var ctrl = new FollowsController(mock.Object, logger.Object);
        ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() };

        // Act
        var result = await ctrl.FollowUser(2);

        // Assert
        Assert.IsType<UnauthorizedResult>(result.Result);
    }

    [Fact]
    public async Task FollowUser_ReturnsOk_WhenSuccessful()
    {
        // Arrange
        var mock = new Mock<IFollowService>();
        var followDto = new FollowDto { Id = 1, FollowerId = 1, FollowedId = 2, CreatedAt = DateTime.UtcNow };
        mock.Setup(s => s.FollowUserAsync(1, 2)).ReturnsAsync(Result<FollowDto>.Success(followDto));

        var logger = new Mock<ILogger<FollowsController>>();
        var ctrl = new FollowsController(mock.Object, logger.Object);
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("sub", "1") }));
        ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user } };

        // Act
        var result = await ctrl.FollowUser(2);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        Assert.IsType<FollowDto>(okResult.Value);
    }

    [Fact]
    public async Task FollowUser_ReturnsBadRequest_WhenServiceReturnsError()
    {
        // Arrange
        var mock = new Mock<IFollowService>();
        mock.Setup(s => s.FollowUserAsync(1, 1)).ReturnsAsync(Result<FollowDto>.Failure("Cannot follow yourself"));

        var logger = new Mock<ILogger<FollowsController>>();
        var ctrl = new FollowsController(mock.Object, logger.Object);
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("sub", "1") }));
        ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user } };

        // Act
        var result = await ctrl.FollowUser(1);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result.Result);
    }

    [Fact]
    public async Task UnfollowUser_ReturnsUnauthorized_WhenNoAuth()
    {
        // Arrange
        var mock = new Mock<IFollowService>();
        var logger = new Mock<ILogger<FollowsController>>();
        var ctrl = new FollowsController(mock.Object, logger.Object);
        ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext() };

        // Act
        var result = await ctrl.UnfollowUser(2);

        // Assert
        Assert.IsType<UnauthorizedResult>(result);
    }

    [Fact]
    public async Task UnfollowUser_ReturnsOk_WhenSuccessful()
    {
        // Arrange
        var mock = new Mock<IFollowService>();
        mock.Setup(s => s.UnfollowUserAsync(1, 2)).ReturnsAsync(Result.Success());

        var logger = new Mock<ILogger<FollowsController>>();
        var ctrl = new FollowsController(mock.Object, logger.Object);
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("sub", "1") }));
        ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user } };

        // Act
        var result = await ctrl.UnfollowUser(2);

        // Assert
        Assert.IsType<OkResult>(result);
    }

    [Fact]
    public async Task UnfollowUser_ReturnsBadRequest_WhenServiceReturnsError()
    {
        // Arrange
        var mock = new Mock<IFollowService>();
        mock.Setup(s => s.UnfollowUserAsync(1, 2)).ReturnsAsync(Result.Failure("Not following this user"));

        var logger = new Mock<ILogger<FollowsController>>();
        var ctrl = new FollowsController(mock.Object, logger.Object);
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("sub", "1") }));
        ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user } };

        // Act
        var result = await ctrl.UnfollowUser(2);

        // Assert
        Assert.IsType<BadRequestObjectResult>(result);
    }

    [Fact]
    public async Task IsFollowing_ReturnsOk_WithFollowingStatus()
    {
        // Arrange
        var mock = new Mock<IFollowService>();
        mock.Setup(s => s.IsFollowingAsync(1, 2)).ReturnsAsync(true);

        var logger = new Mock<ILogger<FollowsController>>();
        var ctrl = new FollowsController(mock.Object, logger.Object);

        // Act
        var result = await ctrl.IsFollowing(1, 2);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var isFollowingDto = Assert.IsType<IsFollowingDto>(okResult.Value);
        Assert.True(isFollowingDto.IsFollowing);
    }

    [Fact]
    public async Task GetFollowStats_ReturnsOk_WithStats()
    {
        // Arrange
        var mock = new Mock<IFollowService>();
        mock.Setup(s => s.GetFollowersCountAsync(1)).ReturnsAsync(10);
        mock.Setup(s => s.GetFollowingCountAsync(1)).ReturnsAsync(5);

        var logger = new Mock<ILogger<FollowsController>>();
        var ctrl = new FollowsController(mock.Object, logger.Object);

        // Act
        var result = await ctrl.GetFollowStats(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(result.Result);
        var stats = Assert.IsType<FollowStatsDto>(okResult.Value);
        Assert.Equal(10, stats.FollowersCount);
        Assert.Equal(5, stats.FollowingCount);
    }

    [Fact]
    public async Task FollowUser_ReturnsInternalServerError_OnException()
    {
        // Arrange
        var mock = new Mock<IFollowService>();
        mock.Setup(s => s.FollowUserAsync(It.IsAny<int>(), It.IsAny<int>()))
            .ThrowsAsync(new System.Exception("Test exception"));

        var logger = new Mock<ILogger<FollowsController>>();
        var ctrl = new FollowsController(mock.Object, logger.Object);
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("sub", "1") }));
        ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user } };

        // Act
        var result = await ctrl.FollowUser(2);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(result.Result);
        Assert.Equal(500, objectResult.StatusCode);
    }

    [Fact]
    public async Task UnfollowUser_ReturnsInternalServerError_OnException()
    {
        // Arrange
        var mock = new Mock<IFollowService>();
        mock.Setup(s => s.UnfollowUserAsync(It.IsAny<int>(), It.IsAny<int>()))
            .ThrowsAsync(new System.Exception("Test exception"));

        var logger = new Mock<ILogger<FollowsController>>();
        var ctrl = new FollowsController(mock.Object, logger.Object);
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[] { new Claim("sub", "1") }));
        ctrl.ControllerContext = new ControllerContext { HttpContext = new DefaultHttpContext { User = user } };

        // Act
        var result = await ctrl.UnfollowUser(2);

        // Assert
        var objectResult = Assert.IsType<ObjectResult>(result);
        Assert.Equal(500, objectResult.StatusCode);
    }
}
