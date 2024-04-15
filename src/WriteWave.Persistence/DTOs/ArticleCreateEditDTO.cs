using System.ComponentModel.DataAnnotations;

namespace WriteWave.Persistence.DTOs;

public class ArticleCreateEditDTO
{
    [Required]
    public string Title { get; set; }
    [Required]
    public string Content { get; set; }
}