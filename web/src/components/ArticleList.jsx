import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import classes from './ArticleList.module.css';
import ArticleCard from './ArticleCard';
const ArticleList = ({ articles, handleLike, handleFavorite, handleSubscribe, userId }) => {
	const navigate = useNavigate();
	const [articleImages, setArticleImages] = useState({});
	const handleViewArticle = (articleId) => {
		navigate(`/article/${articleId}`);
	};
	const handleViewUser = (userId) => {
		navigate(`/profile/${userId}`);
	};
	
	const truncateText = (text, maxLength) => {
		// Удаляем HTML-теги из текста
		const withoutHtml = text.replace(/<[^>]*>/g, '');

		if (withoutHtml.length > maxLength) {
			return withoutHtml.slice(0, maxLength) + '...';
		}
		return withoutHtml + "...";
	};

	const extractImage = (content) => {
		const match = content.match(/<img [^>]*src=['"]([^'"]+)[^>]*>/);
		return match ? match[1] : null;
	};
// Функция извлечения изображения из контента
	useEffect(() => {
		const fetchArticleImages = async () => {
			const images = {};
			for (const article of articles) {
				const imageUrl = extractImage(article.content);
					images[article.articleId] = imageUrl;
			}
			setArticleImages(images);
		};

		fetchArticleImages();
	}, [articles]);

	const getUserInitials = (username) => {
		const names = username.split(' ');
		return names.map((name) => name.charAt(0)).join('').toUpperCase();
	};
	
	return (
		<div>
			<div className={classes.main}>
				{articles.map((article) => (
					<ArticleCard
						key={article.articleId}
						article={article}
						type="first"
						handleViewArticle={handleViewArticle}
						handleLike={handleLike}
						handleFavorite={handleFavorite}
						handleSubscribe={handleSubscribe}
						getUserInitials={getUserInitials}
						userId={userId}
						articleImages={articleImages}
					/>

				))}
			</div>
		</div>
	);

};
export default ArticleList;
