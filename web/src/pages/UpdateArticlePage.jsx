import React, {useEffect, useState} from 'react';
import { useParams } from 'react-router-dom';
import UpdateArticleForm from '../components/UpdateArticleForm';

const CreateArticlePage = () => {
    const { articleId } = useParams();
    const [article, setArticle] = useState({});
    useEffect(() => {
        fetch(`http://localhost:5177/api/article/${articleId}?commentPageSize=0&commentPageNumber=0`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => setArticle(data))
            .catch(error => console.error('Error fetching article:', error));
        
    }, [articleId]);
    
    const handleUpdateArticle = (newArticle, articleId) => {
        fetch(`http://localhost:5177/api/article/${articleId}`, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json' 
            },
            body: JSON.stringify(newArticle)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update article');
                }
            })
            .catch(error => console.error('Ошибка обновления статьи:', error));
    };
    

    return (
        <div>
            <h1>Update Article</h1>
            <UpdateArticleForm onUpdate={handleUpdateArticle} article = {article} /> 
        </div>
    );
};

export default CreateArticlePage;
