﻿using WriteWave.Domain.Models;
using Microsoft.EntityFrameworkCore;


namespace WriteWave.Persistence.Data;

public class ApplicationDbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<Article> Articles { get; set; }
    public DbSet<Comment> Comments { get; set; }
    public DbSet<Like> Likes { get; set; }
    public DbSet<UserChat> UserChats { get; set; }
    public DbSet<PrivateMessage> PrivateMessages { get; set; }
    public DbSet<Subscription> Subscriptions { get; set; }
    

    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
        
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(ApplicationDbContext).Assembly);
        SeedData(modelBuilder);
    }
    private void SeedData(ModelBuilder modelBuilder)
    {
        
        // Здесь вы можете добавить код для заполнения базы данных начальными данными
        // Например, создание и добавление объектов в контекст
        var users = new List<User>
        {
            new User { UserId = 1,Username = "user1", Email = "user1@example.com", Password = "password1", VerifiedAt = DateTime.UtcNow },
            new User { UserId = 2, Username = "user2", Email = "user2@example.com", Password = "password2", VerifiedAt = DateTime.UtcNow},
            // Другие пользователи
        };

        modelBuilder.Entity<User>().HasData(users);

        var articles = new List<Article>
        {
            new Article { ArticleId = 1, Title = "Article 1", Content = "Content of article 1", PublicationDate = DateTime.UtcNow, UserId = 1, Status = (ArticleStatus)1},
            new Article { ArticleId = 2,Title = "Article 2", Content = "Content of article 2", PublicationDate = DateTime.UtcNow, UserId = 2 , Status = (ArticleStatus)1},
            // Другие статьи
        };

        modelBuilder.Entity<Article>().HasData(articles);

        // Другие сущности и данные
    }
}