import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

const ProfilePage = () => {
	const { userId } = useParams();
	const [user, setUser] = useState(null);
	const [subscriptions, setSubscriptions] = useState([]);
	const [subscribers, setSubscribers] = useState([]);
	const [userSubscribed, setUserSubscribed] = useState(false);
	const [articles, setArticles] = useState([]);
	const [currentUserId, setCurrentUserId] = useState(0);
	const [currentUserName, setCurrentUserName] = useState('');
	const navigate = useNavigate();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const userResponse = await fetch(`${window.apiUrl}/api/user`, {
					method: 'GET',
					credentials: 'include',
				});
				const userData = await userResponse.json();
				setCurrentUserId(userData.user.userId);
				setCurrentUserName(userData.user.username);

				const profileResponse = await fetch(`${window.apiUrl}/api/user/${userId}`, {
					method: 'GET',
					credentials: 'include',
				});
				const profileData = await profileResponse.json();
				setUser(profileData.user);
				setUserSubscribed(profileData.userSubscribed);

				const subscriptionsResponse = await fetch(`${window.apiUrl}/api/user/subscriptions/${profileData.user.userId}`, {
					method: 'GET',
					credentials: 'include',
				});
				const subscriptionsData = await subscriptionsResponse.json();
				setSubscriptions(subscriptionsData.subscriptions);

				const subscribersResponse = await fetch(`${window.apiUrl}/api/user/subscribers/${profileData.user.userId}`, {
					method: 'GET',
					credentials: 'include',
				});
				const subscribersData = await subscribersResponse.json();
				setSubscribers(subscribersData.subscribers);

				const articlesResponse = await fetch(`${window.apiUrl}/api/article/getArticlesByUser/${userId}`, {
					method: 'GET',
					credentials: 'include',
				});
				const articlesData = await articlesResponse.json();
				setArticles(articlesData.articles);
			} catch (error) {
				console.error('Error fetching data:', error);
			}
		};

		fetchData();
	}, [userId, userSubscribed]);

	const handleSubscribe = async (userId) => {
		try {
			const response = await fetch(`${window.apiUrl}/api/article/subscribe/${userId}`, {
				method: 'POST',
				credentials: 'include',
			});

			if (!response.ok) {
				throw new Error('Failed to subscribe');
			}

			const data = await response.json();
			setUserSubscribed(data.userSubscribed);
		} catch (error) {
			console.error('Error subscribing to user:', error);
		}
	};

	const handleViewArticle = (articleId) => {
		navigate(`/article/${articleId}`);
	};

	const handleOpenChat = () => {
		navigate('/chat', { state: { userName: currentUserName, userId: currentUserId, otherUserId: userId } });
	};

	return (
		<div className="container mx-auto p-4 max-w-2xl">
			<div className="bg-white shadow-md rounded-lg p-6 mb-6">
				{user && (
					<div className="flex items-center mb-6">
						<img
							src={`${window.minioUrl}/writewave/${user.userImage}`}
							alt="User Avatar"
							className="w-20 h-20 rounded-full mr-4"
						/>
						<div>
							<p className="text-2xl font-bold text-purple-700">{user.username}</p>
							<p className="text-gray-600">{user.email}</p>
						</div>
						<button
							onClick={handleOpenChat}
							className="ml-auto px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
						>
							Открыть чат
						</button>
					</div>
				)}
			</div>

			<h2 className="text-2xl font-bold text-purple-700 mb-4">Подписки</h2>
			<div className="grid grid-cols-1 gap-4">
				{subscriptions.map((subscription) => (
					<div
						className="bg-white shadow-md rounded-lg p-4 flex items-center"
						key={subscription.userId}
					>
						<div>
							<h3 className="text-lg font-bold text-purple-700">{subscription.username}</h3>
							<p className="text-gray-600">{subscription.email}</p>
						</div>
						{subscription.userImage && (
							<img
								src={`${window.minioUrl}/writewave/${subscription.userImage}`}
								alt="Subscription Avatar"
								className="ml-auto w-12 h-12 rounded-full"
							/>
						)}
					</div>
				))}
			</div>

			<h2 className="text-2xl font-bold text-purple-700 mb-4 mt-8">Подписчики</h2>
			<div className="grid grid-cols-1 gap-4">
				{subscribers.map((subscriber) => (
					<div
						className="bg-white shadow-md rounded-lg p-4 flex items-center"
						key={subscriber.userId}
					>
						<div>
							<h3 className="text-lg font-bold text-purple-700">{subscriber.username}</h3>
							<p className="text-gray-600">{subscriber.email}</p>
						</div>
						{subscriber.userImage && (
							<img
								src={`${window.minioUrl}/writewave/${subscriber.userImage}`}
								alt="Subscriber Avatar"
								className="ml-auto w-12 h-12 rounded-full"
							/>
						)}
					</div>
				))}
			</div>

			<h2 className="text-2xl font-bold text-purple-700 mb-4 mt-8">Статьи пользователя</h2>
			<div className="grid grid-cols-1 gap-4">
				{articles.map((article) => (
					<div
						className="bg-white shadow-md rounded-lg p-4"
						key={article.articleId}
					>
						<h3 className="text-lg font-bold text-purple-700">{article.title}</h3>
						<button
							onClick={() => handleViewArticle(article.articleId)}
							className="mt-2 px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring focus:ring-purple-300"
						>
							Смотреть статью
						</button>
					</div>
				))}
			</div>
		</div>
	);
};

export default ProfilePage;
