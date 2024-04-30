using System.ComponentModel.DataAnnotations;
using WriteWave.Domain.Models;

namespace WriteWave.Persistence.DTOs;

public class ArticleCreateEditDTO
{
    [Required]
    public string Title { get; set; }
    [Required]
    public string Content { get; set; }
    
    public int ArticleStatus { get; set; } 
}