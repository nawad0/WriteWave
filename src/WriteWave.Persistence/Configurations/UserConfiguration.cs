using WriteWave.Domain.Models;

namespace WriteWave.Persistence.Configurations;

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

public class UserConfiguration : IEntityTypeConfiguration<User>
{
    public void Configure(EntityTypeBuilder<User> builder)
    {
        // Конфигурация ключа
        builder.HasKey(u => u.UserId);
        
        // Конфигурация свойств
        builder.Property(u => u.Username).IsRequired();
        builder.Property(u => u.Email).IsRequired();
        builder.Property(u => u.Password).IsRequired();
        
        // Конфигурация отношений
        builder.HasMany(u => u.Articles)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.Comments)
            .WithOne(c => c.User)
            .HasForeignKey(c => c.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.Likes)
            .WithOne(l => l.User)
            .HasForeignKey(l => l.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasMany(u => u.Subscriptions)
            .WithOne(s => s.SubscriberUser)
            .HasForeignKey(s => s.SubscriberUserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}