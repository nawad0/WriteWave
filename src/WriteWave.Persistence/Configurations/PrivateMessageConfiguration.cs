using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WriteWave.Domain.Models;

namespace WriteWave.Persistence.Configurations;

public class PrivateMessageConfiguration : IEntityTypeConfiguration<PrivateMessage>
{
    public void Configure(EntityTypeBuilder<PrivateMessage> builder)
    {
        builder.HasKey(pm => pm.MessageId);

        builder.HasOne(pm => pm.Sender)
            .WithMany(u => u.SentMessages)
            .HasForeignKey(pm => pm.SenderId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(pm => pm.Chat)
            .WithMany(uc => uc.Messages)
            .HasForeignKey(pm => pm.ChatId);

        builder.ToTable("PrivateMessages");
    }
}
