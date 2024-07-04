using System.Dynamic;
using System.Linq.Expressions;
using System.Net;
using System.Security.Claims;
using Xunit;
using Moq;
using System.Threading.Tasks;
using AutoFixture;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using NuGet.Protocol;
using WriteWave.Api.Controllers;
using WriteWave.Application.Minio;
using WriteWave.Domain.Interfaces.Repositories;
using WriteWave.Domain.Models;
using WriteWave.Infrastructure.Minio;
using WriteWave.Persistence.DTOs;
using WriteWave.Persistence.Mappings;
using JsonSerializer = System.Text.Json.JsonSerializer;

public class ArticleControllerTests
{
    private readonly Mock<IArticleRepository> _articleRepository;
    private readonly Mock<IUserRepository> _userRepository;
    private readonly ArticleController _controller;
    private readonly Mock<IRepository<Like>> _likeRepository;
    private readonly Mock<IRepository<UserArticle>> _userArticleRepository;
    private readonly Mock<IRepository<Comment>> _commentRepository;
    private readonly IMapper _mapper;
    private readonly Fixture _fixture;
    private readonly MinioService _minioService;
    private readonly Mock<ISubscriptionRepository> _subscriptionRepository;

    public ArticleControllerTests()
    {
        _articleRepository = new Mock<IArticleRepository>();
        _userRepository = new Mock<IUserRepository>();
        _fixture = new Fixture();
        _likeRepository = new Mock<IRepository<Like>>();
        _userArticleRepository = new Mock<IRepository<UserArticle>>();
        _commentRepository = new Mock<IRepository<Comment>>();
        _subscriptionRepository = new Mock<ISubscriptionRepository>();
        _mapper = new Mapper(new MapperConfiguration(cfg => cfg.AddProfile<MappingProfile>()));
        _controller = new ArticleController(_articleRepository.Object, _mapper,
            _userRepository.Object,
            _likeRepository.Object, _commentRepository.Object,
            _userArticleRepository.Object, _minioService, _subscriptionRepository.Object);
        

        
        var user = new ClaimsPrincipal(new ClaimsIdentity(new Claim[]
        {
            new Claim("userId", "1")
        }, "mock"));

        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext { User = user }
        };    }

     [Fact]
    public async Task AddFavorite_ArticleNotFound_ReturnsNotFound()
    {
        // Arrange
        _articleRepository.Setup(repo => repo.GetAsync(It.IsAny<Expression<Func<Article, bool>>>(), It.IsAny<bool>(), It.IsAny<string>()))
                              .ReturnsAsync((Article)null);

        // Act
        var result = await _controller.AddFavorite(1);

        // Assert
        var notFoundResult = Assert.IsType<NotFoundObjectResult>(result);
        Assert.Equal("Статья не найдена", notFoundResult.Value);
    }
    public class FavoriteResponse
    {
        public bool userFavorited { get; set; }
    }
    [Fact]
    public async Task AddFavorite_ArticleAlreadyFavorited_RemovesFavorite()
    {
        // Arrange
        var article = new Article { ArticleId = 1 };
        var userArticle = new UserArticle { UserId = 1, ArticleId = 1 };

        _articleRepository.Setup(repo => repo.GetAsync(It.IsAny<Expression<Func<Article, bool>>>(), It.IsAny<bool>(), It.IsAny<string>()))
            .ReturnsAsync(article);
        _userArticleRepository.Setup(repo => repo.GetAsync(It.IsAny<Expression<Func<UserArticle, bool>>>(), It.IsAny<bool>(), It.IsAny<string>()))
            .ReturnsAsync(userArticle);

        // Act
        var result = await _controller.AddFavorite(1);

        // Assert
        var okResult = result as OkObjectResult;
        // var favoriteResult = JsonSerializer.Deserialize<FavoriteResult>(okResult.Value.ToJson());э
        dynamic favoriteResult = JsonConvert.DeserializeObject<ExpandoObject>(JsonConvert.SerializeObject(okResult.Value));
        
        Assert.Equal(false, favoriteResult.userFavorited);
        _userArticleRepository.Verify(repo => repo.RemoveAsync(userArticle), Times.Once);
    }

    [Fact]
    public async Task AddFavorite_ArticleNotFavorited_AddsFavorite()
    {
        // Arrange
        var article = new Article { ArticleId = 1 };

        _articleRepository.Setup(repo => repo.GetAsync(It.IsAny<Expression<Func<Article, bool>>>(), It.IsAny<bool>(), It.IsAny<string>()))
                              .ReturnsAsync(article);
        _userArticleRepository.Setup(repo => repo.GetAsync(It.IsAny<Expression<Func<UserArticle, bool>>>(), It.IsAny<bool>(), It.IsAny<string>()))
                                  .ReturnsAsync((UserArticle)null);

        // Act
        var result = await _controller.AddFavorite(1);

        // Assert
        var okResult = result as OkObjectResult;
        var favoriteResult = JsonSerializer.Deserialize<FavoriteResult>(okResult.Value.ToJson());
       
        Assert.Equal(true, favoriteResult.userFavorited);
        _userArticleRepository.Verify(repo => repo.CreateAsync(It.IsAny<UserArticle>()), Times.Once);
    }
    [Fact]
    public async Task SubscribeToUser_UserNotFound_ReturnsNotFound()
    {
        var targetUserId = 2;
        var result = await _controller.SubscribeToUser(targetUserId);
        var notFound = result as NotFoundObjectResult;
    
        dynamic notFoundResult = JsonConvert.DeserializeObject<ExpandoObject>(JsonConvert.SerializeObject(notFound.Value));
        Assert.Equal("User not found", notFoundResult.Message);
    }
    
    [Fact]
    public async Task SubscribeToUser_UserAlreadySubscribed_ReturnsOkWithUserSubscribedFalse()
    {
        // Arrange
        var targetUserId = 2;
        var subscriberUserId = 1;

        var targetUser = new User { UserId = targetUserId };
        var subscriberUser = new User { UserId = subscriberUserId };

        var userClaims = new List<Claim>
        {
            new Claim("userId", subscriberUserId.ToString())
        };

        var identity = new ClaimsIdentity(userClaims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        // Имитация HttpContext и ClaimsPrincipal
        var httpContext = new DefaultHttpContext
        {
            User = claimsPrincipal
        };
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        // Настройка репозитория пользователей
        _userRepository.Setup(repo => repo.GetUserAsync(targetUserId))
            .ReturnsAsync(targetUser);

        // Настройка репозитория подписок
        _subscriptionRepository.Setup(repo => repo.GetSubscriptionAsync(subscriberUserId, targetUserId))
            .ReturnsAsync(new Subscription { SubscriberUserId = subscriberUserId, TargetUserId = targetUserId });

        // Act
        var result = await _controller.SubscribeToUser(targetUserId);

        // Assert
        var okResult = result as OkObjectResult;
        Assert.NotNull(okResult);

        dynamic json = JsonConvert.DeserializeObject<ExpandoObject>(JsonConvert.SerializeObject(okResult.Value));
        Assert.Equal(false, json.UserSubscribed);
    }
    [Fact]
    public async Task SubscribeToUser_UserNotSubscribed_ReturnsOkWithUserSubscribedTrue()
    {
        // Arrange
        var targetUserId = 2;
        var subscriberUserId = 1;

        var targetUser = new User { UserId = targetUserId };
        var subscriberUser = new User { UserId = subscriberUserId };

        var userClaims = new List<Claim>
        {
            new Claim("userId", subscriberUserId.ToString())
        };

        var identity = new ClaimsIdentity(userClaims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        // Имитация HttpContext и ClaimsPrincipal
        var httpContext = new DefaultHttpContext
        {
            User = claimsPrincipal
        };
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        // Настройка репозитория пользователей
        _userRepository.Setup(repo => repo.GetUserAsync(targetUserId))
            .ReturnsAsync(targetUser);
        

        // Act
        var result = await _controller.SubscribeToUser(targetUserId);

        // Assert
        var okResult = result as OkObjectResult;
        Assert.NotNull(okResult);

        dynamic json = JsonConvert.DeserializeObject<ExpandoObject>(JsonConvert.SerializeObject(okResult.Value));
        Assert.Equal(true, json.UserSubscribed);
    }
    
    [Fact]
    public async Task GetArticles_UserNotSubscribed_ReturnsOkWithUserSubscribedFalse()
    {
        // Arrange
        var targetUserId = 2;
        var subscriberUserId = 1;
        var userClaims = new List<Claim>
        {
            new Claim("userId", subscriberUserId.ToString())
        };

        var identity = new ClaimsIdentity(userClaims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext
        {
            User = claimsPrincipal
        };
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        var articles = new List<Article>
        {
            new Article
            {
                ArticleId = 1,
                UserId = targetUserId,
                Title = "Test Article",
                Content = "This is a test article."
            }
        };

        _articleRepository.Setup(repo => repo.GetAllAsync(
            It.IsAny<Expression<Func<Article, bool>>>(), 
            It.IsAny<string>(), 
            It.IsAny<int>(),
            It.IsAny<int>()
        )).ReturnsAsync(articles);

        _subscriptionRepository.Setup(repo => repo.GetAsync(
            It.Is<Expression<Func<Subscription, bool>>>(expr => expr.Compile().Invoke(
                new Subscription { SubscriberUserId = subscriberUserId, TargetUserId = targetUserId }
            )),
            It.IsAny<bool>(),
            It.IsAny<string>()
        )).ReturnsAsync((Subscription)null);

        _userArticleRepository.Setup(repo => repo.GetAllAsync(
            ua => ua.UserId == subscriberUserId, 
            It.IsAny<string>(), 
            It.IsAny<int>(), 
            It.IsAny<int>()
        )).ReturnsAsync(new List<UserArticle>());

        _userRepository.Setup(repo => repo.GetAsync(
            It.IsAny<Expression<Func<User, bool>>>(), 
            It.IsAny<bool>(), 
            "FavoritedArticles"
        )).ReturnsAsync(new User { UserId = subscriberUserId, FavoritedArticles = new List<UserArticle>() });

        var _mapperMock = new Mock<IMapper>();
        _mapperMock.Setup(m => m.Map<ArticlesDTO>(It.IsAny<Article>())).Returns(new ArticlesDTO());

        // Act
        var result = await _controller.GetArticles();

        // Assert
        var okResult = result as OkObjectResult;
        Assert.NotNull(okResult);

        dynamic json = JsonConvert.DeserializeObject<ExpandoObject>(JsonConvert.SerializeObject(okResult.Value));
        var articlesResult = json.Articles as List<dynamic>;

        Assert.Single(articlesResult);
        Assert.Equal(false, articlesResult[0].UserSubscribed);
    }

    [Fact]
    public async Task GetArticles_UserSubscribed_ReturnsOkWithUserSubscribedTrue()
    {
        // Arrange
        var targetUserId = 2;
        var subscriberUserId = 1;
        var userClaims = new List<Claim>
        {
            new Claim("userId", subscriberUserId.ToString())
        };

        var identity = new ClaimsIdentity(userClaims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext
        {
            User = claimsPrincipal
        };
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        var articles = new List<Article>
        {
            new Article
            {
                ArticleId = 1,
                UserId = targetUserId,
                Title = "Test Article",
                Content = "This is a test article."
            }
        };

        _articleRepository.Setup(repo => repo.GetAllAsync(
            It.IsAny<Expression<Func<Article, bool>>>(), 
            It.IsAny<string>(), 
            It.IsAny<int>(),
            It.IsAny<int>()
        )).ReturnsAsync(articles);

        _subscriptionRepository.Setup(repo => repo.GetAsync(
            It.Is<Expression<Func<Subscription, bool>>>(expr => expr.Compile().Invoke(
                new Subscription { SubscriberUserId = subscriberUserId, TargetUserId = targetUserId }
            )),
            It.IsAny<bool>(),
            It.IsAny<string>()
        )).ReturnsAsync(new Subscription { SubscriberUserId = subscriberUserId, TargetUserId = targetUserId });

        _userArticleRepository.Setup(repo => repo.GetAllAsync(
            ua => ua.UserId == subscriberUserId, 
            It.IsAny<string>(), 
            It.IsAny<int>(), 
            It.IsAny<int>()
        )).ReturnsAsync(new List<UserArticle>());

        _userRepository.Setup(repo => repo.GetAsync(
            It.IsAny<Expression<Func<User, bool>>>(), 
            It.IsAny<bool>(), 
            "FavoritedArticles"
        )).ReturnsAsync(new User { UserId = subscriberUserId, FavoritedArticles = new List<UserArticle>() });

        var _mapperMock = new Mock<IMapper>();
        _mapperMock.Setup(m => m.Map<ArticlesDTO>(It.IsAny<Article>())).Returns(new ArticlesDTO());

        // Act
        var result = await _controller.GetArticles();

        // Assert
        var okResult = result as OkObjectResult;
        Assert.NotNull(okResult);

        dynamic json = JsonConvert.DeserializeObject<ExpandoObject>(JsonConvert.SerializeObject(okResult.Value));
        var articlesResult = json.Articles as List<dynamic>;

        Assert.Single(articlesResult);
        Assert.Equal(true, articlesResult[0].UserSubscribed);
    }

    [Fact]
    public async Task GetArticles_UserLiked_ReturnsOkWithUserLikedTrue()
    {
        // Arrange
        var targetUserId = 2;
        var subscriberUserId = 1;
        var userClaims = new List<Claim>
        {
            new Claim("userId", subscriberUserId.ToString())
        };

        var identity = new ClaimsIdentity(userClaims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext
        {
            User = claimsPrincipal
        };
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        var articles = new List<Article>
        {
            new Article
            {
                ArticleId = 1,
                UserId = targetUserId,
                Title = "Test Article",
                Content = "This is a test article."
            }
        };

        _articleRepository.Setup(repo => repo.GetAllAsync(
            It.IsAny<Expression<Func<Article, bool>>>(), 
            It.IsAny<string>(), 
            It.IsAny<int>(),
            It.IsAny<int>()
        )).ReturnsAsync(articles);

        _likeRepository.Setup(repo => repo.GetAsync(
            It.Is<Expression<Func<Like, bool>>>(expr => expr.Compile().Invoke(
                new Like { UserId = subscriberUserId, ArticleId = 1 }
            )),
            It.IsAny<bool>(),
            It.IsAny<string>()
        )).ReturnsAsync(new Like { UserId = subscriberUserId, ArticleId = 1 });

        _userArticleRepository.Setup(repo => repo.GetAllAsync(
            ua => ua.UserId == subscriberUserId, 
            It.IsAny<string>(), 
            It.IsAny<int>(), 
            It.IsAny<int>()
        )).ReturnsAsync(new List<UserArticle>());

        _userRepository.Setup(repo => repo.GetAsync(
            It.IsAny<Expression<Func<User, bool>>>(), 
            It.IsAny<bool>(), 
            "FavoritedArticles"
        )).ReturnsAsync(new User { UserId = subscriberUserId, FavoritedArticles = new List<UserArticle>() });

        var _mapperMock = new Mock<IMapper>();
        _mapperMock.Setup(m => m.Map<ArticlesDTO>(It.IsAny<Article>())).Returns(new ArticlesDTO());

        // Act
        var result = await _controller.GetArticles();

        // Assert
        var okResult = result as OkObjectResult;
        Assert.NotNull(okResult);

        dynamic json = JsonConvert.DeserializeObject<ExpandoObject>(JsonConvert.SerializeObject(okResult.Value));
        var articlesResult = json.Articles as List<dynamic>;

        Assert.Single(articlesResult);
        Assert.Equal(true, articlesResult[0].UserLiked);
        
    }


    [Fact]
    public async Task GetArticles_UserFavorited_ReturnsOkWithUserFavoritedTrue()
    {
        // Arrange
        var targetUserId = 2;
        var subscriberUserId = 1;
        var userClaims = new List<Claim>
        {
            new Claim("userId", subscriberUserId.ToString())
        };

        var identity = new ClaimsIdentity(userClaims, "TestAuthType");
        var claimsPrincipal = new ClaimsPrincipal(identity);

        var httpContext = new DefaultHttpContext
        {
            User = claimsPrincipal
        };
        _controller.ControllerContext = new ControllerContext
        {
            HttpContext = httpContext
        };

        var articles = new List<Article>
        {
            new Article
            {
                ArticleId = 1,
                UserId = targetUserId,
                Title = "Test Article",
                Content = "This is a test article."
            }
        };

        _articleRepository.Setup(repo => repo.GetAllAsync(
            It.IsAny<Expression<Func<Article, bool>>>(), 
            It.IsAny<string>(), 
            It.IsAny<int>(),
            It.IsAny<int>()
        )).ReturnsAsync(articles);

        _subscriptionRepository.Setup(repo => repo.GetAsync(
            It.IsAny<Expression<Func<Subscription, bool>>>(),
            It.IsAny<bool>(),
            It.IsAny<string>()
        )).ReturnsAsync((Subscription)null);

        _userArticleRepository.Setup(repo => repo.GetAllAsync(
            ua => ua.UserId == subscriberUserId, 
            It.IsAny<string>(), 
            It.IsAny<int>(), 
            It.IsAny<int>()
        )).ReturnsAsync(new List<UserArticle>
        {
            new UserArticle { UserId = subscriberUserId, ArticleId = 1 }
        });

        _userRepository.Setup(repo => repo.GetAsync(
            It.IsAny<Expression<Func<User, bool>>>(), 
            It.IsAny<bool>(), 
            "FavoritedArticles"
        )).ReturnsAsync(new User { UserId = subscriberUserId, FavoritedArticles = new List<UserArticle> 
        { 
            new UserArticle { UserId = subscriberUserId, ArticleId = 1 } 
        }});

        var _mapperMock = new Mock<IMapper>();
        _mapperMock.Setup(m => m.Map<ArticlesDTO>(It.IsAny<Article>())).Returns(new ArticlesDTO
        {
            UserFavorited = true
        });

        // Act
        var result = await _controller.GetArticles();

        // Assert
        var okResult = result as OkObjectResult;
        Assert.NotNull(okResult);

        dynamic json = JsonConvert.DeserializeObject<ExpandoObject>(JsonConvert.SerializeObject(okResult.Value));
        var articlesResult = json.Articles as List<dynamic>;

        Assert.Single(articlesResult);
        Assert.Equal(true, articlesResult[0].UserFavorited);
    }
    
    // [HttpGet("published")]
    // public async Task<IActionResult> GetPublishedArticles([FromQuery] string? search, string? orderBy, int pageSize = 0, int pageNumber = 1)
    // {
    //     var publishedArticles = await _articleRepository.GetArticlesAsync(
    //         filter: a => a.Status == ArticleStatus.Published,
    //         includeProperties: "Comments,Likes,User",
    //         orderBy: orderBy,
    //         pageSize: pageSize,
    //         pageNumber: pageNumber
    //     );
    //
    //     var totalCount = await _articleRepository.CountAsync(a => a.Status == ArticleStatus.Published);
    //
    //     var articlesDTOs = await ProcessArticles(publishedArticles, int.Parse(User.FindFirst("userId").Value), search);
    //
    //     var response = new
    //     {
    //         TotalCount = totalCount,
    //         PageNumber = pageNumber,
    //         Articles = articlesDTOs
    //     };
    //
    //     return Ok(response);
    // }
    [Fact]
    public async Task GetPublishedArticles_ReturnsOk()
    {
        // Arrange
        var articles = new List<Article>
        {
            new Article
            {
                ArticleId = 1,
                UserId = 1,
                Title = "Test Article",
                Content = "This is a test article."
            }
        };

        _articleRepository.Setup(repo => repo.GetArticlesAsync(
            It.IsAny<Expression<Func<Article, bool>>>(),
            It.IsAny<string>(),
            It.IsAny<int>(),
            It.IsAny<int>(),
            It.IsAny<string>()
        )).ReturnsAsync(articles);
        

        // Act
        var result = await _controller.GetPublishedArticles( It.IsAny<string>(), It.IsAny<string>(), It.IsAny<int>(), It.IsAny<int>());

        // Assert
        var okResult = result as OkObjectResult;
        Assert.NotNull(okResult);

        dynamic json = JsonConvert.DeserializeObject<ExpandoObject>(JsonConvert.SerializeObject(okResult.Value));
        var articlesResult = json.Articles as List<dynamic>;

        Assert.Single(articlesResult);
        Assert.Equal(1, articlesResult[0].ArticleId);
        Assert.Equal("Test Article", articlesResult[0].Title);
        Assert.Equal("This is a test article.", articlesResult[0].Content);
    }


}
public class FavoriteResult
{
    public bool userFavorited { get; set; }
}
