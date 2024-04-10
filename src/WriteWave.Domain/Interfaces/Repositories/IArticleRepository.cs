using WriteWave.Domain.Models;

namespace WriteWave.Domain.Interfaces.Repositories;

public interface IArticleRepository : IRepository<Article>
{
    // Дополнительные методы, специфичные для работы со статьями, могут быть добавлены здесь
}