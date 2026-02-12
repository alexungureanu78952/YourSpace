namespace YourSpace.Data.Models;

/// <summary>
/// Reprezintă un mesaj între doi utilizatori
/// </summary>
public class Message
{
    public int Id { get; set; }
    
    /// <summary>
    /// ID-ul utilizatorului care trimite mesajul
    /// </summary>
    public int SenderId { get; set; }
    
    /// <summary>
    /// ID-ul utilizatorului care primește mesajul
    /// </summary>
    public int ReceiverId { get; set; }
    
    /// <summary>
    /// Conținutul mesajului
    /// </summary>
    public string Content { get; set; } = string.Empty;
    
    /// <summary>
    /// Data și ora trimiterii mesajului
    /// </summary>
    public DateTime SentAt { get; set; } = DateTime.UtcNow;
    
    /// <summary>
    /// Indică dacă mesajul a fost citit
    /// </summary>
    public bool IsRead { get; set; } = false;
    
    /// <summary>
    /// Data și ora citirii mesajului (null dacă nu a fost citit)
    /// </summary>
    public DateTime? ReadAt { get; set; }
    
    /// <summary>
    /// Navigare către sender
    /// </summary>
    public User Sender { get; set; } = null!;
    
    /// <summary>
    /// Navigare către receiver
    /// </summary>
    public User Receiver { get; set; } = null!;
}
