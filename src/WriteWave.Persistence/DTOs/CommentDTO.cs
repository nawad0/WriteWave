namespace WriteWave.Persistence.DTOs;

public class CommentDTO
{
    public int CommentId { get; set; }
    public string Content { get; set; }
    public int UserId { get; set; }
    public int? ParentId { get; set; }
    public string Username { get; set; }
    public string UserImage { get; set; }
    public DateTime PublicationDate { get; set; }
    public List<CommentDTO> Replies { get; set; } = new List<CommentDTO>();
}