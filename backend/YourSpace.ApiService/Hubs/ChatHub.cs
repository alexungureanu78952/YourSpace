using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace YourSpace.ApiService.Hubs;

/// <summary>
/// SignalR Hub pentru messaging real-time
/// </summary>
[Authorize]
public class ChatHub : Hub
{
    private readonly ILogger<ChatHub> _logger;

    public ChatHub(ILogger<ChatHub> logger)
    {
        _logger = logger;
    }

    public override async Task OnConnectedAsync()
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            // Adaugă user la un grup cu ID-ul său pentru notificări directe
            await Groups.AddToGroupAsync(Context.ConnectionId, $"user_{userId}");
            _logger.LogInformation($"User {userId} connected to ChatHub with connection {Context.ConnectionId}");
        }
        await base.OnConnectedAsync();
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, $"user_{userId}");
            _logger.LogInformation($"User {userId} disconnected from ChatHub");
        }
        await base.OnDisconnectedAsync(exception);
    }

    /// <summary>
    /// Client poate apela această metodă pentru a indica că scrie un mesaj
    /// </summary>
    public async Task SendTypingIndicator(int recipientId)
    {
        var userId = Context.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (!string.IsNullOrEmpty(userId))
        {
            // Notifică destinatarul că user-ul scrie
            await Clients.Group($"user_{recipientId}").SendAsync("UserTyping", int.Parse(userId));
        }
    }
}
