using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace WriteWave.Domain.Models;

public class Comment
{
    [Key]
    public int CommentId { get; set; }

    [Required]
    public string Content { get; set; }

    // Foreign key for the user who made the comment
    public int UserId { get; set; }
    public User User { get; set; }
    public DateTime PublicationDate { get; set; } = DateTime.UtcNow;

    // Foreign key for the article the comment is associated with
    public int ArticleId { get; set; }
    public Article Article { get; set; }

    // Self-referencing foreign key for parent comment
    public int? ParentCommentId { get; set; }
    public Comment ParentComment { get; set; }

    // Collection to hold child comments
    public ICollection<Comment> Replies { get; set; } = new List<Comment>();
}