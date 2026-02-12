using YourSpace.ApiService.DTOs;

namespace YourSpace.ApiService.Services;

/// <summary>
/// Interfață pentru serviciul de messaging
/// </summary>
public interface IMessageService
{
    /// <summary>
    /// Trimite un mesaj către un alt utilizator
    /// </summary>
    Task<MessageDto> SendMessageAsync(int senderId, SendMessageRequest request);
    
    /// <summary>
    /// Obține toate conversațiile utilizatorului curent (cu preview)
    /// </summary>
    Task<List<ConversationDto>> GetConversationsAsync(int userId);
    
    /// <summary>
    /// Obține toate mesajele dintr-o conversație cu un alt utilizator
    /// </summary>
    Task<List<MessageDto>> GetMessagesWithUserAsync(int userId, int otherUserId);
    
    /// <summary>
    /// Marchează mesajele ca citite
    /// </summary>
    Task MarkMessagesAsReadAsync(int userId, int otherUserId);
}
