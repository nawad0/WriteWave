namespace WriteWave.Persistence.DTOs;

public class MyArticleDTO
{
    public int ArticleId { get; set; }
    public int UserId { get; set; }
    public string Title { get; set; }
    public string Content { get; set; }
    public string UserImage { get; set; }
    public string Username { get; set; }
    // public DateTime PublicationDate { get; set; }
    public int LikeCount { get; set; }
    public string Status { get; set; }
    public int CommentCount { get; set; }
    
}