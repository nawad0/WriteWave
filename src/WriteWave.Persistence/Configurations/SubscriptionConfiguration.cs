using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WriteWave.Domain.Models;

namespace WriteWave.Persistence.Configurations;

public class SubscriptionConfiguration : IEntityTypeConfiguration<Subscription>
{
    public void Configure(EntityTypeBuilder<Subscription> builder)
    {
        // Конфигурация ключа
        builder.HasKey(s => s.SubscriptionId);
        
        // Конфигурация отношений
        builder.HasOne(s => s.SubscriberUser)
            .WithMany(u => u.Subscriptions)
            .HasForeignKey(s => s.SubscriberUserId)
            .OnDelete(DeleteBehavior.Cascade);

        builder.HasOne(s => s.TargetUser)
            .WithMany()
            .HasForeignKey(s => s.TargetUserId)
            .OnDelete(DeleteBehavior.Cascade);
    }
}