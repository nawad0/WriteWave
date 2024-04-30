import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import CommentForm from '../components/CommentForm';
const ArticlePage = () => {
    const { articleId } = useParams();
    const [article, setArticle] = useState(null);
    const [commectSuccess, setCommectSuccess] = useState(false);
    const [userId, setUserId] = useState(0);
    const [pageNumber, setPageNumber] = useState(1); 
    useEffect(() => {
        fetch(`http://localhost:5177/api/article/${articleId}?commentPageSize=3&commentPageNumber=${pageNumber -1}`, { 
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => setArticle(data))
            .catch(error => console.error('Error fetching article:', error));

        fetch(`http://localhost:5177/api/User`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setUserId(data.userId);
            })
            .catch(error => console.error('Error fetching data:', error));
    }, [articleId, pageNumber, commectSuccess]);

    const handleLike = (articleId) => {
        fetch(`http://localhost:5177/api/article/like/${articleId}`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add like');
                }
                return response.json();
            })
            .then(data => {
                
                var like;
                if(data.userLiked == true) {
                    like = article.likeCount + 1;
                }
                else
                {
                    like = article.likeCount -1;
                }
                const updatedArticle = {
                    ...article,
                    userLiked: data.userLiked,
                    likeCount: like
                };
                setArticle(updatedArticle); 
            })
            .catch(error => console.error('Ошибка лайка статьи:', error));
    };

    const handleFavorite = (articleId) => {
        fetch(`http://localhost:5177/api/article/favorite/${articleId}`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add favorite');
                }
                return response.json();
            })
            .then(data => {
                
                const updatedArticle = {
                    ...article,
                    userFavorited: data.userFavorited
                };
                setArticle(updatedArticle);
            })
            .catch(error => console.error('Ошибка добавления статьи в избранное:', error));
    };

    const handleSubscribe = (articleId, userId) => {
        fetch(`http://localhost:5177/api/article/subscribe/${userId}`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to subscribe');
                }
                return response.json();
            })
            .then(data => {
                
                const updatedArticle = {
                    ...article,
                    userSubscribed: data.userSubscribed
                };
                setArticle(updatedArticle);
            })
            .catch(error => console.error('Ошибка подписки на статью:', error));
    };
    const handleDeleteComment = (commentId) => {
        fetch(`http://localhost:5177/api/article/comment/${commentId}`, {
            method: 'DELETE',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json' // Правильное название заголовка
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to delete comment');
                }
                setArticle(prevArticle => {
                    // Создаем новый объект статьи, удаляя удаленный комментарий из списка
                    const updatedComments = prevArticle.comments.filter(comment => comment.commentId !== commentId);
                    return {
                        ...prevArticle,
                        comments: updatedComments
                    };
                });
                
            })
            .catch(error => console.error('Ошибка удаления комментария:', error));
    };

    const handlePageChange = (page) => {
        setPageNumber(page); 
    };
    
    if (!article) {
        return <div>Loading...</div>;
    }

    return (
        <div>
            <h1>{article.title}</h1>
            <p>Author: {article.username}</p>
            <img
                src={article.userImage ? "http://localhost:9000/writewave/" + article.userImage : "Default User Image URL"}
                alt="User Avatar" style={{width: '50px', height: '50px', borderRadius: '50%'}}/>
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

            <h2>Comments</h2>
            <ul>
                {article.comments.map(comment => (
                    <li key={comment.commentId}>
                        <p>Content: {comment.content}</p>
                        <p>Author: {comment.username}</p>
                        <img
                            src={comment.userImage ? "http://localhost:9000/writewave/" + comment.userImage : "Default User Image URL"}
                            alt="Comment Author Avatar" style={{width: '50px', height: '50px', borderRadius: '50%'}}/>
                        {userId === comment.userId && ( // Условное отображение кнопки удаления
                            <button onClick={() => handleDeleteComment(comment.commentId)}>Delete</button>
                        )}
                    </li>
                ))}
            </ul>

            <Pagination pageNumber={pageNumber} totalCount={article.commentCount} onPageChange={handlePageChange}/>
            <CommentForm articleId={articleId} setCommectSuccess={setCommectSuccess}/>
            {/* Форма добавления комментария */}
        </div>
    );
};

export default ArticlePage;
