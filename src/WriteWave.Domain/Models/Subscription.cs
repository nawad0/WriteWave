using System.ComponentModel.DataAnnotations;

namespace WriteWave.Domain.Models;

public class Subscription
{
    [Key]
    public int SubscriptionId { get; set; }
    
    // Внешний ключ для связи с подписчиком
    public int SubscriberUserId { get; set; }
    public User SubscriberUser { get; set; }
    
    // Внешний ключ для связи с целевым пользователем
    public int TargetUserId { get; set; }
    public User TargetUser { get; set; }
}