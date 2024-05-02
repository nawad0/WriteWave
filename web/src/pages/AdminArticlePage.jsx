import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import CommentForm from '../components/CommentForm';
import { useNavigate } from 'react-router-dom';
const ArticlePage = () => {
    const { articleId } = useParams();
    const [article, setArticle] = useState(null);
    const [commectSuccess, setCommectSuccess] = useState(false);
    const [userId, setUserId] = useState(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [isAdmin, setIsAdmin] = useState(false);
    const navigate = useNavigate();
    useEffect(() => {
        // Получаем информацию о текущем пользователе, включая его роль
        fetch('http://localhost:5177/Admin/current', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setUserId(data.userId);
                setIsAdmin(data.role === 'Admin');
            })
            .catch(error => console.error('Error fetching user info:', error));
        
    }, []);

    const handlePublishArticle = () => {
        // Отправляем запрос на публикацию статьи, если пользователь администратор
        if (isAdmin) {
            fetch(`http://localhost:5177/api/article/admin/publish/${articleId}`, {
                method: 'PUT',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    userId: userId
                })
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Failed to publish article');
                    }
                    // Обновляем статью после публикации
                    setArticle(prevArticle => ({
                        ...prevArticle,
                        status: 'Published'
                    }));
                    navigate('/admin');
                    
                })
                .catch(error => console.error('Error publishing article:', error));
        }
    };
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
            <p dangerouslySetInnerHTML={{__html: article.content}}/>
            <p>Likes: {article.likeCount}</p>
            <p>Comments: {article.commentCount}</p>
            {isAdmin && article.status !== 'Published' && ( // Условное отображение кнопки "Publish" для администратора
                <button onClick={handlePublishArticle}>Publish</button>
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
        </div>
    );
};

export default ArticlePage;
