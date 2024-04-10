using AutoMapper;
using WriteWave.Domain.Models;
using WriteWave.Persistence.DTOs;

namespace WriteWave.Persistence.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Маппинг User на UserDTO
        CreateMap<User, UserDTO>();

        // Маппинг Article на ArticleDTO
        CreateMap<Article, ArticleDTO>()
            // .ForMember(dest => dest.LikeCount, opt => opt.MapFrom(src => src.Likes.Count))
            // .ForMember(dest => dest.CommentCount, opt => opt.MapFrom(src => src.Comments.Count))
            .ReverseMap(); // Здесь требуется дополнительная логика для определения, поставил ли пользователь лайк

        // Маппинг Comment на CommentDTO
        CreateMap<Comment, CommentDTO>();

        // Маппинг Subscription на SubscriptionDTO
        CreateMap<Subscription, SubscriptionDTO>();

        // Маппинг Like на LikeDTO
        CreateMap<Like, LikeDTO>();

        // Маппинг для создания или редактирования сущностей
        CreateMap<ArticleCreateEditDTO, Article>();
        CreateMap<CommentCreateEditDTO, Comment>();
        CreateMap<SubscriptionCreateEditDTO, Subscription>();
        CreateMap<LikeCreateEditDTO, Like>();
        

    }
}