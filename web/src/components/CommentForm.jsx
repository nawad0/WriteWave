import React, { useState } from 'react';

const CommentForm = ({ articleId, setCommectSuccess}) => {
    const [content, setContent] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();
        // Отправка данных на сервер
        fetch(`http://localhost:5177/api/article/comment/${articleId}`, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json' // Правильное название заголовка
            },
            body: JSON.stringify({ content })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add comment');
                }
                setCommectSuccess(true);
                // Опционально: обновить состояние страницы после успешного добавления комментария
                setContent('');
            })
            .catch(error => console.error('Ошибка добавления комментария:', error));
    };


    return (
        <form onSubmit={handleSubmit}>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Enter your comment here"
                rows="4"
                cols="50"
                required
            />
            <br />
            <button type="submit">Add Comment</button>
        </form>
    );
};

export default CommentForm;
