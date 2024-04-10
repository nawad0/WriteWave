using WriteWave.Domain.Models;

namespace WriteWave.Domain.Interfaces.Repositories;

public interface IUserRepository : IRepository<User>
{
    public  Task<User> GetByEmail(string email);
    public  Task<User> GetUserAsync(int id);
    public Task<User> GetByUserName(string username);
}