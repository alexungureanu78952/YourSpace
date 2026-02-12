using YourSpace.ApiService.DTOs;
using YourSpace.Data.Models;
using YourSpace.Data.Repositories;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Implementare pentru serviciul de messaging
/// </summary>
public class MessageService : IMessageService
{
    private readonly IMessageRepository _messageRepository;
    private readonly ILogger<MessageService> _logger;

    public MessageService(IMessageRepository messageRepository, ILogger<MessageService> logger)
    {
        _messageRepository = messageRepository;
        _logger = logger;
    }

    public async Task<MessageDto> SendMessageAsync(int senderId, SendMessageRequest request)
    {
        var message = new Message
        {
            SenderId = senderId,
            ReceiverId = request.ReceiverId,
            Content = request.Content,
            SentAt = DateTime.UtcNow,
            IsRead = false
        };

        var created = await _messageRepository.CreateMessageAsync(message);
        return MapToDto(created);
    }

    public async Task<List<ConversationDto>> GetConversationsAsync(int userId)
    {
        var messages = await _messageRepository.GetConversationsAsync(userId);

        // Grupează după cealaltă persoană din conversație
        var conversations = messages
            .GroupBy(m => m.SenderId == userId ? m.ReceiverId : m.SenderId)
            .Select(g => new
            {
                OtherUserId = g.Key,
                LastMessage = g.OrderByDescending(m => m.SentAt).First(),
                UnreadCount = g.Count(m => m.ReceiverId == userId && !m.IsRead)
            })
            .OrderByDescending(c => c.LastMessage.SentAt)
            .Select(c => new ConversationDto
            {
                OtherUserId = c.OtherUserId,
                OtherUsername = c.LastMessage.SenderId == userId
                    ? c.LastMessage.Receiver.Username
                    : c.LastMessage.Sender.Username,
                OtherUserAvatar = c.LastMessage.SenderId == userId
                    ? c.LastMessage.Receiver.Profile?.AvatarUrl
                    : c.LastMessage.Sender.Profile?.AvatarUrl,
                LastMessageContent = c.LastMessage.Content,
                LastMessageTime = c.LastMessage.SentAt,
                UnreadCount = c.UnreadCount
            })
            .ToList();

        return conversations;
    }

    public async Task<List<MessageDto>> GetMessagesWithUserAsync(int userId, int otherUserId)
    {
        var messages = await _messageRepository.GetMessagesWithUserAsync(userId, otherUserId);
        return messages.Select(MapToDto).ToList();
    }

    public async Task MarkMessagesAsReadAsync(int userId, int otherUserId)
    {
        await _messageRepository.MarkMessagesAsReadAsync(userId, otherUserId);
    }

    private static MessageDto MapToDto(Message message)
    {
        return new MessageDto
        {
            Id = message.Id,
            SenderId = message.SenderId,
            ReceiverId = message.ReceiverId,
            Content = message.Content,
            SentAt = message.SentAt,
            IsRead = message.IsRead,
            ReadAt = message.ReadAt,
            SenderUsername = message.Sender?.Username ?? "",
            ReceiverUsername = message.Receiver?.Username ?? ""
        };
    }
}
