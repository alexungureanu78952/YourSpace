using Xunit;
using System;
using System.Threading.Tasks;
using YourSpace.Data;
using YourSpace.Data.Models;
using YourSpace.Data.Repositories;
using Microsoft.EntityFrameworkCore;
using System.Linq;

namespace YourSpace.ApiService.Tests
{
    /// <summary>
    /// Unit tests for UserRepository (Data layer)
    /// </summary>
    public class UserRepositoryTests
    {
        private YourSpaceDbContext GetInMemoryDbContext()
        {
            var options = new DbContextOptionsBuilder<YourSpaceDbContext>()
                .UseInMemoryDatabase(Guid.NewGuid().ToString())
                .Options;
            return new YourSpaceDbContext(options);
        }

        [Fact]
        public async Task GetAllUsersAsync_ReturnsAllUsers()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var user1 = new User { Username = "user1", Email = "user1@test.com", PasswordHash = "hash1", CreatedAt = DateTime.UtcNow };
            var user2 = new User { Username = "user2", Email = "user2@test.com", PasswordHash = "hash2", CreatedAt = DateTime.UtcNow };
            context.Users.AddRange(user1, user2);
            await context.SaveChangesAsync();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.GetAllUsersAsync();

            // Assert
            Assert.Equal(2, result.Count());
        }

        [Fact]
        public async Task GetUserByIdAsync_ReturnsUser_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var user = new User { Username = "test", Email = "test@test.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
            await context.SaveChangesAsync();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.GetUserByIdAsync(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test", result.Username);
        }

        [Fact]
        public async Task GetUserByIdAsync_ReturnsNull_WhenNotExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.GetUserByIdAsync(999);

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetUserByUsernameAsync_ReturnsUser_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var user = new User { Username = "testuser", Email = "test@test.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
            await context.SaveChangesAsync();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.GetUserByUsernameAsync("testuser");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("testuser", result.Username);
        }

        [Fact]
        public async Task GetUserByUsernameAsync_ReturnsNull_WhenNotExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.GetUserByUsernameAsync("nonexistent");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task GetUserByEmailAsync_ReturnsUser_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var user = new User { Username = "test", Email = "test@email.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
            await context.SaveChangesAsync();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.GetUserByEmailAsync("test@email.com");

            // Assert
            Assert.NotNull(result);
            Assert.Equal("test@email.com", result.Email);
        }

        [Fact]
        public async Task GetUserByEmailAsync_ReturnsNull_WhenNotExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.GetUserByEmailAsync("nonexistent@test.com");

            // Assert
            Assert.Null(result);
        }

        [Fact]
        public async Task CreateUserAsync_AddsUserToDatabase()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repo = new UserRepository(context);
            var user = new User { Username = "newuser", Email = "new@test.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow };

            // Act
            var result = await repo.CreateUserAsync(user);

            // Assert
            Assert.NotNull(result);
            Assert.True(result.Id > 0);
            Assert.Equal("newuser", result.Username);
            var savedUser = await context.Users.FindAsync(result.Id);
            Assert.NotNull(savedUser);
        }

        [Fact]
        public async Task UpdateUserAsync_UpdatesExistingUser()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var user = new User { Username = "original", Email = "original@test.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
            await context.SaveChangesAsync();
            var repo = new UserRepository(context);

            // Act
            user.Username = "updated";
            var result = await repo.UpdateUserAsync(user);

            // Assert
            Assert.Equal("updated", result.Username);
            var updatedUser = await context.Users.FindAsync(user.Id);
            Assert.Equal("updated", updatedUser.Username);
        }

        [Fact]
        public async Task DeleteUserAsync_RemovesUser_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var user = new User { Username = "todelete", Email = "delete@test.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
            await context.SaveChangesAsync();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.DeleteUserAsync(user.Id);

            // Assert
            Assert.True(result);
            var deletedUser = await context.Users.FindAsync(user.Id);
            Assert.Null(deletedUser);
        }

        [Fact]
        public async Task DeleteUserAsync_ReturnsFalse_WhenNotExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.DeleteUserAsync(999);

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task UsernameExistsAsync_ReturnsTrue_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var user = new User { Username = "existing", Email = "existing@test.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
            await context.SaveChangesAsync();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.UsernameExistsAsync("existing");

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task UsernameExistsAsync_ReturnsFalse_WhenNotExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.UsernameExistsAsync("nonexistent");

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task EmailExistsAsync_ReturnsTrue_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var user = new User { Username = "test", Email = "existing@test.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
            await context.SaveChangesAsync();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.EmailExistsAsync("existing@test.com");

            // Assert
            Assert.True(result);
        }

        [Fact]
        public async Task EmailExistsAsync_ReturnsFalse_WhenNotExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.EmailExistsAsync("nonexistent@test.com");

            // Assert
            Assert.False(result);
        }

        [Fact]
        public async Task GetUserByIdAsync_IncludesProfile_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var user = new User { Username = "test", Email = "test@test.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow };
            var profile = new UserProfile { User = user, DisplayName = "Test User", Bio = "Test bio", UpdatedAt = DateTime.UtcNow };
            user.Profile = profile;
            context.Users.Add(user);
            await context.SaveChangesAsync();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.GetUserByIdAsync(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Profile);
            Assert.Equal("Test User", result.Profile.DisplayName);
        }

        [Fact]
        public async Task GetUserByIdAsync_IncludesPosts_WhenExists()
        {
            // Arrange
            var context = GetInMemoryDbContext();
            var user = new User { Username = "test", Email = "test@test.com", PasswordHash = "hash", CreatedAt = DateTime.UtcNow };
            context.Users.Add(user);
            await context.SaveChangesAsync();
            var post = new Post { UserId = user.Id, Content = "Test post", CreatedAt = DateTime.UtcNow };
            context.Posts.Add(post);
            await context.SaveChangesAsync();
            var repo = new UserRepository(context);

            // Act
            var result = await repo.GetUserByIdAsync(user.Id);

            // Assert
            Assert.NotNull(result);
            Assert.NotNull(result.Posts);
            Assert.Single(result.Posts);
            Assert.Equal("Test post", result.Posts.First().Content);
        }
    }
}
