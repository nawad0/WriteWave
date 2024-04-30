namespace WriteWave.Persistence.DTOs;

public class ArticleDTO
{
    public int ArticleId { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public string UserImage { get; set; }
    public string Username { get; set; }
    // public DateTime PublicationDate { get; set; }
    public int LikeCount { get; set; }
    public int CommentCount { get; set; }
    public List<CommentDTO> Comments { get; set; }
    public bool UserLiked { get; set; }
    public bool UserSubscribed { get; set; }
    public bool UserFavorited { get; set; }
}