using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WriteWave.Application.Minio;
using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Domain.Models;
using WriteWave.Persistence.DTOs;

namespace WriteWave.Api.Controllers
{
    [ApiController]
    [Route("api/article")]
    public class ArticleController : ControllerBase
    {
        private readonly IArticleRepository _articleRepository;
        private readonly IRepository<Like> _likeRepository;
        private readonly IRepository<UserArticle> _userArticleRepository;
        private readonly IRepository<Comment> _commentRepository;
        private readonly IMapper _mapper;
        private readonly IUserRepository _userRepository;
        private readonly IMinioService _minioService;
        private readonly ISubscriptionRepository _subscriptionRepository;

        public ArticleController(IArticleRepository articleRepository, IMapper mapper, IUserRepository userRepository,
            IRepository<Like> likeRepository, IRepository<Comment> commentRepository,
            IRepository<UserArticle> userArticleRepository, IMinioService minioService,
            ISubscriptionRepository subscriptionRepository)
        {
            _articleRepository = articleRepository;
            _mapper = mapper;
            _userRepository = userRepository;
            _likeRepository = likeRepository;
            _commentRepository = commentRepository;
            _userArticleRepository = userArticleRepository;
            _minioService = minioService;
            _subscriptionRepository = subscriptionRepository;
        }

        [HttpPost("subscribe/{targetUserId}")]
        [Authorize]
        public async Task<IActionResult> SubscribeToUser(int targetUserId)
        {
            var userId = int.Parse(User.FindFirst("userId").Value);
            
            var targetUser = await _userRepository.GetUserAsync(targetUserId);
            if (targetUser == null)
            {
                return NotFound(new { Message = "User not found" });
            }
            var existingSubscription = await _subscriptionRepository.GetSubscriptionAsync(userId, targetUserId);
            if (existingSubscription != null)
            {
                await _subscriptionRepository.RemoveAsync(existingSubscription);
                return Ok(new { UserSubscribed = false});
            }
            var subscription = new Subscription
            {
                SubscriberUserId = userId,
                TargetUserId = targetUserId
            };
            await _subscriptionRepository.CreateAsync(subscription);
            return Ok(new { UserSubscribed = true});
        }
        
        [HttpGet]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> GetArticles(int pageSize = 0, int pageNumber = 0)
        {
            var articles = await _articleRepository.GetAllAsync(
                includeProperties: "Comments,Likes,User",
                pageSize: pageSize,
                pageNumber: pageNumber
            );
            var articleDTOs = new List<ArticlesDTO>();


            foreach (var article in articles)
            {
                var articleDTO = _mapper.Map<ArticlesDTO>(article);
                articleDTOs.Add(articleDTO);
            }
          
            var art = await _articleRepository.GetAllAsync();
            var totalCount = art.Count();
            var userId = int.Parse(User.FindFirst("userId").Value);
            var userArticles = await _userArticleRepository.GetAllAsync(ua => ua.UserId == userId);
            var favoriteArticleIds = userArticles.Select(ua => ua.ArticleId).ToList(); var user = await _userRepository.GetAsync(includeProperties: "FavoritedArticles");
            foreach (var article in articleDTOs)
            {
                var like = await _likeRepository.GetAsync(l => l.UserId == userId && l.ArticleId == article.ArticleId);
                
                if (like != null)
                {
                    article.UserLiked = true;
                }
                var subscription = await _subscriptionRepository.GetAsync(s => s.SubscriberUserId == userId && s.TargetUserId == article.UserId);
                if (subscription != null)
                {
                    article.UserSubscribed = true;
                }

                if (favoriteArticleIds.Contains(article.ArticleId))
                {
                    article.UserFavorited = true; 
                }
                else
                {
                    article.UserFavorited = false; 
                }
            }

            var response = new
            {
                TotalCount = totalCount,
                PageNumber = pageNumber,
                Articles = articleDTOs
            };

            return Ok(response);
        }
        [HttpGet("published")]
        public async Task<IActionResult> GetPublishedArticles(int pageSize = 0, int pageNumber = 0)
        {
            // Получаем опубликованные статьи
            var publishedArticles = await _articleRepository.GetAllAsync(
                filter: a => a.Status == ArticleStatus.Published,
                includeProperties: "Comments,Likes,User",
                pageSize: pageSize,
                pageNumber: pageNumber
            );
            var articles = await _articleRepository.GetAllAsync(
                filter: a => a.Status == ArticleStatus.Published,
                pageSize: 0,
                pageNumber: 0
            );
            var totalCount = articles.Count();
            
            var publishedArticleDTOs = publishedArticles.Select(article => _mapper.Map<ArticlesDTO>(article)).ToList();
            
            try
            {
                var userId = int.Parse(User.FindFirst("userId").Value);
                var userArticles = await _userArticleRepository.GetAllAsync(ua => ua.UserId == userId);
                var favoriteArticleIds = userArticles.Select(ua => ua.ArticleId).ToList();
                foreach (var article in publishedArticleDTOs)
                {
                    var like = await _likeRepository.GetAsync(l => l.UserId == userId && l.ArticleId == article.ArticleId);
                    if (like != null)
                    {
                        article.UserLiked = true;
                    }
                    var subscription = await _subscriptionRepository.GetAsync(s => s.SubscriberUserId == userId && s.TargetUserId == article.UserId);
                    if (subscription != null)
                    {
                        article.UserSubscribed = true;
                    }
                    if (favoriteArticleIds.Contains(article.ArticleId))
                    {
                        article.UserFavorited = true; 
                    }
                    else
                    {
                        article.UserFavorited = false; 
                    }
                }
            }
            catch(NullReferenceException e)
            {
                foreach (var article in publishedArticleDTOs)
                {
                    article.UserLiked = false;
                    article.UserSubscribed = false;
                }
            }
            

            // Формируем ответ
            var response = new
            {
                TotalCount = totalCount,
                PageNumber = pageNumber,
                Articles = publishedArticleDTOs
            };

            return Ok(response);
        }
        [HttpGet("getArticlesByUser/{userId}")]
        public async Task<IActionResult> GetArticlesByUserId(int userId)
        {
            var publishedArticles = await _articleRepository.GetAllAsync(
                filter: a => a.Status == ArticleStatus.Published && a.UserId == userId
            );
            
            var articlesWithIds = publishedArticles.Select(a => new
            {
                ArticleId = a.ArticleId,
                Title = a.Title,
                UserId = a.UserId
            }).ToList();
            
            var response = new
            {
                Articles = articlesWithIds
            };

            return Ok(response);
        }


        [HttpGet("myArticles")]
        [Authorize]
        public async Task<IActionResult> GetMyArticles(int pageSize = 0, int pageNumber = 0)
        {
            var userId = int.Parse(User.FindFirst("userId").Value);

            var articles = await _articleRepository.GetAllAsync(
                filter: a => a.UserId == userId,
                includeProperties: "Comments,Likes,User",
                pageSize: pageSize,
                pageNumber: pageNumber
            );
            var userArticles = await _userArticleRepository.GetAllAsync(ua => ua.UserId == userId);
            var favoriteArticleIds = userArticles.Select(ua => ua.ArticleId).ToList();
            var articleDTOs = articles.Select(article => _mapper.Map<MyArticleDTO>(article)).ToList();
            
            var totalCount = articleDTOs.Count();
            

            var response = new
            {
                TotalCount = totalCount,
                PageNumber = pageNumber,
                Articles = articleDTOs
            };

            return Ok(response);
        }
        [HttpGet("subscribed-articles")]
        [Authorize] 
        public async Task<IActionResult> GetSubscribedArticles(int pageSize = 0, int pageNumber = 0)
        {
            var userId = int.Parse(User.FindFirst("userId").Value);

            var subscriptions = await _subscriptionRepository.GetAllAsync(filter: u => u.SubscriberUserId == userId);
            
            var targetUserIds = subscriptions.Select(s => s.TargetUserId).ToList();
            
            var articles = await _articleRepository.GetAllAsync(filter: a => targetUserIds.Contains(a.UserId) && a.Status == ArticleStatus.Published,
                includeProperties: "Comments,Likes,User",
                pageSize: pageSize,
                pageNumber: pageNumber);
            
            var art = await _articleRepository.GetAllAsync(
                filter: a => targetUserIds.Contains(a.UserId) && a.Status == ArticleStatus.Published,
                pageSize: 0,
                pageNumber: 0
            );
            var totalCount = art.Count();
            var userArticles = await _userArticleRepository.GetAllAsync(ua => ua.UserId == userId);
            var favoriteArticleIds = userArticles.Select(ua => ua.ArticleId).ToList();
            // Преобразуем каждую статью в DTO и добавляем в список
            var articlesDTOs = articles.Select(a => _mapper.Map<ArticlesDTO>(a)).ToList();
            foreach (var article in articlesDTOs)
            {
                var like = await _likeRepository.GetAsync(l => l.UserId == userId && l.ArticleId == article.ArticleId);
                if (like != null)
                {
                    article.UserLiked = true;
                }
                var subscription = await _subscriptionRepository.GetAsync(s => s.SubscriberUserId == userId && s.TargetUserId == article.UserId);
                if (subscription != null)
                {
                    article.UserSubscribed = true;
                }
                if (favoriteArticleIds.Contains(article.ArticleId))
                {
                    article.UserFavorited = true; 
                }
                else
                {
                    article.UserFavorited = false; 
                }
            }
            var response = new
            {
                TotalCount = totalCount,
                PageNumber = pageNumber,
                Articles = articlesDTOs
            };

            return Ok(response);
        }

        // GET: api/article/favorites
        [HttpGet]
        [Route("favorites")]
        [Authorize]
        public async Task<IActionResult> GetFavoriteArticles(int pageSize = 0, int pageNumber = 0)
        {
            var userId = int.Parse(User.FindFirst("userId").Value);
            var userArticles = await _userArticleRepository.GetAllAsync(ua => ua.UserId == userId);

            var articleIds = userArticles.Select(ua => ua.ArticleId).ToList();

            var articles = await _articleRepository.GetAllAsync(
                filter: a => articleIds.Contains(a.ArticleId) && a.Status == ArticleStatus.Published,
                includeProperties: "Comments,Likes,User",
                pageSize: pageSize,
                pageNumber: pageNumber
            );
            var art = await _articleRepository.GetAllAsync(
                filter: a => a.Status == ArticleStatus.Published,
                pageSize: 0,
                pageNumber: 0
            );
            var totalCount = articles.Count(); 
            var favoriteArticleIds = userArticles.Select(ua => ua.ArticleId).ToList();
            
            var articlesDTOs = articles.Select(a => _mapper.Map<ArticlesDTO>(a)).ToList();
            foreach (var article in articlesDTOs)
            {
                var like = await _likeRepository.GetAsync(l => l.UserId == userId && l.ArticleId == article.ArticleId);
                if (like != null)
                {
                    article.UserLiked = true;
                }
                var subscription = await _subscriptionRepository.GetAsync(s => s.SubscriberUserId == userId && s.TargetUserId == article.UserId);
                if (subscription != null)
                {
                    article.UserSubscribed = true;
                }
              
                if (favoriteArticleIds.Contains(article.ArticleId))
                {
                    article.UserFavorited = true; 
                }
                else
                {
                    article.UserFavorited = false; 
                }
                

            }
            var response = new
            {
                TotalCount = totalCount,
                PageNumber = pageNumber,
                Articles = articlesDTOs
            };

            return Ok(response);

        }
        
        [HttpPost]
        [Route("favorite/{articleId}")]
        public async Task<IActionResult> AddFavorite(int articleId)
        {

            var userId = int.Parse(User.FindFirst("userId").Value);
            var article = await _articleRepository.GetAsync(a => a.ArticleId == articleId);
            if (article == null)
            {
                return NotFound("Статья не найдена");
            }
            
            var favorite = await _userArticleRepository.GetAsync(ua => ua.UserId == userId && ua.ArticleId == articleId);
            if (favorite != null)
            {
                await _userArticleRepository.RemoveAsync(favorite);
                return Ok(new { userFavorited = false});

            }

            var newUserArticle = new UserArticle
            {
                UserId = userId,
                ArticleId = articleId
            };
            await _userArticleRepository.CreateAsync(newUserArticle);

            return Ok(new { userFavorited = true});
        }
    
      
        
        [HttpPost]
        [Route("comment/{articleId}")]
        public async Task<IActionResult> AddComment(int articleId, CommentCreateEditDTO comment)
        {
            var userId = int.Parse(User.FindFirst("userId").Value);
            var article = await _articleRepository.GetAsync(a => a.ArticleId == articleId);
            if (article == null)
            {
                return NotFound("Статья не найдена");
            }
            
            var newComment = new Comment
            {
                UserId = userId,
                ArticleId = articleId,
                Content = comment.Content
            };
            _commentRepository.CreateAsync(newComment);
            
            return Ok("Комментарий успешно добавлен");
        }
        [HttpDelete]
        [Route("comment/{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            var userId = int.Parse(User.FindFirst("userId").Value);
            var comment = await _commentRepository.GetAsync(c => c.CommentId == commentId && c.UserId == userId);
            if (comment == null)
            {
                return NotFound("Комментарий не найден");
            }
            await _commentRepository.RemoveAsync(comment);

            return NoContent();
        }
        
        [HttpPost]
        [Route("like/{articleId}")]
        public async Task<IActionResult> AddLike(int articleId)
        {
            var userId = int.Parse(User.FindFirst("userId").Value);
            
            var article = await _articleRepository.GetAsync(a => a.ArticleId == articleId);
            if (article == null)
            {
                return NotFound("Статья не найдена");
            }
            
            var existingLike = await _likeRepository.GetAsync(l => l.UserId == userId && l.ArticleId == articleId);
            if (existingLike != null)
            {
                await _likeRepository.RemoveAsync(existingLike);
                
                return Ok(new { UserLiked = false });
            }
            
            var like = new Like
            {
                UserId = userId,
                ArticleId = articleId
            };
            
            await _likeRepository.CreateAsync(like);
            return Ok( new { UserLiked = true });
        }
        
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticle(int id, int commentPageSize = 0, int commentPageNumber = 0)
        {
            var article = await _articleRepository.GetAsync(
                filter: a => a.ArticleId == id,
                includeProperties: "Comments.User,Likes,User"
            );
            if (article == null)
            {
                return NotFound();
            }

            List<Comment> comments = article.Comments.Skip(commentPageSize * commentPageNumber)
                    .Take(commentPageSize)
                    .ToList();
            
            var newArticle = _mapper.Map<ArticleDTO>(article);
            newArticle.LikeCount = article.Likes.Count;
            newArticle.CommentCount = article.Comments.Count;
            newArticle.Comments = _mapper.Map<List<CommentDTO>>(comments);

            var userId = int.Parse(User.FindFirst("userId").Value);
            newArticle.UserId = article.UserId;
            var user = await _userRepository.GetUserAsync(userId);
            
            var userArticles = await _userArticleRepository.GetAllAsync(ua => ua.UserId == userId);
            var favoriteArticleIds = userArticles.Select(ua => ua.ArticleId).ToList(); 
            var like = await _likeRepository.GetAsync(l => l.UserId == userId && l.ArticleId == article.ArticleId);
                
            if (like != null)
            {
                newArticle.UserLiked = true;
            }
            var subscription = await _subscriptionRepository.GetAsync(s => s.SubscriberUserId == userId && s.TargetUserId == article.UserId);
            if (subscription != null)
            {
                newArticle.UserSubscribed = true;
            }

            if (favoriteArticleIds.Contains(article.ArticleId))
            {
                newArticle.UserFavorited = true; 
            }
            else
            {
                newArticle.UserFavorited = false; 
            }

            return Ok(newArticle);
        }
        
        [HttpPost]
        public async Task<IActionResult> CreateArticle(ArticleCreateEditDTO article)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newArticle = _mapper.Map<Article>(article);
            newArticle.UserId = int.Parse(User.FindFirst("userId").Value);
            newArticle.Status = (ArticleStatus)article.ArticleStatus;
            await _articleRepository.CreateAsync(newArticle);
            return CreatedAtAction(nameof(GetArticle), new { id = newArticle.ArticleId }, article);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArticle(int id, ArticleCreateEditDTO articleDto)
        {

            var existingArticle = await _articleRepository.GetAsync(a => a.ArticleId == id);
            if (existingArticle == null)
            {
                return NotFound();
            }

            try
            {
                existingArticle.Title = articleDto.Title;
                existingArticle.Content = articleDto.Content;
                existingArticle.Status = (ArticleStatus)articleDto.ArticleStatus;
                await _articleRepository.UpdateAsync(existingArticle);

                return Ok("Статья успешно обновлена");
            }
            catch (Exception ex)
            {
                return StatusCode(500, "Internal server error");
            }
        }
        [HttpPut("updateStatus/{id}")]
        public async Task<IActionResult> UpdateStatus(int id, int articleStatus)
        {
            var existingArticle = await _articleRepository.GetAsync(a => a.ArticleId == id);
            existingArticle.Status = (ArticleStatus)articleStatus;
            await _articleRepository.UpdateAsync(existingArticle);
            return NoContent();
        }
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteArticle(int id)
        {
            var article = await _articleRepository.GetAsync(a => a.ArticleId == id);
            if (article == null)
            {
                return NotFound();
            }
            await _articleRepository.RemoveAsync(article);
            return NoContent();
        }
    }
}
