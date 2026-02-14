using Xunit;
using Moq;
using Microsoft.AspNetCore.Mvc;
using YourSpace.ApiService.Controllers;
using YourSpace.ApiService.Services;
using YourSpace.ApiService.DTOs;
using YourSpace.ApiService.Common;
using System.Security.Claims;
using Microsoft.AspNetCore.Http;

namespace YourSpace.ApiService.Tests;

/// <summary>
/// Unit tests for PostsController following TDD principles
/// </summary>
public class PostsControllerTests
{
    private readonly Mock<IPostService> _mockPostService;
    private readonly PostsController _controller;

    public PostsControllerTests()
    {
        _mockPostService = new Mock<IPostService>();
        _controller = new PostsController(_mockPostService.Object);

        // Mock authenticated user context
        var user = new ClaimsPrincipal(new ClaimsIdentity(new[]
        {
            new Claim(ClaimTypes.NameIdentifier, "1")
        }, "TestAuth"));

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };
    }

    [Fact]
    public async Task CreatePost_Success_ReturnsCreatedAtAction()
    {
        // Arrange
        var createDto = new CreatePostDto { Content = "Test post" };
        var postDto = new PostDto
        {
            Id = 1,
            UserId = 1,
            Username = "testuser",
            DisplayName = "Test User",
            Content = "Test post",
            CreatedAt = DateTime.UtcNow
        };
        var result = Result<PostDto>.Success(postDto);

        _mockPostService.Setup(s => s.CreatePostAsync(1, createDto))
            .ReturnsAsync(result);

        // Act
        var actionResult = await _controller.CreatePost(createDto);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
        Assert.Equal(nameof(_controller.GetPost), createdResult.ActionName);
        var returnedPost = Assert.IsType<PostDto>(createdResult.Value);
        Assert.Equal(postDto.Id, returnedPost.Id);
        Assert.Equal(postDto.Content, returnedPost.Content);
    }

    [Fact]
    public async Task CreatePost_WithMediaUrl_Success()
    {
        // Arrange
        var createDto = new CreatePostDto
        {
            Content = "Test post with media",
            MediaUrl = "https://example.com/video.mp4"
        };
        var postDto = new PostDto
        {
            Id = 1,
            UserId = 1,
            Content = createDto.Content,
            MediaUrl = createDto.MediaUrl,
            CreatedAt = DateTime.UtcNow
        };
        var result = Result<PostDto>.Success(postDto);

        _mockPostService.Setup(s => s.CreatePostAsync(1, createDto))
            .ReturnsAsync(result);

        // Act
        var actionResult = await _controller.CreatePost(createDto);

        // Assert
        var createdResult = Assert.IsType<CreatedAtActionResult>(actionResult.Result);
        var returnedPost = Assert.IsType<PostDto>(createdResult.Value);
        Assert.Equal(createDto.MediaUrl, returnedPost.MediaUrl);
    }

    [Fact]
    public async Task CreatePost_Failure_ReturnsBadRequest()
    {
        // Arrange
        var createDto = new CreatePostDto { Content = "" };
        var result = Result<PostDto>.Failure("Content cannot be empty");

        _mockPostService.Setup(s => s.CreatePostAsync(1, createDto))
            .ReturnsAsync(result);

        // Act
        var actionResult = await _controller.CreatePost(createDto);

        // Assert
        var badRequestResult = Assert.IsType<BadRequestObjectResult>(actionResult.Result);
        var error = Assert.IsType<string>(badRequestResult.Value);
        Assert.Equal("Content cannot be empty", error);
    }

    [Fact]
    public async Task CreatePost_Unauthenticated_ReturnsUnauthorized()
    {
        // Arrange
        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal();
        var createDto = new CreatePostDto { Content = "Test post" };

        // Act
        var actionResult = await _controller.CreatePost(createDto);

        // Assert
        Assert.IsType<UnauthorizedResult>(actionResult.Result);
    }

    [Fact]
    public async Task GetPost_Exists_ReturnsOk()
    {
        // Arrange
        var postDto = new PostDto
        {
            Id = 1,
            UserId = 1,
            Username = "testuser",
            Content = "Test post",
            CreatedAt = DateTime.UtcNow
        };

        _mockPostService.Setup(s => s.GetPostByIdAsync(1))
            .ReturnsAsync(postDto);

        // Act
        var actionResult = await _controller.GetPost(1);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnedPost = Assert.IsType<PostDto>(okResult.Value);
        Assert.Equal(postDto.Id, returnedPost.Id);
        Assert.Equal(postDto.Content, returnedPost.Content);
    }

    [Fact]
    public async Task GetPost_NotFound_ReturnsNotFound()
    {
        // Arrange
        _mockPostService.Setup(s => s.GetPostByIdAsync(999))
            .ReturnsAsync((PostDto?)null);

        // Act
        var actionResult = await _controller.GetPost(999);

        // Assert
        Assert.IsType<NotFoundResult>(actionResult.Result);
    }

    [Fact]
    public async Task GetFeed_Success_ReturnsOkWithPosts()
    {
        // Arrange
        var feedPosts = new List<FeedPostDto>
        {
            new FeedPostDto
            {
                Id = 1,
                UserId = 2,
                Username = "followeduser",
                Content = "Post from followed",
                IsFollowing = true,
                CreatedAt = DateTime.UtcNow
            },
            new FeedPostDto
            {
                Id = 2,
                UserId = 3,
                Username = "otheruser",
                Content = "Post from other",
                IsFollowing = false,
                CreatedAt = DateTime.UtcNow.AddMinutes(-5)
            }
        };

        _mockPostService.Setup(s => s.GetFeedAsync(1, 0, 20))
            .ReturnsAsync(feedPosts);

        // Act
        var actionResult = await _controller.GetFeed(0, 20);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnedPosts = Assert.IsType<List<FeedPostDto>>(okResult.Value);
        Assert.Equal(2, returnedPosts.Count);
        Assert.True(returnedPosts[0].IsFollowing);
        Assert.False(returnedPosts[1].IsFollowing);
    }

    [Fact]
    public async Task GetFeed_Unauthenticated_ReturnsUnauthorized()
    {
        // Arrange
        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal();

        // Act
        var actionResult = await _controller.GetFeed();

        // Assert
        Assert.IsType<UnauthorizedResult>(actionResult.Result);
    }

    [Fact]
    public async Task GetFeed_WithPagination_ReturnsCorrectPage()
    {
        // Arrange
        var feedPosts = new List<FeedPostDto>
        {
            new FeedPostDto { Id = 11, Content = "Post 11", CreatedAt = DateTime.UtcNow }
        };

        _mockPostService.Setup(s => s.GetFeedAsync(1, 10, 10))
            .ReturnsAsync(feedPosts);

        // Act
        var actionResult = await _controller.GetFeed(10, 10);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnedPosts = Assert.IsType<List<FeedPostDto>>(okResult.Value);
        Assert.Single(returnedPosts);
        _mockPostService.Verify(s => s.GetFeedAsync(1, 10, 10), Times.Once);
    }

    [Fact]
    public async Task GetUserPosts_Success_ReturnsOk()
    {
        // Arrange
        var posts = new List<PostDto>
        {
            new PostDto { Id = 1, UserId = 2, Content = "Post 1", CreatedAt = DateTime.UtcNow },
            new PostDto { Id = 2, UserId = 2, Content = "Post 2", CreatedAt = DateTime.UtcNow.AddMinutes(-5) }
        };

        _mockPostService.Setup(s => s.GetUserPostsAsync(2, 0, 20))
            .ReturnsAsync(posts);

        // Act
        var actionResult = await _controller.GetUserPosts(2, 0, 20);

        // Assert
        var okResult = Assert.IsType<OkObjectResult>(actionResult.Result);
        var returnedPosts = Assert.IsType<List<PostDto>>(okResult.Value);
        Assert.Equal(2, returnedPosts.Count);
        Assert.All(returnedPosts, p => Assert.Equal(2, p.UserId));
    }

    [Fact]
    public async Task DeletePost_Success_ReturnsNoContent()
    {
        // Arrange
        var result = Result.Success();

        _mockPostService.Setup(s => s.DeletePostAsync(1, 1))
            .ReturnsAsync(result);

        // Act
        var actionResult = await _controller.DeletePost(1);

        // Assert
        Assert.IsType<NoContentResult>(actionResult);
    }

    [Fact]
    public async Task DeletePost_NotFound_ReturnsNotFound()
    {
        // Arrange
        var result = Result.Failure("Post not found");

        _mockPostService.Setup(s => s.DeletePostAsync(999, 1))
            .ReturnsAsync(result);

        // Act
        var actionResult = await _controller.DeletePost(999);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(actionResult);
        Assert.Equal("Post not found", notFoundResult.Value);
    }

    [Fact]
    public async Task DeletePost_Unauthorized_ReturnsForbid()
    {
        // Arrange
        var result = Result.Failure("You are not authorized to delete this post");

        _mockPostService.Setup(s => s.DeletePostAsync(1, 1))
            .ReturnsAsync(result);

        // Act
        var actionResult = await _controller.DeletePost(1);

        // Assert
        var forbidResult = Assert.IsType<ObjectResult>(actionResult);
        Assert.Equal(403, forbidResult.StatusCode);
        Assert.Equal("You are not authorized to delete this post", forbidResult.Value);
    }

    [Fact]
    public async Task DeletePost_Unauthenticated_ReturnsUnauthorized()
    {
        // Arrange
        _controller.ControllerContext.HttpContext.User = new ClaimsPrincipal();

        // Act
        var actionResult = await _controller.DeletePost(1);

        // Assert
        Assert.IsType<UnauthorizedResult>(actionResult);
    }
}
