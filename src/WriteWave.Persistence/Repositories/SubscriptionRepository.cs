using Microsoft.EntityFrameworkCore;
using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Domain.Models;
using WriteWave.Persistence.Data;

namespace WriteWave.Persistence.Repositories;

public class SubscriptionRepository : Repository<Subscription>, ISubscriptionRepository
{
    private readonly ApplicationDbContext _db;

    public SubscriptionRepository(ApplicationDbContext db) : base(db)
    {
        _db = db;
    }
    public async Task<Subscription> GetSubscriptionAsync(int subscriberUserId, int targetUserId)
    {
        return await _db.Subscriptions.FirstOrDefaultAsync(s =>
            s.SubscriberUserId == subscriberUserId && s.TargetUserId == targetUserId);
    }
}