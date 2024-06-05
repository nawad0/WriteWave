namespace WriteWave.Api.Hubs;

public class MessageDTO
{
    public string Message { get; set; }
    public string UserName { get; set; }
    public string UserImage { get; set; }
    public DateTime SentAt { get; set; }
}