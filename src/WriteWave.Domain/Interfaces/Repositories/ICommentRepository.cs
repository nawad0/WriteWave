using WriteWave.Domain.Models;

namespace WriteWave.Domain.Interfaces.Repositories;

public interface ICommentRepository : IRepository<Comment>
{
    // Дополнительные методы, специфичные для работы с комментариями, могут быть добавлены здесь
}