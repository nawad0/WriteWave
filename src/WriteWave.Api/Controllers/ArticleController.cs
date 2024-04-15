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
        
        public ArticleController(IArticleRepository articleRepository, IMapper mapper, IUserRepository userRepository, IRepository<Like> likeRepository, IRepository<Comment> commentRepository, IRepository<UserArticle> userArticleRepository, IMinioService minioService)
        {
            _articleRepository = articleRepository;
            _mapper = mapper;
            _userRepository = userRepository;
            _likeRepository = likeRepository;
            _commentRepository = commentRepository;
            _userArticleRepository = userArticleRepository;
            _minioService = minioService;
        }

        // GET: api/article
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
            

            foreach(var article in articles)
            {
                var articleDTO = _mapper.Map<ArticlesDTO>(article);
                articleDTOs.Add(articleDTO);
            }

            var art = await _articleRepository.GetAllAsync();
            var totalCount = art.Count();
            var userId = int.Parse(User.FindFirst("userId").Value);
            var user = await _userRepository.GetUserAsync(userId);
            foreach (var article in articleDTOs)
            {
                var like = await _likeRepository.GetAsync(l => l.UserId == userId && l.ArticleId == article.ArticleId);
                if (like != null)
                {
                    article.UserLiked = true;
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
        [HttpPost]
        [Route("favorite/{articleId}")]
        public async Task<IActionResult> AddFavorite(int articleId)
        {
            // Получаем текущего пользователя
            var userId = int.Parse(User.FindFirst("userId").Value);
            // Проверяем, существует ли статья с указанным articleId
            var article = await _articleRepository.GetAsync(a => a.ArticleId == articleId);
            if (article == null)
            {
                return NotFound("Статья не найдена");
            }
            // Проверяем, добавил ли пользователь уже эту статью в избранное
            var favorite = await _userArticleRepository.GetAsync(ua => ua.UserId == userId && ua.ArticleId == articleId );
            if (favorite != null)
            {
                await _userArticleRepository.RemoveAsync(favorite);
                return Ok("Статья удалена из избранного");
                
            }
            // Создаем новый объект UserArticle
            var newUserArticle = new UserArticle
            {
                UserId = userId,
                ArticleId = articleId
            };
            // Добавляем статью в избранное пользователя
            _userArticleRepository.CreateAsync(newUserArticle);

            return Ok("Статья успешно добавлена в избранное");
        }
        // GET: api/article/favorites
        // GET: api/article/favorites
        [HttpGet]
        [Route("favorites")]
        [Authorize]
        public async Task<IActionResult> GetFavoriteArticles(int pageSize = 0, int pageNumber = 0)
        {
            // Получаем текущего пользователя
            var userId = int.Parse(User.FindFirst("userId").Value);

            // Получаем список избранных статей пользователя
            // Получаем список избранных статей пользователя
            var userArticles = await _userArticleRepository.GetAllAsync(ua => ua.UserId == userId);

            // Получаем список ID избранных статей
            var articleIds = userArticles.Select(ua => ua.ArticleId).ToList();

            // Получаем статьи по списку ID
            var articles = await _articleRepository.GetAllAsync(
                filter: a => articleIds.Contains(a.ArticleId),
                includeProperties: "Comments,Likes,User",
                pageSize: pageSize,
                pageNumber: pageNumber
            );

            // Преобразуем каждую статью в DTO и добавляем в список
            var articlesDTOs = articles.Select(a => _mapper.Map<ArticlesDTO>(a)).ToList();
            foreach (var article in articlesDTOs)
            {
                var like = await _likeRepository.GetAsync(l => l.UserId == userId && l.ArticleId == article.ArticleId);
                if (like != null)
                {
                    article.UserLiked = true;
                }
            }

            return Ok(articlesDTOs);

        }
        
        [HttpPost]
        [Route("comment/{articleId}")]
        public async Task<IActionResult> AddComment(int articleId, [FromForm] CommentCreateEditDTO comment)
        {
            // Получаем текущего пользователя
            var userId = int.Parse(User.FindFirst("userId").Value);

            // Проверяем, существует ли статья с указанным articleId
            var article = await _articleRepository.GetAsync(a => a.ArticleId == articleId);
            if (article == null)
            {
                return NotFound("Статья не найдена");
            }
            
            // Создаем новый объект Like
            var newComment = new Comment
            {
                UserId = userId,
                ArticleId = articleId,
                Content = comment.Content
            };
            // Добавляем лайк в базу данных
            _commentRepository.CreateAsync(newComment);
            
            return Ok("Комментарий успешно добавлен");
        }
        [HttpDelete]
        [Route("сomment/{commentId}")]
        public async Task<IActionResult> DeleteComment(int commentId)
        {
            // Получаем текущего пользователя
            var userId = int.Parse(User.FindFirst("userId").Value);
            var comment = await _commentRepository.GetAsync(c => c.CommentId == commentId && c.UserId == userId);
            if (comment == null)
            {
                return NotFound("Комментарий не найден");
            }
            await _commentRepository.RemoveAsync(comment);
            
            return Ok("Комментарий успешно удален");
        }
        
        [HttpPost]
        [Route("like/{articleId}")]
        public async Task<IActionResult> AddLike(int articleId)
        {
            // Получаем текущего пользователя
            var userId = int.Parse(User.FindFirst("userId").Value);

            // Проверяем, существует ли статья с указанным articleId
            var article = await _articleRepository.GetAsync(a => a.ArticleId == articleId);
            if (article == null)
            {
                return NotFound("Статья не найдена");
            }

            // Проверяем, существует ли лайк от этого пользователя для этой статьи
            var existingLike = await _likeRepository.GetAsync(l => l.UserId == userId && l.ArticleId == articleId);
            if (existingLike != null)
            {
                // Если лайк уже существует, удаляем его
                _likeRepository.RemoveAsync(existingLike);
                return Ok("Лайк успешно удален");
            }

            // Создаем новый объект Like
            var like = new Like
            {
                UserId = userId,
                ArticleId = articleId
            };

            // Добавляем лайк в базу данных
            _likeRepository.CreateAsync(like);
            
            return Ok("Лайк успешно добавлен");
        }

        // GET: api/article/{id}
        
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticle(int id)
        {
            var article = await _articleRepository.GetAsync(
                filter: a => a.ArticleId == id,
                includeProperties: "Comments.User,Likes,User"
            );
            if (article == null)
            {
                return NotFound();
            }
            var newArticle = _mapper.Map<ArticleDTO>(article);
            newArticle.LikeCount = article.Likes.Count;
            newArticle.CommentCount = article.Comments.Count;
            var userId = int.Parse(User.FindFirst("userId").Value);
            var user = await _userRepository.GetUserAsync(userId);
            var like = await _likeRepository.GetAsync(l => l.UserId == userId && l.ArticleId == article.ArticleId);
            if (like != null)
            {
                newArticle.UserLiked = true;
            }
            return Ok(newArticle);
        }

        // POST: api/article
        [HttpPost]
        public async Task<IActionResult> CreateArticle([FromForm] ArticleCreateEditDTO article)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newArticle = _mapper.Map<Article>(article);
            newArticle.UserId = int.Parse(User.FindFirst("userId").Value);
            await _articleRepository.CreateAsync(newArticle);
            return CreatedAtAction(nameof(GetArticle), new { id = newArticle.ArticleId }, article);
        }

        // PUT: api/article/{id}
        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateArticle(int id, [FromForm] ArticleCreateEditDTO articleDto)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var existingArticle = await _articleRepository.GetAsync(a => a.ArticleId == id);
            if (existingArticle == null)
            {
                return NotFound();
            }

            try
            {
                existingArticle.Title = articleDto.Title;
                existingArticle.Content = articleDto.Content;

                await _articleRepository.UpdateAsync(existingArticle);

                return Ok("Статья успешно обновлена");
            }
            catch (Exception ex)
            {
                // Log the exception for further investigation
                return StatusCode(500, "Internal server error");
            }
        }

        // DELETE: api/article/{id}
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
