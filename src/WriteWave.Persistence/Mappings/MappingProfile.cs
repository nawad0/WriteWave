using AutoMapper;
using WriteWave.Domain.Models;
using WriteWave.Persistence.DTOs;

namespace WriteWave.Persistence.Mappings;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<User, UserDTO>().ReverseMap();
        CreateMap<ProfileDTO, User>().ReverseMap()
            .ForMember(dest => dest.UserImage , opt => opt.MapFrom(src => src.Image));
        CreateMap<Subscription, SubscriptionDTO>()
            .ForMember(dest => dest.TargetUserId, opt => opt.MapFrom(src => src.TargetUser.UserId))
            .ForMember(dest => dest.UserImage, opt => opt.MapFrom(src => src.TargetUser.Image))
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.TargetUser.Username)).ReverseMap();

        CreateMap<Article, ArticlesDTO>()
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
            .ForMember(dest => dest.UserImage, opt => opt.MapFrom(src => src.User.Image))
            .ForMember(dest => dest.LikeCount, opt => opt.MapFrom(src => src.Likes.Count))
            .ForMember(dest => dest.CommentCount, opt => opt.MapFrom(src => src.Comments.Count));

        // CreateMap<Article, ArticleDTO>()
        //     // .ForMember(dest => dest.LikeCount, opt => opt.MapFrom(src => src.Likes.Count))
        //     // .ForMember(dest => dest.CommentCount, opt => opt.MapFrom(src => src.Comments.Count))
        //     .ReverseMap();
        // 
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
        CreateMap<Article, MyArticleDTO>()
            .ForMember(dest => dest.LikeCount, opt => opt.MapFrom(src => src.Likes.Count))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => Enum.GetName(typeof(ArticleStatus), src.Status)))
            .ForMember(dest => dest.Username, opt => opt.MapFrom(src => src.User.Username))
            .ForMember(dest => dest.UserImage, opt => opt.MapFrom(src => src.User.Image)).ReverseMap();
    

        // Маппинг Subscription на SubscriptionDTO
        

        // Маппинг Like на LikeDTO
        CreateMap<Like, LikeDTO>();

        // Маппинг для создания или редактирования сущностей
        CreateMap<ArticleCreateEditDTO, Article>();
        CreateMap<CommentCreateEditDTO, Comment>();
        CreateMap<SubscriptionCreateEditDTO, Subscription>();
        CreateMap<LikeCreateEditDTO, Like>();
        

    }
}