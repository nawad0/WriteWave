using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WriteWave.Domain.Models;

namespace WriteWave.Persistence.Configurations;

public class UserArticleConfiguration : IEntityTypeConfiguration<UserArticle>
{
    public void Configure(EntityTypeBuilder<UserArticle> builder)
    {
        builder.HasKey(ua => new { ua.UserId, ua.ArticleId });

        builder.HasOne(ua => ua.User)
            .WithMany(u => u.FavoritedArticles)
            .HasForeignKey(ua => ua.UserId);

        builder.HasOne(ua => ua.Article)
            .WithMany(a => a.FavoritedByUsers)
            .HasForeignKey(ua => ua.ArticleId);
    }
}