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
using Microsoft.Extensions.Configuration;

namespace YourSpace.ApiService.Tests
{
    public class AuthServiceTests
    {


        [Fact]
        public async Task RegisterAsync_ReturnsSuccess_WhenNewUser()
        {
            var repo = new Mock<YourSpace.Data.Repositories.IUserRepository>();
            repo.Setup(r => r.UsernameExistsAsync("ana")).ReturnsAsync(false);
            repo.Setup(r => r.EmailExistsAsync("ana@email.com")).ReturnsAsync(false);
            repo.Setup(r => r.CreateUserAsync(It.IsAny<User>())).ReturnsAsync((User u) => u);
            var config = new Moq.Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            config.Setup(c => c["Jwt:Secret"]).Returns("test_secret_key_for_unit_test_12345678901234567890123456789012");
            config.Setup(c => c["Jwt:Issuer"]).Returns("TestIssuer");
            config.Setup(c => c["Jwt:Audience"]).Returns("TestAudience");
            config.Setup(c => c["Jwt:ExpiryMinutes"]).Returns("60");
            var jwt = new JwtTokenService(config.Object);
            var logger = new Mock<Microsoft.Extensions.Logging.ILogger<AuthService>>();
            var service = new AuthService(repo.Object, jwt, logger.Object);
            var req = new CreateUserRequest { Username = "ana", Email = "ana@email.com", Password = "parola123" };
            var result = await service.RegisterAsync(req);
            Assert.True(result.Success);
            Assert.NotNull(result.Token);
        }

        [Fact]
        public async Task RegisterAsync_ReturnsFail_WhenDuplicate()
        {
            var repo = new Mock<YourSpace.Data.Repositories.IUserRepository>();
            repo.Setup(r => r.UsernameExistsAsync("ana")).ReturnsAsync(true);
            var config = new Moq.Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            config.Setup(c => c["Jwt:Secret"]).Returns("test_secret_key_for_unit_test_12345678901234567890123456789012");
            config.Setup(c => c["Jwt:Issuer"]).Returns("TestIssuer");
            config.Setup(c => c["Jwt:Audience"]).Returns("TestAudience");
            config.Setup(c => c["Jwt:ExpiryMinutes"]).Returns("60");
            var jwt = new JwtTokenService(config.Object);
            var logger = new Mock<Microsoft.Extensions.Logging.ILogger<AuthService>>();
            var service = new AuthService(repo.Object, jwt, logger.Object);
            var req = new CreateUserRequest { Username = "ana", Email = "ana@email.com", Password = "parola123" };
            var result = await service.RegisterAsync(req);
            Assert.False(result.Success);
        }

        [Fact]
        public async Task LoginAsync_ReturnsSuccess_WhenValid()
        {
            var user = new User { Id = 1, Username = "ana", Email = "ana@email.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("parola123"), CreatedAt = DateTime.UtcNow };
            var repo = new Mock<YourSpace.Data.Repositories.IUserRepository>();
            repo.Setup(r => r.GetUserByUsernameAsync("ana")).ReturnsAsync(user);
            repo.Setup(r => r.GetUserByEmailAsync(It.IsAny<string>())).ReturnsAsync((User?)null);
            var config = new Moq.Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            config.Setup(c => c["Jwt:Secret"]).Returns("test_secret_key_for_unit_test_12345678901234567890123456789012");
            config.Setup(c => c["Jwt:Issuer"]).Returns("TestIssuer");
            config.Setup(c => c["Jwt:Audience"]).Returns("TestAudience");
            config.Setup(c => c["Jwt:ExpiryMinutes"]).Returns("60");
            var jwt = new JwtTokenService(config.Object);
            var logger = new Mock<Microsoft.Extensions.Logging.ILogger<AuthService>>();
            var service = new AuthService(repo.Object, jwt, logger.Object);
            var req = new LoginRequest { UsernameOrEmail = "ana", Password = "parola123" };
            var result = await service.LoginAsync(req);
            Assert.True(result.Success);
            Assert.NotNull(result.Token);
        }

        [Fact]
        public async Task LoginAsync_ReturnsFail_WhenInvalid()
        {
            var user = new User { Id = 1, Username = "ana", Email = "ana@email.com", PasswordHash = BCrypt.Net.BCrypt.HashPassword("parola123"), CreatedAt = DateTime.UtcNow };
            var repo = new Mock<YourSpace.Data.Repositories.IUserRepository>();
            repo.Setup(r => r.GetUserByUsernameAsync("ana")).ReturnsAsync(user);
            repo.Setup(r => r.GetUserByEmailAsync(It.IsAny<string>())).ReturnsAsync((User?)null);
            var config = new Moq.Mock<Microsoft.Extensions.Configuration.IConfiguration>();
            config.Setup(c => c["Jwt:Secret"]).Returns("test_secret_key_for_unit_test_12345678901234567890123456789012");
            config.Setup(c => c["Jwt:Issuer"]).Returns("TestIssuer");
            config.Setup(c => c["Jwt:Audience"]).Returns("TestAudience");
            config.Setup(c => c["Jwt:ExpiryMinutes"]).Returns("60");
            var jwt = new JwtTokenService(config.Object);
            var logger = new Mock<Microsoft.Extensions.Logging.ILogger<AuthService>>();
            var service = new AuthService(repo.Object, jwt, logger.Object);
            var req = new LoginRequest { UsernameOrEmail = "ana", Password = "gresit" };
            var result = await service.LoginAsync(req);
            Assert.False(result.Success);
        }

        [Fact]
        public async Task RegisterAsync_Throws_WhenRepositoryFails()
        {
            var repo = new Moq.Mock<YourSpace.Data.Repositories.IUserRepository>();
            repo.Setup(r => r.UsernameExistsAsync(It.IsAny<string>())).ThrowsAsync(new Exception("DB error"));
            var config = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
                .AddInMemoryCollection(new[]
                {
                    new System.Collections.Generic.KeyValuePair<string, string>("Jwt:Secret", "test_secret_key_for_unit_test_12345678901234567890123456789012"),
                    new System.Collections.Generic.KeyValuePair<string, string>("Jwt:Issuer", "TestIssuer"),
                    new System.Collections.Generic.KeyValuePair<string, string>("Jwt:Audience", "TestAudience"),
                    new System.Collections.Generic.KeyValuePair<string, string>("Jwt:ExpiryMinutes", "60")
                })
                .Build();
            var jwt = new YourSpace.ApiService.Services.JwtTokenService(config);
            var logger = new Moq.Mock<Microsoft.Extensions.Logging.ILogger<YourSpace.ApiService.Services.AuthService>>();
            var service = new YourSpace.ApiService.Services.AuthService(repo.Object, jwt, logger.Object);
            var req = new YourSpace.ApiService.DTOs.CreateUserRequest { Username = "ana", Email = "ana@email.com", Password = "parola123" };
            await Assert.ThrowsAsync<Exception>(() => service.RegisterAsync(req));
        }

        [Fact]
        public async Task LoginAsync_Throws_WhenRepositoryFails()
        {
            var repo = new Moq.Mock<YourSpace.Data.Repositories.IUserRepository>();
            repo.Setup(r => r.GetUserByUsernameAsync(It.IsAny<string>())).ThrowsAsync(new Exception("DB error"));
            var config = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
                .AddInMemoryCollection(new[]
                {
                    new System.Collections.Generic.KeyValuePair<string, string>("Jwt:Secret", "test_secret_key_for_unit_test_12345678901234567890123456789012"),
                    new System.Collections.Generic.KeyValuePair<string, string>("Jwt:Issuer", "TestIssuer"),
                    new System.Collections.Generic.KeyValuePair<string, string>("Jwt:Audience", "TestAudience"),
                    new System.Collections.Generic.KeyValuePair<string, string>("Jwt:ExpiryMinutes", "60")
                })
                .Build();
            var jwt = new YourSpace.ApiService.Services.JwtTokenService(config);
            var logger = new Moq.Mock<Microsoft.Extensions.Logging.ILogger<YourSpace.ApiService.Services.AuthService>>();
            var service = new YourSpace.ApiService.Services.AuthService(repo.Object, jwt, logger.Object);
            var req = new YourSpace.ApiService.DTOs.LoginRequest { UsernameOrEmail = "ana", Password = "parola123" };
            await Assert.ThrowsAsync<Exception>(() => service.LoginAsync(req));
        }
    }
}
