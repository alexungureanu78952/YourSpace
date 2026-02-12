using YourSpace.Data.Models;

namespace YourSpace.Data.Repositories;

/// <summary>
/// Interfață pentru repository-ul de mesaje
/// </summary>
public interface IMessageRepository
{
    Task<Message> CreateMessageAsync(Message message);
    Task<List<Message>> GetMessagesWithUserAsync(int userId, int otherUserId);
    Task<List<Message>> GetConversationsAsync(int userId);
    Task MarkMessagesAsReadAsync(int userId, int otherUserId);
}
