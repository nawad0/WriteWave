import React from 'react';
import CreateArticleForm from '../components/CreateArticleForm';

const CreateArticlePage = () => {
    
    const handleCreateArticle = (newArticle) => {
        // Отправка данных новой статьи на сервер
        fetch('http://localhost:5177/api/article', {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newArticle)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to create article');
                }
                // Опционально: перенаправление пользователя на страницу со списком статей или другое действие после успешного создания статьи
            })
            .catch(error => console.error('Ошибка создания статьи:', error));
    };

    return (
        <div>
            <h1>Create New Article</h1>
            <CreateArticleForm onCreate={handleCreateArticle} /> {/* Передаем обработчик для создания статьи */}
        </div>
    );
};

export default CreateArticlePage;
