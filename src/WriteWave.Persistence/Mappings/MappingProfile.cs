using AutoMapper;
using WriteWave.Domain.Models;
using WriteWave.Persistence.DTOs;

namespace WriteWave.Persistence.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        // Маппинг User на UserDTO
        CreateMap<User, UserDTO>().ReverseMap();

        // Маппинг Article на ArticleDTO
        // Здесь требуется дополнительная логика для определения, поставил ли пользователь лайк
        CreateMap<Article, ArticlesDTO>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
            .ForMember(dest => dest.UserImage, opt => opt.MapFrom(src => src.User.Image))
            .ForMember(dest => dest.LikeCount, opt => opt.MapFrom(src => src.Likes.Count))
            .ForMember(dest => dest.CommentCount, opt => opt.MapFrom(src => src.Comments.Count));

        // CreateMap<Article, ArticleDTO>()
        //     // .ForMember(dest => dest.LikeCount, opt => opt.MapFrom(src => src.Likes.Count))
        //     // .ForMember(dest => dest.CommentCount, opt => opt.MapFrom(src => src.Comments.Count))
        //     .ReverseMap();
        // // Маппинг Comment на CommentDTO
        // CreateMap<Comment, CommentDTO>()
        //     .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
        //     .ForMember(dest => dest.UserImage, opt => opt.MapFrom(src => src.User.Image)).ReverseMap();
        CreateMap<Comment, CommentDTO>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
            .ForMember(dest => dest.UserImage, opt => opt.MapFrom(src => src.User.Image));

        CreateMap<Article, ArticleDTO>()
            .ForMember(dest => dest.Comments, opt => opt.MapFrom(src => src.Comments))
            .ForMember(dest => dest.LikeCount, opt => opt.MapFrom(src => src.Likes.Count))
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
            .ForMember(dest => dest.UserImage, opt => opt.MapFrom(src => src.User.Image)).ReverseMap();
    

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