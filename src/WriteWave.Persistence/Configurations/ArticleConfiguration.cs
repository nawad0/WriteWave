using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WriteWave.Domain.Models;

namespace WriteWave.Persistence.Configurations;

public class ArticleConfiguration : IEntityTypeConfiguration<Article>
{
    public void Configure(EntityTypeBuilder<Article> builder)
    {
        // Конфигурация ключа
        builder.HasKey(a => a.ArticleId);
        
        // Конфигурация свойств
        builder.Property(a => a.Title).IsRequired();
        builder.Property(a => a.Content).IsRequired();
        builder.Property(a => a.PublicationDate).IsRequired();

        // Конфигурация отношений
        builder.HasMany(a => a.Comments)
            .WithOne(c => c.Article)
            .HasForeignKey(c => c.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(a => a.Likes)
            .WithOne(l => l.Article)
            .HasForeignKey(l => l.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}