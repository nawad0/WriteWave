namespace WriteWave.Persistence.DTOs;

public class ArticleDTO
{
    public int ArticleId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    // public DateTime PublicationDate { get; set; }
    public int LikeCount { get; set; }
    public int CommentCount { get; set; }
    public bool UserLiked { get; set; }
}