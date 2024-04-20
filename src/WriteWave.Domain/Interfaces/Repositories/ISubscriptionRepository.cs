using WriteWave.Domain.Models;

namespace WriteWave.Domain.Interfaces.Repositories;

public interface ISubscriptionRepository : IRepository<Subscription>
{
    Task<Subscription> GetSubscriptionAsync(int userId, int targetUserId);
}