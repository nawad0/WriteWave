import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import classes from './ProfilePage.module.css';
const ProfilePage = () => {
	const { userId } = useParams();
	const [user, setUser] = useState(null);
	const [subscriptions, setSubscriptions] = useState([]);
	const [subscribers, setSubscribers] = useState([]);
	const [userSubscribed, setUserSubscribed] = useState(false);
	const [articles, setArticles] = useState([]);
	const [currentUserId, setCurrentUserId] = useState(0);
	const navigate = useNavigate();
	useEffect(() => {
		fetch(`${window.apiUrl}/api/user`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setCurrentUserId(data.user.userId);
				console.log(data.user.userId);
			})
			.catch((error) => console.error('Error fetching data:', error));

		fetch(`${window.apiUrl}/api/user/${userId}`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setUser(data.user);
				setUserSubscribed(data.userSubscribed);
				// Выполняем запросы к API только после установки пользователя
				fetch(`${window.apiUrl}/api/user/subscriptions/${data.user.userId}`, {
					method: 'GET',
					credentials: 'include',
				})
					.then((response) => response.json())
					.then((data) => {
						setSubscriptions(data.subscriptions);
					})
					.catch((error) => console.error('Error fetching user subscriptions:', error));

				fetch(`${window.apiUrl}/api/user/subscribers/${data.user.userId}`, {
					method: 'GET',
					credentials: 'include',
				})
					.then((response) => response.json())
					.then((data) => {
						setSubscribers(data.subscribers);
					})
					.catch((error) => console.error('Error fetching user subscribers:', error));
			})
			.catch((error) => console.error('Error fetching user data:', error));

		fetch(`${window.apiUrl}/api/article/getArticlesByUser/${userId}`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setArticles(data.articles);
			})
			.catch((error) => console.error('Error fetching user articles:', error));
	}, [userId, userSubscribed]);

	const handleSubscribe = (userId) => {
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
				setUserSubscribed(data.userSubscribed);
			})
			.catch((error) => console.error('Ошибка подписки на пользователя:', error));
	};
	const handleViewArticle = (articleId) => {
		navigate(`/article/${articleId}`);
	};

	return (
		// <div>
		// 	{/* <h1>Profile</h1> */}
		// 	{user && (
		// 		<div>
		// 			<p>Username: {user.username}</p>
		// 			<p>Email: {user.email}</p>
		// 			{user.userImage && <img src={'http://localhost:9000/writewave/' + user.userImage} alt="User Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />}
		// 		</div>
		// 	)}
		// 	{currentUserId != userId && <button onClick={() => handleSubscribe(userId)}>{userSubscribed ? 'Subscribed' : 'Subscribe'}</button>}

		// 	<h2>Подписки</h2>
		// 	<ul>
		// 		{subscriptions.map((subscription) => (
		// 			<li key={subscription.userId}>
		// 				<p>Username: {subscription.username}</p>
		// 				<p>Email: {subscription.email}</p>
		// 				{subscription.userImage && (
		// 					<img src={'http://localhost:9000/writewave/' + subscription.userImage} alt="Subscription Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
		// 				)}
		// 			</li>
		// 		))}
		// 	</ul>
		// 	<h2>Подписчики</h2>
		// 	<ul>
		// 		{subscribers.map((subscription) => (
		// 			<li key={subscription.userId}>
		// 				<p>Username: {subscription.username}</p>
		// 				<p>Email: {subscription.email}</p>
		// 				{subscription.userImage && (
		// 					<img src={'http://localhost:9000/writewave/' + subscription.userImage} alt="Subscription Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
		// 				)}
		// 			</li>
		// 		))}
		// 	</ul>

		// 	<h2>Статьи</h2>
		// 	<ul>
		// 		{articles.map((article) => (
		// 			<li key={article.articleId}>
		// 				<p>Title: {article.title}</p>
		// 				<button onClick={() => handleViewArticle(article.articleId)}>View Article</button>
		// 			</li>
		// 		))}
		// 	</ul>
		// </div>
		<>
			<div className={classes.container}>
				<div className={classes['profile-card']}>
					<div className={classes['profile-info']}>
						{user && (
							<div>
								<img src={'http://localhost:9000/writewave/' + user.userImage} alt="User Avatar" />
								<div className={classes['profile-data']}>
									<p className={classes.name}> {user.username}</p>
									<p className={classes.email}> {user.email}</p>
								</div>
							</div>
						)}
					</div>
				</div>
				<h2>Подписки</h2>
				<div className={classes.subscrs}>
					{subscriptions.map((subscription) => (
						<div className={classes.subscr} key={subscription.userId}>
							<h3>{subscription.username}</h3>
							<p>{subscription.email}</p>
							{subscription.userImage && (
								<img src={'http://localhost:9000/writewave/' + subscription.userImage} alt="Subscription Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
							)}
						</div>
					))}
				</div>
				<h2>Подписчики</h2>
				<div className={classes.subscrs1}>
					{subscribers.map((subscription) => (
						<div className={classes.subscr} key={subscription.userId}>
							<h3>{subscription.username}</h3>
							<p>{subscription.email}</p>
							{subscription.userImage && (
								<img src={'http://localhost:9000/writewave/' + subscription.userImage} alt="Subscription Avatar" style={{ width: '50px', height: '50px', borderRadius: '50%' }} />
							)}
						</div>
					))}
				</div>
				<h2>Статьи пользователя</h2>
				<div className={classes.stati}>
					{articles.map((article) => (
						<div className={classes.card} key={article.articleId}>
							<h3>{article.title}</h3>
							<button onClick={() => handleViewArticle(article.articleId)}>Смотреть статью</button>
						</div>
					))}
				</div>
			</div>
		</>
	);
};

export default ProfilePage;
