using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WriteWave.Domain.Models;

namespace WriteWave.Persistence.Configurations;

public class LikeConfiguration : IEntityTypeConfiguration<Like>
{
    public void Configure(EntityTypeBuilder<Like> builder)
    {
        // Конфигурация ключа
        builder.HasKey(l => l.LikeId);
        
        // Конфигурация отношений
        builder.HasOne(l => l.User)
            .WithMany(u => u.Likes)
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(l => l.Article)
            .WithMany(a => a.Likes)
            .HasForeignKey(l => l.ArticleId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}