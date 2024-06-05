using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using WriteWave.Domain.Models;

namespace WriteWave.Persistence.Configurations;

public class UserChatConfiguration : IEntityTypeConfiguration<UserChat>
{
    public void Configure(EntityTypeBuilder<UserChat> builder)
    {
        builder.HasKey(uc => uc.ChatId);

        builder.HasOne(uc => uc.User1)
            .WithMany(u => u.UserChats1)
            .HasForeignKey(uc => uc.User1Id)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(uc => uc.User2)
            .WithMany(u => u.UserChats2)
            .HasForeignKey(uc => uc.User2Id)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(uc => uc.Messages)
            .WithOne(pm => pm.Chat)
            .HasForeignKey(pm => pm.ChatId);

        builder.ToTable("UserChats");
    }
}