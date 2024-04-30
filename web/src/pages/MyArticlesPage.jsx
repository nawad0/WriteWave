import React, { useState, useEffect } from 'react';
import MyArticlesList from '../components/MyArticlesList';
import { useNavigate } from 'react-router-dom';
const MyArticlesPage = () => {
    const [articles, setArticles] = useState([]);
    const [deleteArticle, setDeleteArticle] = useState(false);
    const navigate = useNavigate();
    const handleCreatePage = () => {
        navigate(`/create-article`);
    };

    useEffect(() => {
        fetch('http://localhost:5177/api/article/myArticles?pageSize=0&pageNumber=0', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setArticles(data.articles);
            })
            .catch(error => console.error('Error fetching articles:', error));
    }, [deleteArticle]);
    
    const handlePublishArticle = (articleId) => {
        setDeleteArticle(true)
        fetch(`http://localhost:5177/api/article/updateStatus/${articleId}?articleStatus=1`, {
            method: 'PUT',
            credentials: 'include'
        })
            .then(response => {
                if (response.ok) {
                } else {
                    setDeleteArticle(false)
                    throw new Error('Failed to publish article');
                }
            })
            .catch(error => console.error('Error publishing article:', error));
    };

    const handleDeleteArticle = (articleId) => {
        setDeleteArticle(true);
        fetch(`http://localhost:5177/api/article/${articleId}`, {
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
                setDeleteArticle(false);

            })
            .catch(error => console.error('Ошибка удаления комментария:', error));
    };

    return (
        <div>
            <button onClick={() => handleCreatePage()}>
                Create Article
            </button>
            <h1>My Articles</h1>
            <MyArticlesList handleDeleteArticle={handleDeleteArticle} articles={articles} handlePublishArticle ={handlePublishArticle}/>
        </div>
    );
};

export default MyArticlesPage;
