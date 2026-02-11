using Xunit;
using YourSpace.ApiService.Services;

namespace YourSpace.ApiService.Tests
{
    /// <summary>
    /// Unit tests for PasswordHasher
    /// </summary>
    public class PasswordHasherTests
    {
        [Fact]
        public void HashPassword_ReturnsNonEmptyHash()
        {
            // Arrange
            var password = "testPassword123";

            // Act
            var hash = PasswordHasher.HashPassword(password);

            // Assert
            Assert.False(string.IsNullOrWhiteSpace(hash));
            Assert.NotEqual(password, hash);
        }

        [Fact]
        public void HashPassword_GeneratesDifferentHashesForSamePassword()
        {
            // Arrange
            var password = "samePassword";

            // Act
            var hash1 = PasswordHasher.HashPassword(password);
            var hash2 = PasswordHasher.HashPassword(password);

            // Assert
            Assert.NotEqual(hash1, hash2); // BCrypt includes salt, so hashes differ
        }

        [Fact]
        public void VerifyPassword_ReturnsTrue_ForCorrectPassword()
        {
            // Arrange
            var password = "correctPassword";
            var hash = PasswordHasher.HashPassword(password);

            // Act
            var isValid = PasswordHasher.VerifyPassword(password, hash);

            // Assert
            Assert.True(isValid);
        }

        [Fact]
        public void VerifyPassword_ReturnsFalse_ForIncorrectPassword()
        {
            // Arrange
            var password = "correctPassword";
            var wrongPassword = "wrongPassword";
            var hash = PasswordHasher.HashPassword(password);

            // Act
            var isValid = PasswordHasher.VerifyPassword(wrongPassword, hash);

            // Assert
            Assert.False(isValid);
        }

        [Fact]
        public void VerifyPassword_ThrowsException_ForInvalidHash()
        {
            // Arrange
            var password = "testPassword";
            var invalidHash = "notAValidBCryptHash";

            // Act & Assert
            Assert.Throws<BCrypt.Net.SaltParseException>(() => PasswordHasher.VerifyPassword(password, invalidHash));
        }

        [Fact]
        public void HashPassword_HandlesEmptyString()
        {
            // Arrange
            var password = "";

            // Act
            var hash = PasswordHasher.HashPassword(password);

            // Assert
            Assert.False(string.IsNullOrWhiteSpace(hash));
        }

        [Fact]
        public void HashPassword_HandlesSpecialCharacters()
        {
            // Arrange
            var password = "p@$$w0rd!#123";

            // Act
            var hash = PasswordHasher.HashPassword(password);

            // Assert
            Assert.False(string.IsNullOrWhiteSpace(hash));
            Assert.True(PasswordHasher.VerifyPassword(password, hash));
        }

        [Fact]
        public void HashPassword_HandlesLongPassword()
        {
            // Arrange
            var password = new string('a', 500);

            // Act
            var hash = PasswordHasher.HashPassword(password);

            // Assert
            Assert.False(string.IsNullOrWhiteSpace(hash));
            Assert.True(PasswordHasher.VerifyPassword(password, hash));
        }
    }
}
