using AutoMapper;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Domain.Models;
using WriteWave.Persistence.DTOs;

namespace WriteWave.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ArticleController : ControllerBase
    {
        private readonly IRepository<Article> _articleRepository;
        private readonly IMapper _mapper;
        
        public ArticleController(IRepository<Article> articleRepository, IMapper mapper)
        {
            _articleRepository = articleRepository;
            _mapper = mapper;
        }

        // GET: api/article
        [HttpGet]
        [Authorize]
        public async Task<IActionResult> GetArticles(int pageSize = 0, int pageNumber = 0)
        {
            var articles = await _articleRepository.GetAllAsync(
                includeProperties: "Comments,Likes",
                pageSize: pageSize,
                pageNumber: pageNumber
            );

            var articleDTOs = new List<ArticleDTO>();

            foreach(var article in articles)
            {
                var articleDTO = _mapper.Map<ArticleDTO>(article);
                articleDTO.LikeCount = article.Likes.Count;
                articleDTO.CommentCount = article.Comments.Count;
                articleDTOs.Add(articleDTO);
            }

            var art = await _articleRepository.GetAllAsync();
            var totalCount = art.Count();

            var response = new
            {
                TotalCount = totalCount,
                PageNumber = pageNumber,
                Articles = articleDTOs
            };

            return Ok(response);
        }




        // GET: api/article/{id}
        [Authorize(Roles = "Admin")]
        [HttpGet("{id}")]
        public async Task<IActionResult> GetArticle(int id)
        {
            var article = await _articleRepository.GetAsync(
                filter: a => a.ArticleId == id,
                includeProperties: "Comments,Likes"
            );
            var newArticle = _mapper.Map<ArticleDTO>(article);
            newArticle.LikeCount = article.Likes.Count;
            newArticle.CommentCount = article.Comments.Count;
            if (article == null)
            {
                return NotFound();
            }
            return Ok(newArticle);
        }

        // POST: api/article
        [HttpPost]
        public async Task<IActionResult> CreateArticle([FromBody] ArticleDTO article)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            var newArticle = _mapper.Map<Article>(article);
            newArticle.UserId = 1;
            await _articleRepository.CreateAsync(newArticle);
            return CreatedAtAction(nameof(GetArticle), new { id = article.ArticleId }, article);
        }

        // PUT: api/article/{id}
        // [HttpPut("{id}")]
        // public async Task<IActionResult> UpdateArticle(int id, [FromBody] Article article)
        // {
        //     if (id != article.ArticleId)
        //     {
        //         return BadRequest();
        //     }
        //     if (!ModelState.IsValid)
        //     {
        //         return BadRequest(ModelState);
        //     }
        //     try
        //     {
        //         await _articleRepository.UpdateAsync(article);
        //     }
        //     catch
        //     {
        //         return NotFound();
        //     }
        //     return NoContent();
        // }

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
