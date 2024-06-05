import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import CommentForm from '../components/CommentForm';
import classes from './ArticlePage.module.css';
import { HubConnectionBuilder } from "@microsoft/signalr";
import Comment from '../components/Comment';

const ArticlePage = () => {
	const { articleId } = useParams();
	const [article, setArticle] = useState(null);
	const [userId, setUserId] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);
	const [count, setCounter] = useState(1);
	const [connection, setConnection] = useState(null);
	const [replyTo, setReplyTo] = useState(null); // Добавлено состояние для отслеживания ответов

	useEffect(() => {
		fetch(`${window.apiUrl}/api/article/${articleId}?commentPageSize=15&commentPageNumber=${pageNumber - 1}`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => setArticle(data))
			.catch((error) => console.error('Error fetching article:', error));

		fetch(`${window.apiUrl}/api/user`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setUserId(data.user.userId);
			})
			.catch((error) => console.error('Error fetching data:', error));
	}, [articleId, pageNumber, count]);

	useEffect(() => {
		const newConnection = new HubConnectionBuilder()
			.withUrl(`${window.apiUrl}/api/hub`)
			.withAutomaticReconnect()
			.build();

		setConnection(newConnection);
	}, []);

	useEffect(() => {
		if (connection) {
			connection.start()
				.then(() => {
					console.log('Connected to SignalR hub');

					connection.on('Comments', (newComment) => {
						console.log('New comment received:', newComment);
						setArticle((prevArticle) => {
							const updateReplies = (comments) => {
								return comments.map(comment => {
									if (comment.commentId === newComment.parentId) {
										return {
											...comment,
											replies: [newComment, ...comment.replies]
										};
									}
									return {
										...comment,
										replies: updateReplies(comment.replies)
									};
								});
							};

							const updatedComments = updateReplies(prevArticle.comments);

							return {
								...prevArticle,
								comments: newComment.parentId === null ? [newComment, ...prevArticle.comments] : updatedComments
							};
						});
					});


					connection.on('CommentDeleted', (deletedCommentId) => {
						const removeCommentAndReplies = (comments) => {
							return comments.filter(comment => {
								if (comment.commentId === deletedCommentId) {
									return false; // Exclude the deleted comment
								}
								// Recursively filter out nested replies
								if (comment.replies && comment.replies.length > 0) {
									comment.replies = removeCommentAndReplies(comment.replies);
								}
								return true; // Include non-deleted comments
							});
						};

						setArticle((prevArticle) => ({
							...prevArticle,
							comments: removeCommentAndReplies(prevArticle.comments),
						}));
					});

					connection.invoke('JoinGroup', `Article-${articleId}`);
				})
				.catch(error => console.error('SignalR Connection Error: ', error));

			return () => {
				connection.stop()
					.then(() => console.log('Disconnected from SignalR hub'))
					.catch(error => console.error('Error while disconnecting: ', error));
			};
		}
	}, [connection, articleId]);

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
				const likeCount = data.userLiked ? article.likeCount + 1 : article.likeCount - 1;
				setArticle((prevArticle) => ({
					...prevArticle,
					userLiked: data.userLiked,
					likeCount: likeCount,
				}));
			})
			.catch((error) => console.error('Ошибка лайка статьи:', error));
	};

	const handleFavorite = (articleId) => {
		fetch(`${window.apiUrl}/api/article/favorite/${articleId}`, {
			method: 'POST',
			credentials: 'include',
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to add favorite');
				}
				return response.json();
			})
			.then((data) => {
				setArticle((prevArticle) => ({
					...prevArticle,
					userFavorited: data.userFavorited,
				}));
			})
			.catch((error) => console.error('Ошибка добавления статьи в избранное:', error));
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
				setArticle((prevArticle) => ({
					...prevArticle,
					userSubscribed: data.userSubscribed,
				}));
			})
			.catch((error) => console.error('Ошибка подписки на статью:', error));
	};

	const handleDeleteComment = (commentId) => {
		connection.invoke("DeleteComment", commentId)
			.catch(error => console.error('Error deleting comment:', error));
	};

	const handlePageChange = (page) => {
		setPageNumber(page);
	};

	const handleReply = (comment) => {
		setReplyTo(comment);
	};

	const clearReply = () => {
		setReplyTo(null);
	};

	if (!article) {
		return <div>Loading...</div>;
	}

	return (
		<div className={classes.main}>
			<div className={classes.card}>
				<div className={classes.user}>
					<img className={classes.user__img} src={`${window.minioUrl}/writewave/` + article.userImage}
						 alt="User Avatar" style={{width: '60px', height: '60px', borderRadius: '50%'}}/>
					<h3 onClick={() => handleViewUser(article.userId)}> {article.username}</h3>
					<button className={article.userSubscribed ? classes.subscribed : classes.subscribe}
							onClick={() => handleSubscribe(article.articleId, article.userId)}>
						{article.userSubscribed ? 'Вы подписаны' : 'Подписаться'}
					</button>
				</div>

				<div className={classes.image__container} onClick={() => handleViewArticle(article.articleId)}>
					<div className={classes.title__container}>
						<h2>{article.title}</h2>
					</div>
					<div className={classes.image} dangerouslySetInnerHTML={{__html: article.content}}/>
				</div>

				<div className={classes.dop}>
					<div className={classes.card__buttons}>
						<button className={classes.buttons__card} onClick={() => handleLike(article.articleId)}>
							{article.userLiked ? <img src="../liked1.png" alt="Liked"/> :
								<img src="../like1.png" alt="Like"/>}
						</button>
						<button className={classes.buttons__card} onClick={() => handleFavorite(article.articleId)}>
							{article.userFavorited ? <img src="../saved.png" alt="Saved"/> :
								<img src="../save.png" alt="Save"/>}
						</button>
					</div>

					<p>Нравится: {article.likeCount}</p>
				</div>
			</div>

			<h2 className={classes.comm__title}>Комментарии</h2>
			{replyTo ? (
				<div className={classes.reply__container}>
					<p>Ответ на комментарий пользователя {replyTo.username}:</p>
					<CommentForm articleId={article.articleId} parentId={replyTo.commentId} connection={connection}
								 clearReply={clearReply}/>
				</div>
			) : (
				<div className={classes.allform}>
					<CommentForm articleId={article.articleId} connection={connection}/>
				</div>
			)}


			<div className={classes.forms}>
				{article.comments.map((comment) => (
					<Comment
						key={comment.commentId}
						comment={comment}
						articleId={article.articleId}
						userId={userId}
						connection={connection}
						handleDeleteComment={handleDeleteComment}
						handleReply={handleReply}
					/>
				))}
			</div>

			<div className={classes.pagin}>
				<Pagination pageNumber={pageNumber} totalCount={article.commentCount} onPageChange={handlePageChange}
							pageSize={15}/>
			</div>
		</div>
	);
};

export default ArticlePage;
