namespace WriteWave.Persistence.DTOs;

public class SubscriptionDTO
{
    public int SubscriptionId { get; set; }
    public int SubscriberUserId { get; set; }
    public int TargetUserId { get; set; }
}