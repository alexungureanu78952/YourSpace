using Xunit;
using Moq;
using System;
using System.Threading.Tasks;
using YourSpace.ApiService.Services;
using YourSpace.Data;
using YourSpace.Data.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace YourSpace.ApiService.Tests
{
    public class JwtTokenServiceTests
    {
        private JwtTokenService GetService()
        {
            var config = new Microsoft.Extensions.Configuration.ConfigurationBuilder()
                .AddInMemoryCollection(new[]
                {
                    new System.Collections.Generic.KeyValuePair<string, string>("Jwt:Secret", "test_secret_key_for_unit_test_12345678901234567890123456789012"),
                    new System.Collections.Generic.KeyValuePair<string, string>("Jwt:Issuer", "TestIssuer"),
                    new System.Collections.Generic.KeyValuePair<string, string>("Jwt:Audience", "TestAudience"),
                    new System.Collections.Generic.KeyValuePair<string, string>("Jwt:ExpiryMinutes", "60")
                })
                .Build();
            return new JwtTokenService(config);
        }

        [Fact]
        public void GenerateToken_ReturnsToken_ForValidUser()
        {
            var user = new User { Id = 1, Username = "ana", Email = "ana@email.com", PasswordHash = "hash" };
            var service = GetService();
            var token = service.GenerateToken(user);
            Assert.False(string.IsNullOrWhiteSpace(token));
        }

        [Fact]
        public void GenerateToken_Throws_WhenUserIsNull()
        {
            var service = GetService();
            Assert.Throws<NullReferenceException>(() => service.GenerateToken(null!));
        }

        [Fact]
        public void GenerateToken_ReturnsToken_EvenWhenUserMissingFields()
        {
            var service = GetService();
            var user = new User { Id = 0, Username = "", Email = "", PasswordHash = "" };
            var token = service.GenerateToken(user);
            Assert.False(string.IsNullOrWhiteSpace(token));
        }
    }
}
