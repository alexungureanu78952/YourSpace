using Microsoft.EntityFrameworkCore;
using YourSpace.Data.Models;

namespace YourSpace.Data.Repositories;

/// <summary>
/// Repository pentru gestionarea mesajelor
/// </summary>
public class MessageRepository : IMessageRepository
{
    private readonly YourSpaceDbContext _context;

    public MessageRepository(YourSpaceDbContext context)
    {
        _context = context;
    }

    public async Task<Message> CreateMessageAsync(Message message)
    {
        _context.Messages.Add(message);
        await _context.SaveChangesAsync();
        return await _context.Messages
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .FirstOrDefaultAsync(m => m.Id == message.Id) ?? message;
    }

    public async Task<List<Message>> GetMessagesWithUserAsync(int userId, int otherUserId)
    {
        return await _context.Messages
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Where(m => (m.SenderId == userId && m.ReceiverId == otherUserId) ||
                       (m.SenderId == otherUserId && m.ReceiverId == userId))
            .OrderBy(m => m.SentAt)
            .ToListAsync();
    }

    public async Task<List<Message>> GetConversationsAsync(int userId)
    {
        // Obține ultimul mesaj din fiecare conversație
        return await _context.Messages
            .Include(m => m.Sender)
            .Include(m => m.Receiver)
            .Where(m => m.SenderId == userId || m.ReceiverId == userId)
            .OrderByDescending(m => m.SentAt)
            .ToListAsync();
    }

    public async Task MarkMessagesAsReadAsync(int userId, int otherUserId)
    {
        var unreadMessages = await _context.Messages
            .Where(m => m.SenderId == otherUserId && m.ReceiverId == userId && !m.IsRead)
            .ToListAsync();

        foreach (var message in unreadMessages)
        {
            message.IsRead = true;
            message.ReadAt = DateTime.UtcNow;
        }

        await _context.SaveChangesAsync();
    }
}
