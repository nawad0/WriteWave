import React from 'react';
import { Avatar, Button, IconButton } from '@mui/material'; // Импорт компонентов Material-UI
import FavoriteIcon from '@mui/icons-material/Favorite'; // Импорт иконки лайка из Material-UI
import CommentIcon from '@mui/icons-material/Comment'; // Импорт иконки комментария из Material-UI
import BookmarkIcon from '@mui/icons-material/Bookmark'; // Импорт иконки добавления в избранное из Material-UI
import classes from './ArticleCard.module.css';
import { useNavigate } from 'react-router-dom';
const ArticleCard = ({articleImages, article, type, handleViewArticle, handleLike, handleFavorite, handleSubscribe, handleUpdateArticle, handlePublishArticle, handleDeleteArticle, getUserInitials, userId }) => {
   const navigate = useNavigate(); 
    const truncateText = (text, maxLength) => {
        // Удаляем HTML-теги из текста
        const withoutHtml = text.replace(/<[^>]*>/g, '');

        if (withoutHtml.length > maxLength) {
            return withoutHtml.slice(0, maxLength) + '...';
        }
        return withoutHtml + "...";
    };

    const extractImage = (content) => {
        const match = content.match(/<img [^>]*src='"[^>]*>/);
        return match ? match[1] : null;
    };
    const getTimeDifferenceString = (publicationDate) => {
        const currentDate = new Date();
        const publishedDate = new Date(publicationDate);
        const differenceInSeconds = Math.floor((currentDate - publishedDate) / 1000);

        if (differenceInSeconds < 60) {
            return 'Только что';
        } else if (differenceInSeconds < 3600) {
            const minutes = Math.floor(differenceInSeconds / 60);
            return `${minutes} ${minutes === 1 ? 'минуту' : minutes < 5 ? 'минуты' : 'минут'} назад`;
        } else if (differenceInSeconds < 86400) {
            const hours = Math.floor(differenceInSeconds / 3600);
            return `${hours} ${hours === 1 ? 'час' : hours < 5 ? 'часа' : 'часов'} назад`;
        } else {
            const days = Math.floor(differenceInSeconds / 86400);
            return `${days} ${days === 1 ? 'день' : days < 5 ? 'дня' : 'дней'} назад`;
        }
    };
    const handleViewUser = (userId) => {
        navigate(`/profile/${userId}`);
    };

    const timeString = getTimeDifferenceString(article.publicationDate);
    return (
        <div className={classes.card}>
            <div className={classes.user}>
                {article.userImage ? (
                    <Avatar sx={{ width: 56, height: 56 }} src={`${window.minioUrl}/writewave/` + article.userImage} alt="User Avatar" />
                ) : (
                    <Avatar  sx={{ width: 56, height: 56 }} sx={{ bgcolor: 'red' }}>{getUserInitials(article.username)}</Avatar>
                )}
                <h3 className={classes.username} onClick={() => handleViewUser(article.userId)}>
                    {article.username}
                </h3>
                {userId != article.userId && type === 'first' && (
                    <button className={article.userSubscribed ? classes.subscribed : classes.subscribe}
                            onClick={() => handleSubscribe(article.articleId, article.userId)}>
                        {article.userSubscribed ? 'Отписаться' : 'Подписаться'}
                    </button>
                )}
            </div>
            <div className={classes.image__container} onClick={() => handleViewArticle(article.articleId)}>
                <div className={classes.title__container}>
                    <h2>{article.title}</h2>
                </div>
                {/* Извлекаем изображение из контента */}
                {articleImages[article.articleId] ? (
                    <img src={articleImages[article.articleId]} alt="Article" className={classes.articleImage} />
                ) : extractImage(article.content)}
                {/* Используем truncateText для корректного отображения контента */}
                <div className={classes.image} dangerouslySetInnerHTML={{ __html: truncateText(article.content, 240) }} />
            </div>
            <div className={classes.dop}>
                <div className={classes.card__buttons}>
                    <IconButton onClick={() => handleLike(article.articleId)}>
                        {article.userLiked ? <FavoriteIcon style={{ color: 'purple', fontSize: '28px' }} /> : <FavoriteIcon style={{  fontSize: '28px' }} />}
                    </IconButton>
                    <IconButton onClick={() => handleViewArticle(article.articleId)}>
                        <CommentIcon style={{  fontSize: '28px' }} />
                    </IconButton>
                    <IconButton onClick={() => handleFavorite(article.articleId)}>
                        {article.userFavorited ? <BookmarkIcon style={{ color: 'purple' ,fontSize: '28px'  }} /> : <BookmarkIcon style={{  fontSize: '28px' }} />}
                    </IconButton>
                </div>
                <p>Нравится: {article.likeCount}</p>
                <p onClick={() => handleViewArticle(article.articleId)}>Смотреть комментарии ({article.commentCount})</p>

                <p>{timeString}</p>

            </div>
        </div>
    );
};

export default ArticleCard;
