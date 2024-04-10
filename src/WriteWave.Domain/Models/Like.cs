using System.ComponentModel.DataAnnotations;

namespace WriteWave.Domain.Models;

public class Like
{
    [Key]
    public int LikeId { get; set; }
    
    // Внешний ключ для связи с пользователем
    public int UserId { get; set; }
    public User User { get; set; }
    
    // Внешний ключ для связи со статьей
    public int ArticleId { get; set; }
    public Article Article { get; set; }
}