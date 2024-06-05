import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Pagination from '../components/Pagination';
import CommentForm from '../components/CommentForm';
import { HubConnectionBuilder } from '@microsoft/signalr';
import classes from './AdminArticlePage.module.css';

const AdminArticlePage = () => {
	const { articleId } = useParams();
	const [article, setArticle] = useState(null);
	const [userId, setUserId] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);
	const [isAdmin, setIsAdmin] = useState(false);
	const [connection, setConnection] = useState(null);
	const navigate = useNavigate();

	useEffect(() => {
		fetch(`${window.apiUrl}/Admin/current`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setUserId(data.userId);
				setIsAdmin(data.role === 'Admin');
			})
			.catch((error) => console.error('Error fetching user info:', error));
	}, []);

	useEffect(() => {
		fetch(`${window.apiUrl}/api/article/${articleId}?commentPageSize=3&commentPageNumber=${pageNumber - 1}`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => setArticle(data))
			.catch((error) => console.error('Error fetching article:', error));
	}, [articleId, pageNumber]);

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
						setArticle((prevArticle) => ({
							...prevArticle,
							comments: [newComment, ...prevArticle.comments],
						}));
					});

					connection.on('CommentDeleted', (deletedCommentId) => {
						setArticle((prevArticle) => ({
							...prevArticle,
							comments: prevArticle.comments.filter(comment => comment.commentId !== deletedCommentId),
						}));
					});

					connection.invoke('JoinGroup', `Article-${articleId}`);
				})
				.catch(error => {
					console.error('SignalR Connection Error: ', error);
				});

			connection.onclose(error => {
				console.error('SignalR Connection Closed: ', error);
			});

			return () => {
				connection.stop().then(() => console.log('Disconnected from SignalR hub')).catch(error => console.error('Error while disconnecting: ', error));
			};
		}
	}, [connection, articleId]);

	const handlePublishArticle = () => {
		if (isAdmin) {
			fetch(`${window.apiUrl}/api/article/admin/publish/${articleId}`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ userId }),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error('Failed to publish article');
					}
					setArticle((prevArticle) => ({
						...prevArticle,
						status: 'Published',
					}));
					navigate('/admin');
				})
				.catch((error) => console.error('Error publishing article:', error));
		}
	};

	const handleDeleteComment = (commentId) => {
		connection.invoke("DeleteComment", commentId)
			.catch(error => console.error('Error deleting comment:', error));
	};

	const handlePageChange = (page) => {
		setPageNumber(page);
	};

	if (!article) {
		return <div>Loading...</div>;
	}

	return (
		<div className={classes.main}>
			<div className={classes.card}>
				<div className={classes.user}>
					<img
						className={classes.user__img}
						src={article.userImage ? `${window.minioUrl}/writewave/` + article.userImage : 'Default User Image URL'}
						alt="User Avatar"
						style={{ width: '50px', height: '50px', borderRadius: '50%' }}
					/>
					<h3>{article.username}</h3>
				</div>

				<div className={classes.image__container}>
					<div className={classes.title__container}>
						<h2>{article.title}</h2>
					</div>
					<div className={classes.image} dangerouslySetInnerHTML={{ __html: article.content }} />
				</div>

				<div className={classes.dop__and__buttons}>
					<div className={classes.dop}>
						<p>Нравится: {article.likeCount}</p>
						<p>Комментарии ({article.commentCount})</p>
					</div>
					<div className={classes.buttons}>
						{isAdmin && article.status !== 'Published' && (
							<button className={classes.post_button} onClick={handlePublishArticle}>
								<img src="/post.png" />
							</button>
						)}
					</div>
				</div>
			</div>

			<h2 className={classes.comm__title}>Комментарии</h2>
			<div className={classes.allform}>
				<CommentForm articleId={article.articleId} connection={connection} />
			</div>
			<div className={classes.forms}>
				{article.comments.map((comment) => (
					<li key={comment.commentId} className={classes.form}>
						<div className={classes.user}>
							<img
								src={comment.userImage ? `${window.minioUrl}/writewave/` + comment.userImage : 'Default User Image URL'}
								alt="Comment Author Avatar"
								style={{ width: '50px', height: '50px', borderRadius: '50%' }}
							/>
							<h3 className={classes.username}> {comment.username}</h3>
						</div>
						<p>{comment.content}</p>
						<div className={classes.del_btn_cont}>
							{(isAdmin || comment.userId === userId) && (
								<button className={classes.delete_button} onClick={() => handleDeleteComment(comment.commentId)}>
									<img src="/delete.png" alt="Delete" />
								</button>
							)}
						</div>
					</li>
				))}
			</div>

			<Pagination pageNumber={pageNumber} totalCount={article.commentCount} onPageChange={handlePageChange} pageSize={3} />
		</div>
	);
};

export default AdminArticlePage;
