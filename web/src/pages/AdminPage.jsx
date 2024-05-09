import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './AdminPage.module.css';

// Импортируем функции из другого файла (если они там находятся)
// import { truncateText, extractImage } from './utils'; // Предположим, что функции находятся в файле utils.js

const AdminPage = () => {
	const [articles, setArticles] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [totalCount, setTotalCount] = useState(0);

	useEffect(() => {
		fetch(`http://localhost:5177/api/article/moderation?pageSize=10&pageNumber=${pageNumber}`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setArticles(data.articles);
				setTotalCount(data.totalCount);
			})
			.catch((error) => console.error('Error fetching moderation articles:', error));
	}, [pageNumber]);

	const handlePageChange = (newPageNumber) => {
		setPageNumber(newPageNumber);
	};
	const navigate = useNavigate();

	const handleViewArticle = (articleId) => {
		navigate(`/admin/article/${articleId}`);
	};
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
		<div className={classes.glavn}>
			<h1>Статьи на модерации</h1>
			<div className={classes.main}>
				{articles.map((article) => (
					<div onClick={() => handleViewArticle(article.articleId)} key={article.articleId} className={classes.card}>
						<div className={classes.image__container}>
							<h2>{article.title}</h2>
							{/* Извлекаем изображение из контента */}
							{extractImage(article.content) && (
								<img src={extractImage(article.content)} alt="Article" className={classes.articleImage} />
							)}
							{/* Используем truncateText для корректного отображения контента */}
							<div dangerouslySetInnerHTML={{ __html: truncateText(article.content, 240) }} />
						</div>
					</div>
				))}
			</div>
		</div>
	);
};

export default AdminPage;

// Функция обрезки текста

