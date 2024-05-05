namespace WriteWave.Domain.Models;

using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
public class User
{
    [Key]
    public int UserId { get; set; }
    
    [Required]
    public string Username { get; set; }
    
    [Required]
    public string Email { get; set; }
    
    [Required]
    public string Password { get; set; }
    
    // Список статей, которые написал пользователь
    public List<Article> Articles { get; set; }
    
    // Список комментариев, написанных пользователем
    public List<Comment> Comments { get; set; }
    
    // Список лайков, поставленных пользователем
    public List<Like> Likes { get; set; }
    
    // Список подписок на других пользователей
    public List<Subscription> Subscriptions { get; set; }
    
    public Roles Role { get; set; }
    public List<UserArticle> FavoritedArticles { get; set; }
    public bool EmailConfirmed { get; set; } = false;
    public string? VerificationToken { get; set; }
    public DateTime? VerifiedAt { get; set; }
    public string PasswordResetToken { get; set; }
    public DateTime? PasswordResetTokenExpires { get; set; }
    public string Image { get; set; }
}