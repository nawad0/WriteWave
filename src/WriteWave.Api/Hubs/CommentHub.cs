using Microsoft.AspNetCore.SignalR;
using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Domain.Models;
using WriteWave.Persistence.DTOs;
using System.Security.Claims;
using AutoMapper;

namespace WriteWave.Api.Hubs;

 public class ItemHub : Hub
    {
        private readonly IArticleRepository _articleRepository;
        private readonly IRepository<Comment> _commentRepository;
        private readonly ILogger<ItemHub> _logger;
        private readonly IMapper _mapper;
        private readonly IRepository<Like> _likeRepository;

        public ItemHub(IArticleRepository articleRepository, IRepository<Comment> commentRepository, ILogger<ItemHub> logger, IMapper mapper, IRepository<Like> likeRepository)
        {
            _articleRepository = articleRepository;
            _commentRepository = commentRepository;
            _logger = logger;
            _mapper = mapper;
            _likeRepository = likeRepository;
        }
        
        public async Task DeleteComment(int commentId)
        {
            try
            {
                var userIdClaim = Context.User?.FindFirst("userId")?.Value;
                if (string.IsNullOrEmpty(userIdClaim))
                {
                    throw new UnauthorizedAccessException("User is not authenticated.");
                }
                if (!int.TryParse(userIdClaim, out var userId))
                {
                    throw new InvalidOperationException("Invalid user ID.");
                }

                var comment = await _commentRepository.GetAsync(c => c.CommentId == commentId);
                if (comment == null)
                {
                    throw new KeyNotFoundException("Comment not found.");
                }
                if (comment.UserId != userId)
                {
                    throw new UnauthorizedAccessException("User is not authorized to delete this comment.");
                }

                await _commentRepository.RemoveAsync(comment);

                await Clients.Group($"Article-{comment.ArticleId}").SendAsync("CommentDeleted", commentId);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error deleting comment");
                await Clients.Caller.SendAsync("Error", ex.Message);
            }
        }


        public async Task AddComment(int articleId, string content, int? parentId = null)
{
    try
    {
        var userIdClaim = Context.User?.FindFirst("userId")?.Value;

        if (string.IsNullOrEmpty(userIdClaim))
        {
            throw new UnauthorizedAccessException("User is not authenticated.");
        }

        if (!int.TryParse(userIdClaim, out var userId))
        {
            throw new InvalidOperationException("Invalid user ID.");
        }

        var article = await _articleRepository.GetAsync(a => a.ArticleId == articleId);
        if (article == null)
        {
            throw new KeyNotFoundException("Article not found.");
        }

        var comment = new Comment
        {
            UserId = userId,
            ArticleId = articleId,
            Content = content,
            ParentCommentId = parentId
        };
        await _commentRepository.CreateAsync(comment);
        
        // Get the newly added comment with user and replies included
        var newComment = await _commentRepository.GetAsync(c => c.CommentId == comment.CommentId, includeProperties: "User,Replies");
        
        // Map the new comment to DTO
        var commentDto = _mapper.Map<CommentDTO>(newComment);

            await Clients.Group($"Article-{articleId}").SendAsync("Comments", commentDto);
        
    }
    catch (Exception ex)
    {
        _logger.LogError(ex, "Error adding comment");
        await Clients.Caller.SendAsync("Error", ex.Message);
    }
}

        public async Task JoinGroup(string groupName)
        {
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
        }
        public async Task AddLike(int articleId)
        {
            var userIdClaim = Context.User?.FindFirst("userId")?.Value;

            if (string.IsNullOrEmpty(userIdClaim))
            {
                throw new UnauthorizedAccessException("User is not authenticated.");
            }

            if (!int.TryParse(userIdClaim, out var userId))
            {
                throw new InvalidOperationException("Invalid user ID.");
            }
            
            var article = await _articleRepository.GetAsync(a => a.ArticleId == articleId);
            if (article == null)
            {
                await Clients.Caller.SendAsync("Error", "Article not found.");
            }
            
            var existingLike = await _likeRepository.GetAsync(l => l.UserId == userId && l.ArticleId == articleId);
            bool userLike;
            List<Like>? likeCount;
            if (existingLike != null)
            {
                await _likeRepository.RemoveAsync(existingLike);

                userLike = false;
                likeCount = await _likeRepository.GetAllAsync(l => l.ArticleId == articleId);
                await Clients.All.SendAsync("Likes", likeCount.Count, userLike);
            }
            
            var like = new Like
            {
                UserId = userId,
                ArticleId = articleId
            };
            
            await _likeRepository.CreateAsync(like);
            userLike = true;
            likeCount = await _likeRepository.GetAllAsync(l => l.ArticleId == articleId);
            await Clients.All.SendAsync("Likes", likeCount.Count, userLike);
        }
    }
