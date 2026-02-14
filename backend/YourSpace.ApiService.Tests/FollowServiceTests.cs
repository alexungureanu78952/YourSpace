using Xunit;
using System.Threading.Tasks;
using YourSpace.ApiService.Services;
using YourSpace.Data;
using YourSpace.Data.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;

namespace YourSpace.ApiService.Tests;

/// <summary>
/// Unit tests for FollowService (TDD - Test First approach)
/// </summary>
public class FollowServiceTests
{
    private YourSpaceDbContext GetInMemoryDbContext()
    {
        var options = new DbContextOptionsBuilder<YourSpaceDbContext>()
            .UseInMemoryDatabase(Guid.NewGuid().ToString())
            .Options;
        return new YourSpaceDbContext(options);
    }

    [Fact]
    public async Task FollowUserAsync_CreatesNewFollowRelationship()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var follower = new User { Id = 1, Username = "user1", Email = "user1@test.com", PasswordHash = "hash1" };
        var followed = new User { Id = 2, Username = "user2", Email = "user2@test.com", PasswordHash = "hash2" };
        db.Users.AddRange(follower, followed);
        await db.SaveChangesAsync();

        var service = new FollowService(db);

        // Act
        var result = await service.FollowUserAsync(followerId: 1, followedId: 2);

        // Assert
        Assert.True(result.IsSuccess);
        Assert.NotNull(result.Value);
        Assert.Equal(1, result.Value.FollowerId);
        Assert.Equal(2, result.Value.FollowedId);

        var followInDb = await db.Follows.FirstOrDefaultAsync(f => f.FollowerId == 1 && f.FollowedId == 2);
        Assert.NotNull(followInDb);
    }

    [Fact]
    public async Task FollowUserAsync_ReturnsError_WhenFollowerNotFound()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var followed = new User { Id = 2, Username = "user2", Email = "user2@test.com", PasswordHash = "hash2" };
        db.Users.Add(followed);
        await db.SaveChangesAsync();

        var service = new FollowService(db);

        // Act
        var result = await service.FollowUserAsync(followerId: 999, followedId: 2);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("Follower user not found", result.Error);
    }

    [Fact]
    public async Task FollowUserAsync_ReturnsError_WhenFollowedUserNotFound()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var follower = new User { Id = 1, Username = "user1", Email = "user1@test.com", PasswordHash = "hash1" };
        db.Users.Add(follower);
        await db.SaveChangesAsync();

        var service = new FollowService(db);

        // Act
        var result = await service.FollowUserAsync(followerId: 1, followedId: 999);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("Followed user not found", result.Error);
    }

    [Fact]
    public async Task FollowUserAsync_ReturnsError_WhenTryingToFollowSelf()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var user = new User { Id = 1, Username = "user1", Email = "user1@test.com", PasswordHash = "hash1" };
        db.Users.Add(user);
        await db.SaveChangesAsync();

        var service = new FollowService(db);

        // Act
        var result = await service.FollowUserAsync(followerId: 1, followedId: 1);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("Cannot follow yourself", result.Error);
    }

    [Fact]
    public async Task FollowUserAsync_ReturnsError_WhenAlreadyFollowing()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var follower = new User { Id = 1, Username = "user1", Email = "user1@test.com", PasswordHash = "hash1" };
        var followed = new User { Id = 2, Username = "user2", Email = "user2@test.com", PasswordHash = "hash2" };
        db.Users.AddRange(follower, followed);
        db.Follows.Add(new Follow { FollowerId = 1, FollowedId = 2, CreatedAt = DateTime.UtcNow });
        await db.SaveChangesAsync();

        var service = new FollowService(db);

        // Act
        var result = await service.FollowUserAsync(followerId: 1, followedId: 2);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("Already following this user", result.Error);
    }

    [Fact]
    public async Task UnfollowUserAsync_RemovesFollowRelationship()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var follower = new User { Id = 1, Username = "user1", Email = "user1@test.com", PasswordHash = "hash1" };
        var followed = new User { Id = 2, Username = "user2", Email = "user2@test.com", PasswordHash = "hash2" };
        db.Users.AddRange(follower, followed);
        db.Follows.Add(new Follow { FollowerId = 1, FollowedId = 2, CreatedAt = DateTime.UtcNow });
        await db.SaveChangesAsync();

        var service = new FollowService(db);

        // Act
        var result = await service.UnfollowUserAsync(followerId: 1, followedId: 2);

        // Assert
        Assert.True(result.IsSuccess);

        var followInDb = await db.Follows.FirstOrDefaultAsync(f => f.FollowerId == 1 && f.FollowedId == 2);
        Assert.Null(followInDb);
    }

    [Fact]
    public async Task UnfollowUserAsync_ReturnsError_WhenNotFollowing()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var follower = new User { Id = 1, Username = "user1", Email = "user1@test.com", PasswordHash = "hash1" };
        var followed = new User { Id = 2, Username = "user2", Email = "user2@test.com", PasswordHash = "hash2" };
        db.Users.AddRange(follower, followed);
        await db.SaveChangesAsync();

        var service = new FollowService(db);

        // Act
        var result = await service.UnfollowUserAsync(followerId: 1, followedId: 2);

        // Assert
        Assert.False(result.IsSuccess);
        Assert.Contains("Not following this user", result.Error);
    }

    [Fact]
    public async Task IsFollowingAsync_ReturnsTrue_WhenFollowing()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var follower = new User { Id = 1, Username = "user1", Email = "user1@test.com", PasswordHash = "hash1" };
        var followed = new User { Id = 2, Username = "user2", Email = "user2@test.com", PasswordHash = "hash2" };
        db.Users.AddRange(follower, followed);
        db.Follows.Add(new Follow { FollowerId = 1, FollowedId = 2, CreatedAt = DateTime.UtcNow });
        await db.SaveChangesAsync();

        var service = new FollowService(db);

        // Act
        var result = await service.IsFollowingAsync(followerId: 1, followedId: 2);

        // Assert
        Assert.True(result);
    }

    [Fact]
    public async Task IsFollowingAsync_ReturnsFalse_WhenNotFollowing()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var follower = new User { Id = 1, Username = "user1", Email = "user1@test.com", PasswordHash = "hash1" };
        var followed = new User { Id = 2, Username = "user2", Email = "user2@test.com", PasswordHash = "hash2" };
        db.Users.AddRange(follower, followed);
        await db.SaveChangesAsync();

        var service = new FollowService(db);

        // Act
        var result = await service.IsFollowingAsync(followerId: 1, followedId: 2);

        // Assert
        Assert.False(result);
    }

    [Fact]
    public async Task GetFollowersCountAsync_ReturnsCorrectCount()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var user1 = new User { Id = 1, Username = "user1", Email = "user1@test.com", PasswordHash = "hash1" };
        var user2 = new User { Id = 2, Username = "user2", Email = "user2@test.com", PasswordHash = "hash2" };
        var user3 = new User { Id = 3, Username = "user3", Email = "user3@test.com", PasswordHash = "hash3" };
        db.Users.AddRange(user1, user2, user3);
        // user2 and user3 follow user1
        db.Follows.Add(new Follow { FollowerId = 2, FollowedId = 1, CreatedAt = DateTime.UtcNow });
        db.Follows.Add(new Follow { FollowerId = 3, FollowedId = 1, CreatedAt = DateTime.UtcNow });
        await db.SaveChangesAsync();

        var service = new FollowService(db);

        // Act
        var count = await service.GetFollowersCountAsync(userId: 1);

        // Assert
        Assert.Equal(2, count);
    }

    [Fact]
    public async Task GetFollowingCountAsync_ReturnsCorrectCount()
    {
        // Arrange
        var db = GetInMemoryDbContext();
        var user1 = new User { Id = 1, Username = "user1", Email = "user1@test.com", PasswordHash = "hash1" };
        var user2 = new User { Id = 2, Username = "user2", Email = "user2@test.com", PasswordHash = "hash2" };
        var user3 = new User { Id = 3, Username = "user3", Email = "user3@test.com", PasswordHash = "hash3" };
        db.Users.AddRange(user1, user2, user3);
        // user1 follows user2 and user3
        db.Follows.Add(new Follow { FollowerId = 1, FollowedId = 2, CreatedAt = DateTime.UtcNow });
        db.Follows.Add(new Follow { FollowerId = 1, FollowedId = 3, CreatedAt = DateTime.UtcNow });
        await db.SaveChangesAsync();

        var service = new FollowService(db);

        // Act
        var count = await service.GetFollowingCountAsync(userId: 1);

        // Assert
        Assert.Equal(2, count);
    }
}
