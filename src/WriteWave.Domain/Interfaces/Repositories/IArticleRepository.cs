using System.Linq.Expressions;
using WriteWave.Domain.Models;

namespace WriteWave.Domain.Interfaces.Repositories;

public interface IArticleRepository : IRepository<Article>
{
    Task<int> CountAsync(Expression<Func<Article, bool>> predicate);
    // public Task<List<Article>> GetArticlesUsingSqlAsync(string sqlQuery, params object[] parameters);
    public Task<List<Article>> GetArticlesAsync(
        Expression<Func<Article, bool>>? filter = null,
        string? includeProperties = null,
        int pageSize = 0,
        int pageNumber = 1,
        string? orderBy = null);

}