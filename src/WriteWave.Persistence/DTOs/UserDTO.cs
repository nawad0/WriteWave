namespace WriteWave.Persistence.DTOs;

public class UserDTO
{
    public int UserId { get; set; }
    public string Username { get; set; }
    public string Email { get; set; }
    public string UserImage { get; set; }
    // public List<ArticleDTO> Articles { get; set; }
    // public List<CommentDTO> Comments { get; set; }
    // public List<SubscriptionDTO> Subscriptions { get; set; }
}