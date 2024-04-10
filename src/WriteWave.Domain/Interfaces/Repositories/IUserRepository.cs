using WriteWave.Domain.Models;

namespace WriteWave.Domain.Interfaces.Repositories;

public interface IUserRepository : IRepository<User>
{
    // Дополнительные методы, специфичные для работы с пользователями, могут быть добавлены здесь
}