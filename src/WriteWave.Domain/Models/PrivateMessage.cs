namespace WriteWave.Domain.Models;

public class PrivateMessage
{
    public int MessageId { get; set; }
    
    public string Content { get; set; }
    
    public DateTime SentAt { get; set; }
        
    public int SenderId { get; set; }
    public User Sender { get; set; }
        
    public int ChatId { get; set; }
    public UserChat Chat { get; set; }
}