import React, { useState } from 'react';
import classes from './CommentForm.module.css';

const CommentForm = ({ articleId, parentId, connection, clearReply }) => {
	const [content, setContent] = useState('');

	const handleSubmit = (event) => {
		event.preventDefault();
		clearReply && clearReply();
		if (connection) {
			
			connection.invoke('AddComment', articleId, content, parentId)
				.then(() => {
					setContent('');
				})
				.catch(error => console.error('Ошибка добавления комментария через SignalR:', error));
		}
	};

	return (
		<form className={classes.form} onSubmit={handleSubmit}>
            <textarea
				className={classes.textarea}
				value={content}
				onChange={(e) => setContent(e.target.value)}
				placeholder="Оставьте свой комментарий здесь"
				rows="4"
				cols="50"
				required
			/>
			<br />
			<button className={classes.btn__append} type="submit">
				{parentId ? 'Ответить' : 'Добавить комментарий'}
			</button>
			{clearReply && (
				<button type="button" onClick={clearReply}>Отмена</button>
			)}
		</form>
	);
};

export default CommentForm;
