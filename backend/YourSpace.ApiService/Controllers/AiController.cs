using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using YourSpace.ApiService.DTOs;
using YourSpace.ApiService.Services;

namespace YourSpace.ApiService.Controllers;

/// <summary>
/// Controller pentru AI Assistant - generare cod HTML/CSS
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AiController : ControllerBase
{
    private readonly IAiAssistantService _aiService;
    private readonly ILogger<AiController> _logger;

    public AiController(IAiAssistantService aiService, ILogger<AiController> logger)
    {
        _aiService = aiService;
        _logger = logger;
    }

    /// <summary>
    /// Generează cod HTML/CSS pentru profil folosind AI
    /// </summary>
    /// <param name="request">Prompt-ul utilizatorului și tipul de cod dorit</param>
    /// <returns>Cod HTML și/sau CSS generat</returns>
    [HttpPost("generate-profile-code")]
    public async Task<ActionResult<GenerateCodeResponse>> GenerateProfileCode([FromBody] GenerateCodeRequest request)
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out int userId))
        {
            _logger.LogWarning("Failed to get user ID from claims");
            return Unauthorized(new { message = "Invalid authentication token" });
        }

        _logger.LogInformation("User {UserId} requested AI code generation: {Prompt}", userId, request.Prompt);

        try
        {
            _logger.LogInformation("[AiController] Calling AI service for user {UserId} with prompt: '{Prompt}'", userId, request.Prompt);

            var result = await _aiService.GenerateProfileCodeAsync(request.Prompt, request.Type);

            _logger.LogInformation("[AiController] AI code generation successful for user {UserId}. HTML length: {HtmlLength}, CSS length: {CssLength}, Message: {Message}",
                userId, result.Html.Length, result.Css.Length, result.Message);

            return Ok(result);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning("[AiController] Invalid request from user {UserId}: {Error}", userId, ex.Message);
            return BadRequest(new { message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            _logger.LogError("[AiController] AI service error for user {UserId}: {Error}. Stack: {Stack}", userId, ex.Message, ex.StackTrace);
            return StatusCode(503, new { message = $"AI service is not available: {ex.Message}" });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "[AiController] Unexpected error generating AI code for user {UserId}. Type: {ExceptionType}, Message: {Message}",
                userId, ex.GetType().Name, ex.Message);
            return StatusCode(500, new { message = $"An unexpected error occurred: {ex.Message}" });
        }
    }

    /// <summary>
    /// Health check pentru AI service
    /// </summary>
    [HttpGet("status")]
    [AllowAnonymous]
    public IActionResult GetStatus()
    {
        try
        {
            // Simple check - în producție ar trebui să verificăm dacă API key-ul e valid
            return Ok(new { status = "AI service is configured", timestamp = DateTime.UtcNow });
        }
        catch
        {
            return StatusCode(503, new { status = "AI service is not available" });
        }
    }
}
