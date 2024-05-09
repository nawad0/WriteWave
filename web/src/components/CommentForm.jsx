import React, { useState } from 'react';
import classes from './CommentForm.module.css';

const CommentForm = ({ articleId, handleAddComment}) => {
	const [content, setContent] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		// Отправка данных на сервер
		fetch(`http://localhost:5177/api/article/comment/${articleId}`, {
			method: 'POST',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json', // Правильное название заголовка
			},
			body: JSON.stringify({ content }),
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to add comment');
				}
				handleAddComment();
				// Опционально: обновить состояние страницы после успешного добавления комментария
				setContent('');
			})
			.catch((error) => console.error('Ошибка добавления комментария:', error));
	};

	return (
		<form className={classes.form} onSubmit={handleSubmit}>
			<textarea className={classes.textarea} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Оставьте свой комментарий здесь" rows="4" cols="50" required />
			<br />
			<button className={classes.btn__append} type="submit">
				Добавить комментарий
			</button>
		</form>
	);
};

export default CommentForm;
