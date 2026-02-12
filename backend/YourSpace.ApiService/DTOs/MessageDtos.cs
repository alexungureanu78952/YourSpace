namespace YourSpace.ApiService.DTOs;

/// <summary>
/// DTO pentru trimitere mesaj
/// </summary>
public class SendMessageRequest
{
    public int ReceiverId { get; set; }
    public string Content { get; set; } = string.Empty;
}

/// <summary>
/// DTO pentru mesaj returnat în API
/// </summary>
public class MessageDto
{
    public int Id { get; set; }
    public int SenderId { get; set; }
    public int ReceiverId { get; set; }
    public string Content { get; set; } = string.Empty;
    public DateTime SentAt { get; set; }
    public bool IsRead { get; set; }
    public DateTime? ReadAt { get; set; }
    public string SenderUsername { get; set; } = string.Empty;
    public string ReceiverUsername { get; set; } = string.Empty;
}

/// <summary>
/// DTO pentru o conversație (preview cu ultimul mesaj)
/// </summary>
public class ConversationDto
{
    public int OtherUserId { get; set; }
    public string OtherUsername { get; set; } = string.Empty;
    public string? OtherUserAvatar { get; set; }
    public string LastMessageContent { get; set; } = string.Empty;
    public DateTime LastMessageTime { get; set; }
    public int UnreadCount { get; set; }
}
