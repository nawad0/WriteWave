import React, { useState, useEffect } from 'react';
import ArticleList from '../components/ArticleList';
import Pagination from '../components/Pagination';
import classes from './Home.module.css';
import {Toaster} from "react-hot-toast";

const Home = () => {
	const [articles, setArticles] = useState([]);
	const [pageNumber, setPageNumber] = useState(1);
	const [totalCount, setTotalCount] = useState(0);
	const [userId, setUserId] = useState(0);
	const [searchQuery, setSearchQuery] = useState('');
	const [selectedEndpoint, setSelectedEndpoint] = useState(`${window.apiUrl}/api/article/published`);
	const [orderBy, setOrderBy] = useState('likeCount_1month');

	useEffect(() => {
		fetch(`${selectedEndpoint}?search=${searchQuery}&orderBy=${orderBy}&pageSize=9&pageNumber=${pageNumber}`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setArticles(data.articles);
				setTotalCount(data.totalCount);
			})
			.catch((error) => console.error('Error fetching data:', error));

		fetch(`${window.apiUrl}/api/user`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setUserId(data.user.userId);
			})
			.catch((error) => console.error('Error fetching data:', error));
	}, [pageNumber, selectedEndpoint, searchQuery, orderBy]); // Добавляем orderBy в зависимости useEffect

	const handleLike = (articleId) => {
		fetch(`${window.apiUrl}/api/article/like/${articleId}`, {
			method: 'POST',
			credentials: 'include',
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to add like');
				}
				return response.json();
			})
			.then((data) => {
				// Update the articles state to reflect the updated userLiked status and like count
				setArticles((prevArticles) => {
					return prevArticles.map((article) => {
						if (article.articleId === articleId) {
							if (data.userLiked == true) {
								return {
									...article,
									userLiked: true,
									likeCount: article.likeCount + 1,
								};
							} else {
								return {
									...article,
									userLiked: false,
									likeCount: article.likeCount - 1,
								};
							}
						} else {
							return article;
						}
					});
				});
			})
			.catch((error) => console.error('Error liking article:', error));
	};
	const handleFavorite = (articleId) => {
		fetch(`${window.apiUrl}/api/article/favorite/${articleId}`, {
			method: 'POST',
			credentials: 'include',
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to add like');
				}
				return response.json();
			})
			.then((data) => {
				// Update the articles state to reflect the updated userLiked status and like count
				setArticles((prevArticles) => {
					return prevArticles.map((article) => {
						if (article.articleId === articleId) {
							if (data.userFavorited == true) {
								return {
									...article,
									userFavorited: true,
								};
							} else {
								return {
									...article,
									userFavorited: false,
								};
							}
						} else {
							return article;
						}
					});
				});
			})
			.catch((error) => console.error('Error favoriting article:', error));
	};
	const handleSubscribe = (articleId, userId) => {
		fetch(`${window.apiUrl}/api/article/subscribe/${userId}`, {
			method: 'POST',
			credentials: 'include',
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to subscribe');
				}
				return response.json();
			})
			.then((data) => {
				// Обновляем состояние статей, чтобы отразить обновленный статус подписки пользователя
				setArticles((prevArticles) => {
					return prevArticles.map((article) => {
						if (article.articleId === articleId) {
							if (data.userSubscribed == true) {
								return {
									...article,
									userSubscribed: true,
								};
							} else {
								return {
									...article,
									userSubscribed: false,
								};
							}
						} else {
							return article;
						}
					});
				});
			})
			.catch((error) => console.error('Ошибка подписки на статью:', error));
	};

	const handlePageChange = (newPageNumber) => {
		setPageNumber(newPageNumber);
	};

	const handleEndpointChange = (endpoint) => {
		setSelectedEndpoint(endpoint);
		setPageNumber(1);
	};

	const handleSearch = (query) => {
		setSearchQuery(query);
		setPageNumber(1);
	};

	const handleOrderByChange = (newOrderBy) => {
		setOrderBy(newOrderBy);
        handleEndpointChange(`${window.apiUrl}/api/article/published`);
		setPageNumber(1);
	};

	return (
		<div>
			<Toaster
				position="top-right"
			/>
			<div>
				<div className={classes.sort}>
					<button onClick={() => handleOrderByChange('title')}>По названию</button>
					<button onClick={() => handleOrderByChange('publicationDate_desc')}>По дате публикации</button>
					<button onClick={() => handleOrderByChange('likeCount_1month')}>Популярные в этом месяце</button>
					<button onClick={() => handleEndpointChange(`${window.apiUrl}/api/article/published`)}>Все статьи</button>
					<button onClick={() => handleEndpointChange(`${window.apiUrl}/api/article/favorites`)}>Избранные</button>
					<button onClick={() => handleEndpointChange(`${window.apiUrl}/api/article/subscribed-articles`)}>Подписки</button>
				</div>

			</div>

			<div className={classes.search}>
				<div className={classes.input}>
					<input type="text" value={searchQuery} onChange={(e) => handleSearch(e.target.value)} placeholder="Искать статьи..." />
				</div>
				<button className={classes.search__button} onClick={() => handleSearch('')}>
					Очистить
				</button>
			</div>
			<ArticleList articles={articles} handleLike={handleLike} handleSubscribe={handleSubscribe} userId={userId} handleFavorite={handleFavorite} />
			<div className={classes.pagin}>
				<Pagination pageNumber={pageNumber} totalCount={totalCount} onPageChange={handlePageChange} pageSize={9}/>
			</div>
		</div>
	);
};

export default Home;
