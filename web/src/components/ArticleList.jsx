import React from 'react';
import { useNavigate } from 'react-router-dom';

const ArticleList = ({ articles, handleLike, handleFavorite, handleSubscribe, userId }) => {
    const navigate = useNavigate();

    const handleViewArticle = (articleId) => {
        navigate(`/article/${articleId}`);
    }; 
    const handleViewUser = (userId) => {
        navigate(`/profile/${userId}`);
    };

    return (
        <div>
            <h1>Published Articles</h1>
            <ul>
                {articles.map(article => (
                    <li key={article.articleId}>
                        <h2>{article.title}</h2>
                        <p>Author: {article.username}</p>
                        <img src={"http://localhost:9000/writewave/" + article.userImage} alt="User Avatar"
                             style={{width: '50px', height: '50px', borderRadius: '50%'}}/>
                        <p>{article.content}</p>
                        <p>Likes: {article.likeCount}</p>
                        <p>Comments: {article.commentCount}</p>
                        <button onClick={() => handleLike(article.articleId)}>
                            {article.userLiked ? 'Liked' : 'Like'}
                        </button>
                        <button onClick={() => handleFavorite(article.articleId)}>
                            {article.userFavorited ? 'Favorited' : 'Favorite'}
                        </button>
                        {userId !== article.userId && (
                            <button onClick={() => handleSubscribe(article.articleId, article.userId)}>
                                {article.userSubscribed ? 'Subscribed' : 'Subscribe'}
                            </button>
                        )}
                        <button onClick={() => handleViewArticle(article.articleId)}>
                            View Article
                        </button>
                        <button onClick={() => handleViewUser(article.userId)}>
                            View User
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};
export default ArticleList;
