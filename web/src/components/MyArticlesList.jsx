import React from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './MyArticlesList.module.css';

// Импортируем функции из другого файла (если они там находятся)
// import { truncateText, extractImage } from './utils'; // Предположим, что функции находятся в файле utils.js

const MyArticlesList = ({ articles, handleDeleteArticle, handlePublishArticle }) => {
	const navigate = useNavigate();

	const handleViewArticle = (articleId) => {
		navigate(`/article/${articleId}`);
	};

	const handleUpdateArticle = (articleId) => {
		navigate(`/update-article/${articleId}`);
	};

	// Функция обрезки текста
	const truncateText = (text, maxLength) => {
		// Удаляем HTML-теги из текста
		const withoutHtml = text.replace(/<[^>]*>/g, '');

		if (withoutHtml.length > maxLength) {
			return withoutHtml.slice(0, maxLength) + '...';
		}
		return withoutHtml;
	};

// Функция извлечения изображения из контента
	const extractImage = (content) => {
		const match = content.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/);
		return match ? match[1] : null;
	};
	

	return (
		<div>
			<div className={classes.main}>
				{articles.map((article) => (
					<li key={article.articleId} className={classes.card}>
						<div className={classes.user}>
							<img src={`http://83.229.83.240:9000/writewave/` + article.userImage} alt="User Avatar" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
							<h3>{article.username}</h3>
						</div>
						<div className={classes.image__container} onClick={() => handleViewArticle(article.articleId)}>
							<h2>{article.title}</h2>
							{/* Извлекаем изображение из контента */}
							{extractImage(article.content) && (
								<img src={extractImage(article.content)} alt="Article" className={classes.articleImage} />
							)}
							{/* Используем truncateText для корректного отображения контента */}
							<div className={classes.image} dangerouslySetInnerHTML={{ __html: truncateText(article.content, 240) }} />
						</div>
						<div className={classes.dop__and__buttons}>
							<div className={classes.dop}>
								<p>Нравится: {article.likeCount}</p>
								<p>Статус: {article.status === 'Moderation' ? 'На модерации' : article.status === 'Unpublished' ? 'Не опубликовано' : 'Опубликовано'}</p>
								<p>Комментарии ({article.commentCount})</p>
							</div>
							<div className={classes.buttons}>
								<button className={classes.redact_button} onClick={() => handleUpdateArticle(article.articleId)}>
									<img src="./redact.png" alt="Redact" />
								</button>
								{article.status === 'Unpublished' && (
									<button className={classes.post_button} onClick={() => handlePublishArticle(article.articleId)}>
										<img src="./post.png" alt="Post" />
									</button>
								)}
								<button className={classes.delete_button} onClick={() => handleDeleteArticle(article.articleId)}>
									<img src="./delete.png" alt="Delete" />
								</button>
							</div>
						</div>
					</li>
				))}
			</div>
		</div>
	);
};

export default MyArticlesList;


