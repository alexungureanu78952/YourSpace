using Xunit;
using Moq;
using YourSpace.ApiService.Services;
using YourSpace.ApiService.DTOs;

namespace YourSpace.ApiService.Tests;

/// <summary>
/// Unit tests pentru AI Assistant Service (TDD approach)
/// </summary>
public class AiAssistantServiceTests
{
    [Fact]
    public async Task GenerateProfileCodeAsync_ReturnsHtmlAndCss_WhenTypeIsBoth()
    {
        // Arrange
        var service = new AiAssistantService("test-api-key");
        var prompt = "Create a retro MySpace profile with pink background";

        // Act
        var result = await service.GenerateProfileCodeAsync(prompt, "both");

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result.Html);
        Assert.NotEmpty(result.Css);
        Assert.Contains("div", result.Html, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task GenerateProfileCodeAsync_ReturnsOnlyHtml_WhenTypeIsHtml()
    {
        // Arrange
        var service = new AiAssistantService("test-api-key");
        var prompt = "Create a simple profile card";

        // Act
        var result = await service.GenerateProfileCodeAsync(prompt, "html");

        // Assert
        Assert.NotNull(result);
        Assert.NotEmpty(result.Html);
        Assert.Empty(result.Css);
    }

    [Fact]
    public async Task GenerateProfileCodeAsync_ReturnsOnlyCss_WhenTypeIsCss()
    {
        // Arrange
        var service = new AiAssistantService("test-api-key");
        var prompt = "Dark gothic theme with purple accents";

        // Act
        var result = await service.GenerateProfileCodeAsync(prompt, "css");

        // Assert
        Assert.NotNull(result);
        Assert.Empty(result.Html);
        Assert.NotEmpty(result.Css);
        Assert.Contains("color", result.Css, StringComparison.OrdinalIgnoreCase);
    }

    [Fact]
    public async Task GenerateProfileCodeAsync_ThrowsException_WhenPromptIsEmpty()
    {
        // Arrange
        var service = new AiAssistantService("test-api-key");

        // Act & Assert
        await Assert.ThrowsAsync<ArgumentException>(() =>
            service.GenerateProfileCodeAsync("", "both"));
    }

    [Fact]
    public async Task GenerateProfileCodeAsync_ThrowsException_WhenApiKeyIsInvalid()
    {
        // Arrange
        var service = new AiAssistantService("");

        // Act & Assert
        await Assert.ThrowsAsync<InvalidOperationException>(() =>
            service.GenerateProfileCodeAsync("test prompt", "both"));
    }

    [Fact]
    public async Task GenerateProfileCodeAsync_SanitizesOutput_RemovingDangerousScripts()
    {
        // Arrange
        var service = new AiAssistantService("test-api-key");
        var prompt = "Create profile with interactive elements";

        // Act
        var result = await service.GenerateProfileCodeAsync(prompt, "both");

        // Assert
        Assert.DoesNotContain("<script", result.Html, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("javascript:", result.Html, StringComparison.OrdinalIgnoreCase);
        Assert.DoesNotContain("onerror=", result.Html, StringComparison.OrdinalIgnoreCase);
    }
}
