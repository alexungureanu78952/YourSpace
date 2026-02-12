using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using YourSpace.ApiService.DTOs;
using YourSpace.ApiService.Services;

namespace YourSpace.ApiService.Controllers;

/// <summary>
/// Controller pentru messaging (conversații și mesaje)
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Authorize]
public class MessagesController : ControllerBase
{
    private readonly IMessageService _messageService;
    private readonly ILogger<MessagesController> _logger;

    public MessagesController(IMessageService messageService, ILogger<MessagesController> logger)
    {
        _messageService = messageService;
        _logger = logger;
    }

    /// <summary>
    /// Trimite un mesaj către un alt utilizator
    /// POST /api/messages
    /// </summary>
    [HttpPost]
    public async Task<ActionResult<MessageDto>> SendMessage([FromBody] SendMessageRequest request)
    {
        try
        {
            var userIdClaim = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var senderId))
                return Unauthorized(new { message = "Unauthorized" });

            var message = await _messageService.SendMessageAsync(senderId, request);
            return Ok(message);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error sending message");
            return StatusCode(500, new { message = "A apărut o eroare la trimiterea mesajului." });
        }
    }

    /// <summary>
    /// Obține toate conversațiile utilizatorului curent
    /// GET /api/messages/conversations
    /// </summary>
    [HttpGet("conversations")]
    public async Task<ActionResult<List<ConversationDto>>> GetConversations()
    {
        try
        {
            var userIdClaim = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Unauthorized" });

            var conversations = await _messageService.GetConversationsAsync(userId);
            return Ok(conversations);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting conversations");
            return StatusCode(500, new { message = "A apărut o eroare la obținerea conversațiilor." });
        }
    }

    /// <summary>
    /// Obține toate mesajele cu un anumit utilizator
    /// GET /api/messages/{otherUserId}
    /// </summary>
    [HttpGet("{otherUserId}")]
    public async Task<ActionResult<List<MessageDto>>> GetMessages(int otherUserId)
    {
        try
        {
            var userIdClaim = User.FindFirst("sub")?.Value;
            if (string.IsNullOrEmpty(userIdClaim) || !int.TryParse(userIdClaim, out var userId))
                return Unauthorized(new { message = "Unauthorized" });

            var messages = await _messageService.GetMessagesWithUserAsync(userId, otherUserId);

            // Marchează mesajele ca citite
            await _messageService.MarkMessagesAsReadAsync(userId, otherUserId);

            return Ok(messages);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error getting messages with user {otherUserId}");
            return StatusCode(500, new { message = "A apărut o eroare la obținerea mesajelor." });
        }
    }
}
