using System.ComponentModel.DataAnnotations;

namespace WriteWave.Domain.Models;

public class Article
{
    [Key]
    public int ArticleId { get; set; }
    
    [Required]
    public string Title { get; set; }
    
    [Required]
    public string Content { get; set; }

    public DateTime PublicationDate { get; set; } = DateTime.UtcNow;
    
    // Внешний ключ для связи с пользователем
    public int UserId { get; set; }
    public User User { get; set; }
    
    // Список комментариев к статье
    public List<Comment> Comments { get; set; }
    
    // Список лайков для статьи
    public List<Like> Likes { get; set; }
}