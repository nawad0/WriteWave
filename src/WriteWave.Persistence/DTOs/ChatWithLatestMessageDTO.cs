namespace WriteWave.Persistence.DTOs;

public class ChatWithLatestMessageDTO
{
    public int ChatId { get; set; }
    public int UserId { get; set; }
    public string UserName { get; set; }
    public string LatestMessage { get; set; }
    public DateTime LatestMessageSentAt { get; set; }
}
