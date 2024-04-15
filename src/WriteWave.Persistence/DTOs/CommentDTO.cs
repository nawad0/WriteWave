namespace WriteWave.Persistence.DTOs;

public class CommentDTO
{
    public int CommentId { get; set; }
    public string Content { get; set; }
    public int UserId { get; set; }
    public string Username { get; set; }
    public string UserImage { get; set; }
}