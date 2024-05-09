import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import CommentForm from '../components/CommentForm';
import { useNavigate } from 'react-router-dom';
import classes from './AdminArticlePage.module.css';

const AdminArticlePage = () => {
	const { articleId } = useParams();
	const [article, setArticle] = useState(null);
	const [userId, setUserId] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);
	const [isAdmin, setIsAdmin] = useState(false);
	const [count, setCounter] = useState(1);
	const navigate = useNavigate();
	useEffect(() => {
		// Получаем информацию о текущем пользователе, включая его роль
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

	const handlePublishArticle = () => {
		// Отправляем запрос на публикацию статьи, если пользователь администратор
		if (isAdmin) {
			fetch(`${window.apiUrl}/api/article/admin/publish/${articleId}`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					userId: userId,
				}),
			})
				.then((response) => {
					if (!response.ok) {
						throw new Error('Failed to publish article');
					}
					// Обновляем статью после публикации
					setArticle((prevArticle) => ({
						...prevArticle,
						status: 'Published',
					}));
					navigate('/admin');
				})
				.catch((error) => console.error('Error publishing article:', error));
		}
	};
	useEffect(() => {
		fetch(`${window.apiUrl}/api/article/${articleId}?commentPageSize=3&commentPageNumber=${pageNumber - 1}`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => setArticle(data))
			.catch((error) => console.error('Error fetching article:', error));

		fetch(`http://localhost:5177/api/User`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setUserId(data.userId);
			})
			.catch((error) => console.error('Error fetching data:', error));
	}, [articleId, pageNumber, count]);

	const handleDeleteComment = (commentId) => {
		fetch(`${window.apiUrl}/api/article/comment/${commentId}`, {
			method: 'DELETE',
			credentials: 'include',
			headers: {
				'Content-Type': 'application/json', // Правильное название заголовка
			},
		})
			.then((response) => {
				if (!response.ok) {
					throw new Error('Failed to delete comment');
				}
				handleAddComment();
			})
			.catch((error) => console.error('Ошибка удаления комментария:', error));
	};

	const handlePageChange = (page) => {
		setPageNumber(page);
	};
	const handleAddComment = () => {
		setCounter(count + 1);
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
						src={article.userImage ? `${window.apiUrl}/api:9000/writewave/` + article.userImage : 'Default User Image URL'}
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
						{isAdmin &&
							article.status !== 'Published' && ( // Условное отображение кнопки "Publish" для администратора
								<button className={classes.post_button} onClick={handlePublishArticle}>
									<img src="/post.png" />
								</button>
							)}
					</div>
				</div>
			</div>

			
	

			<h2 className={classes.comm__title}>Комментарии</h2>
			<div className={classes.allform}>
				<CommentForm articleId={articleId} handleAddComment={handleAddComment} />
			</div>
			<div className={classes.forms}>
				{article.comments.map((comment) => (
					<li key={comment.commentId} className={classes.form}>
						<div className={classes.user}>
							<img
								src={comment.userImage ? `${window.apiUrl}/api:9000/writewave/` + comment.userImage : 'Default User Image URL'}
								alt="Comment Author Avatar"
								style={{ width: '50px', height: '50px', borderRadius: '50%' }}
							/>
							<h3 className={classes.username}> {comment.username}</h3>
						</div>
						<p>{comment.content}</p>

						<div className={classes.del_btn_cont}>
							{comment.userId === 4 && ( // Условное отображение кнопки удаления
								<button className={classes.delete_button} onClick={() => handleDeleteComment(comment.commentId)}>
									<img src="/delete.png" />
								</button>
							)}
						</div>
					</li>
				))}
			</div>

			<Pagination pageNumber={pageNumber} totalCount={article.commentCount} onPageChange={handlePageChange} pageSize={3}/>
		</div>
	);
};

export default AdminArticlePage;
