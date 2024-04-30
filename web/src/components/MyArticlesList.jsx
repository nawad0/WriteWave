import React from 'react';
import { useNavigate } from 'react-router-dom';

const MyArticlesList = ({ articles, handleDeleteArticle, handlePublishArticle}) => {
    const navigate = useNavigate();

    const handleViewArticle = (articleId) => {
        navigate(`/article/${articleId}`);
    };

    const handleUpdateArticle = (articleId) => {
        navigate(`/update-article/${articleId}`);
    };
    

    return (
        <div>
            <h2>My Articles</h2>
            <ul>
                {articles.map(article => (
                    <li key={article.articleId}>
                        <h3>{article.title}</h3>
                        <p>{article.content}</p>
                        <p>Author: {article.username}</p>
                        <p>Likes: {article.likeCount}</p>
                        <p>Status: {article.status}</p>
                        <p>Comments: {article.commentCount}</p>
                        <img src={"http://localhost:9000/writewave/" + article.userImage} alt="User Avatar"
                             style={{width: '50px', height: '50px', borderRadius: '50%'}}/>
                        <button onClick={() => handleViewArticle(article.articleId)}>
                            View Article
                        </button>
                        <button onClick={() => handleUpdateArticle(article.articleId)}>
                            Update Article
                        </button>
                        {article.status === 'Unpublished' && (
                            <button onClick={() => handlePublishArticle(article.articleId)}>
                                Publish
                            </button>
                        )}
                        <button onClick={() => handleDeleteArticle(article.articleId)}>
                            Delete Article
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyArticlesList;
