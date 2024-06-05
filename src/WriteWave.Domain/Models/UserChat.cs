namespace WriteWave.Domain.Models;

public class UserChat
{
    public int ChatId { get; set; }

    public int User1Id { get; set; }
    public User User1 { get; set; }
    public int User2Id { get; set; }
    public User User2 { get; set; }

    public List<PrivateMessage> Messages { get; set; } = new();
}