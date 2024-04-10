using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Domain.Models;
using WriteWave.Persistence.Data;

namespace WriteWave.Persistence.Repositories;

public class ArticleRepository : Repository<Article>, IArticleRepository
{
    public ArticleRepository(ApplicationDbContext db) : base(db) { }
}