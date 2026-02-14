using Xunit;
using System.Threading.Tasks;
using YourSpace.ApiService.Services;
using YourSpace.ApiService.DTOs;
using YourSpace.Data;
using YourSpace.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Collections.Generic;

namespace YourSpace.ApiService.Tests;

/// <summary>
/// Unit tests for PostService (TDD - Test First approach)
/// </summary>
public class PostServiceTests
{
    private YourSpaceDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<YourSpaceDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new YourSpaceDbContext(options);
    }

    [Fact]
    public async Task CreatePostAsync_CreatesPost_WithContentOnly()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var user = new User { Id = 1, Username = "test", Email = "test@test.com", PasswordHash = "hash" };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var service = new PostService(db);
        var createDto = new CreatePostDto { Content = "Hello, world!", MediaUrl = null };

        // Act
        var result = await service.CreatePostAsync(1, createDto);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal("Hello, world!", result.Value.Content);
        Assert.Null(result.Value.MediaUrl);
        Assert.Equal(1, result.Value.UserId);
    }

    [Fact]
    public async Task CreatePostAsync_CreatesPost_WithMediaUrl()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var user = new User { Id = 1, Username = "test", Email = "test@test.com", PasswordHash = "hash" };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var service = new PostService(db);
        var createDto = new CreatePostDto
        {
            Content = "Check out this song!",
            MediaUrl = "https://youtube.com/watch?v=123"
        };

        // Act
        var result = await service.CreatePostAsync(1, createDto);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal("https://youtube.com/watch?v=123", result.Value.MediaUrl);
    }

    [Fact]
    public async Task CreatePostAsync_ReturnsError_WhenUserNotFound()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new PostService(db);
        var createDto = new CreatePostDto { Content = "Test", MediaUrl = null };

        // Act
        var result = await service.CreatePostAsync(999, createDto);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("User not found", result.Error);
    }

    [Fact]
    public async Task CreatePostAsync_ReturnsError_WhenContentIsEmpty()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var user = new User { Id = 1, Username = "test", Email = "test@test.com", PasswordHash = "hash" };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var service = new PostService(db);
        var createDto = new CreatePostDto { Content = "", MediaUrl = null };

        // Act
        var result = await service.CreatePostAsync(1, createDto);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("Content cannot be empty", result.Error);
    }

    [Fact]
    public async Task GetPostByIdAsync_ReturnsPost_WhenExists()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var user = new User { Id = 1, Username = "test", Email = "test@test.com", PasswordHash = "hash" };
        var post = new Post { Id = 1, UserId = 1, Content = "Test post", CreatedAt = DateTime.UtcNow };
        db.Users.Add(user);
        db.Posts.Add(post);
        await db.SaveChangesAsync();

        var service = new PostService(db);

        // Act
        var result = await service.GetPostByIdAsync(1);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(1, result.Id);
        Assert.Equal("Test post", result.Content);
    }

    [Fact]
    public async Task GetPostByIdAsync_ReturnsNull_WhenNotExists()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new PostService(db);

        // Act
        var result = await service.GetPostByIdAsync(999);

        // Assert
        Assert.Null(result);
    }

    [Fact]
    public async Task GetFeedAsync_ReturnsAllPosts_WithFollowingFirst()
    {
        // Arrange
        var db = GetInMemoryDbContext();

        // Create users
        var currentUser = new User { Id = 1, Username = "current", Email = "c@test.com", PasswordHash = "h" };
        var followedUser = new User { Id = 2, Username = "followed", Email = "f@test.com", PasswordHash = "h" };
        var otherUser = new User { Id = 3, Username = "other", Email = "o@test.com", PasswordHash = "h" };

        db.Users.AddRange(currentUser, followedUser, otherUser);

        // Create follow relationship
        db.Follows.Add(new Follow { FollowerId = 1, FollowedId = 2, CreatedAt = DateTime.UtcNow });

        // Create posts (older first)
        var post1 = new Post { UserId = 3, Content = "Post from other user", CreatedAt = DateTime.UtcNow.AddHours(-3) };
        var post2 = new Post { UserId = 2, Content = "Post from followed user", CreatedAt = DateTime.UtcNow.AddHours(-2) };
        var post3 = new Post { UserId = 3, Content = "Another post from other", CreatedAt = DateTime.UtcNow.AddHours(-1) };

        db.Posts.AddRange(post1, post2, post3);
        await db.SaveChangesAsync();

        var service = new PostService(db);

        // Act
        var result = await service.GetFeedAsync(1, 0, 10);

        // Assert
        Assert.NotNull(result);
        Assert.Equal(3, result.Count);

        // First post should be from followed user (IsFollowing = true) even though it's not the most recent
        Assert.True(result[0].IsFollowing);
        Assert.Equal("Post from followed user", result[0].Content);

        // Rest are not followed
        Assert.False(result[1].IsFollowing);
        Assert.False(result[2].IsFollowing);
    }

    [Fact]
    public async Task GetFeedAsync_ReturnsPaginatedResults()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var user = new User { Id = 1, Username = "test", Email = "test@test.com", PasswordHash = "hash" };
        db.Users.Add(user);

        // Create 15 posts
        for (int i = 1; i <= 15; i++)
        {
            db.Posts.Add(new Post
            {
                UserId = 1,
                Content = $"Post {i}",
                CreatedAt = DateTime.UtcNow.AddMinutes(-i)
            });
        }
        await db.SaveChangesAsync();

        var service = new PostService(db);

        // Act - Get first page (10 items)
        var page1 = await service.GetFeedAsync(1, 0, 10);

        // Act - Get second page (5 items)
        var page2 = await service.GetFeedAsync(1, 10, 10);

        // Assert
        Assert.Equal(10, page1.Count);
        Assert.Equal(5, page2.Count);
    }

    [Fact]
    public async Task GetUserPostsAsync_ReturnsOnlyUserPosts()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var user1 = new User { Id = 1, Username = "user1", Email = "u1@test.com", PasswordHash = "h" };
        var user2 = new User { Id = 2, Username = "user2", Email = "u2@test.com", PasswordHash = "h" };
        db.Users.AddRange(user1, user2);

        db.Posts.Add(new Post { UserId = 1, Content = "User 1 post 1", CreatedAt = DateTime.UtcNow });
        db.Posts.Add(new Post { UserId = 1, Content = "User 1 post 2", CreatedAt = DateTime.UtcNow.AddHours(-1) });
        db.Posts.Add(new Post { UserId = 2, Content = "User 2 post", CreatedAt = DateTime.UtcNow.AddHours(-2) });

        await db.SaveChangesAsync();

        var service = new PostService(db);

        // Act
        var result = await service.GetUserPostsAsync(1, 0, 10);

        // Assert
        Assert.Equal(2, result.Count);
        Assert.All(result, post => Assert.Equal(1, post.UserId));
    }

    [Fact]
    public async Task DeletePostAsync_DeletesPost_WhenOwner()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var user = new User { Id = 1, Username = "test", Email = "test@test.com", PasswordHash = "hash" };
        var post = new Post { Id = 1, UserId = 1, Content = "Test post", CreatedAt = DateTime.UtcNow };
        db.Users.Add(user);
        db.Posts.Add(post);
        await db.SaveChangesAsync();

        var service = new PostService(db);

        // Act
        var result = await service.DeletePostAsync(1, 1);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.Null(await db.Posts.FirstOrDefaultAsync(p => p.Id == 1));
    }

    [Fact]
    public async Task DeletePostAsync_ReturnsError_WhenNotOwner()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var user1 = new User { Id = 1, Username = "user1", Email = "u1@test.com", PasswordHash = "h" };
        var user2 = new User { Id = 2, Username = "user2", Email = "u2@test.com", PasswordHash = "h" };
        var post = new Post { Id = 1, UserId = 1, Content = "User 1 post", CreatedAt = DateTime.UtcNow };
        db.Users.AddRange(user1, user2);
        db.Posts.Add(post);
        await db.SaveChangesAsync();

        var service = new PostService(db);

        // Act
        var result = await service.DeletePostAsync(1, 2); // User 2 trying to delete User 1's post

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("not authorized", result.Error, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task DeletePostAsync_ReturnsError_WhenPostNotFound()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var service = new PostService(db);

        // Act
        var result = await service.DeletePostAsync(999, 1);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("not found", result.Error, StringComparison.OrdinalIgnoreCase);
    }
}
