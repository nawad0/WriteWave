using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Domain.Models;
using WriteWave.Persistence.Data;

namespace WriteWave.Persistence.Repositories;

public class ArticleRepository : Repository<Article>, IArticleRepository
{
    private readonly ApplicationDbContext _db;
    public ArticleRepository(ApplicationDbContext db) : base(db)
    {
        _db = db;
    }
    
    public async Task<int> CountAsync(Expression<Func<Article, bool>> predicate)
    {
        return await _db.Articles.CountAsync(predicate);
    }
    public async Task<List<Article>> GetArticlesAsync(
        Expression<Func<Article, bool>>? filter = null,
        string? includeProperties = null,
        int pageSize = 0,
        int pageNumber = 1,
        string? orderBy = null)
    {
        IQueryable<Article> query = _db.Articles;

        if (filter != null)
        {
            query = query.Where(filter);
        }
    
        // Применяем сортировку в зависимости от переданного orderBy
        if (!string.IsNullOrEmpty(orderBy))
        {
                if (orderBy == "content_desc")
                {
                    query = query.OrderByDescending(a => a.Content);
                }
                else if (orderBy == "publicationDate")
                {
                    query = query.OrderBy(a => a.PublicationDate);
                }
                else if (orderBy == "publicationDate_desc")
                {
                    query = query.OrderByDescending(a => a.PublicationDate);
                }
                else if (orderBy == "likeCount_1month")
                {
                    // Calculate the date one month ago from now
                    var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
                    
                    query = query.Where(a => a.PublicationDate >= oneMonthAgo)
                        .OrderByDescending(a => a.Likes.Count);
                    
                }

                else if (orderBy == "commentCount")
                {
                    query = query.OrderByDescending(a => a.Comments.Count);
                }
                else if (orderBy == "1month")
                {
                    var oneMonthAgo = DateTime.UtcNow.AddMonths(-1);
                    query = query.Where(a => a.PublicationDate >= oneMonthAgo)
                        .OrderBy(a => a.PublicationDate);
                }
                else if (orderBy == "6months")
                {
                    var sixMonthsAgo = DateTime.UtcNow.AddMonths(-6);
                    query = query.Where(a => a.PublicationDate >= sixMonthsAgo)
                        .OrderBy(a => a.PublicationDate);
                }
                else if (orderBy == "1year")
                {
                    var oneYearAgo = DateTime.UtcNow.AddYears(-1);
                    query = query.Where(a => a.PublicationDate >= oneYearAgo)
                        .OrderBy(a => a.PublicationDate);
                }
                else if (orderBy == "allTime")
                {
                    // Нет необходимости в дополнительной фильтрации
                    query = query.OrderBy(a => a.PublicationDate);
                }
                else
                {
                    // По умолчанию сортируем по заголовку статьи
                    query = query.OrderBy(a => a.Title);
                }

        }

        if (pageSize > 0)
        {
            if (pageSize > 100)
            {
                pageSize = 100;
            }
            query = query.Skip(pageSize * (pageNumber - 1)).Take(pageSize);
        }

        if (includeProperties != null)
        {
            foreach (var includeProp in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
            {
                query = query.Include(includeProp);
            }
        }

        return await query.ToListAsync();
    }

}