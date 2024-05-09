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
				if (!imageUrl) {
					// If no image found, fetch image from Unsplash API
					const unsplashResponse = await fetch(`https://api.unsplash.com/photos/random?query=${article.title}&client_id=VfFvLYi-1d7dj6jKipRQQf0Kk-BVl93G0OxkmjbEpg4`);
					const unsplashData = await unsplashResponse.json();
					images[article.articleId] = unsplashData.urls.regular;
				} else {
					images[article.articleId] = imageUrl;
				}
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
