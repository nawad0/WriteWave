import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Pagination from '../components/Pagination';
import CommentForm from '../components/CommentForm';
import classes from './ArticlePage.module.css';
const ArticlePage = () => {
	const { articleId } = useParams();
	const [article, setArticle] = useState(null);
	const [userId, setUserId] = useState(0);
	const [pageNumber, setPageNumber] = useState(1);
	const [count, setCounter] = useState(1);
	const [commentAdded, setCommentAdded] = useState(false); 
	useEffect(() => {
		fetch(`${window.apiUrl}/api/article/${articleId}?commentPageSize=3&commentPageNumber=${pageNumber - 1}`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => setArticle(data))
			.catch((error) => console.error('Error fetching article:', error));

		fetch(`${window.apiUrl}:5177/api/user`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setUserId(data.user.userId);
			})
			.catch((error) => console.error('Error fetching data:', error));

		setCommentAdded(false)
	}, [articleId, pageNumber, count]);

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
				var like;
				if (data.userLiked == true) {
					like = article.likeCount + 1;
				} else {
					like = article.likeCount - 1;
				}
				const updatedArticle = {
					...article,
					userLiked: data.userLiked,
					likeCount: like,
				};
				setArticle(updatedArticle);
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
				const updatedArticle = {
					...article,
					userFavorited: data.userFavorited,
				};
				setArticle(updatedArticle);
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
				const updatedArticle = {
					...article,
					userSubscribed: data.userSubscribed,
				};
				setArticle(updatedArticle);
			})
			.catch((error) => console.error('Ошибка подписки на статью:', error));
	};
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
					<img className={classes.user__img} src={'http://localhost:9000/writewave/' + article.userImage} alt="User Avatar" style={{ width: '60px', height: '60px', borderRadius: '50%' }} />
					<h3 onClick={() => handleViewUser(article.userId)}> {article.username}</h3>
					<button className={article.userSubscribed ? classes.subscribed : classes.subscribe} onClick={() => handleSubscribe(article.articleId, article.userId)}>
						{article.userSubscribed ? 'Вы подписаны' : 'Подписаться'}
					</button>
				</div>

				<div className={classes.image__container} onClick={() => handleViewArticle(article.articleId)}>
					<div className={classes.title__container}>
						<h2>{article.title}</h2>
					</div>
					<div className={classes.image} dangerouslySetInnerHTML={{ __html: article.content }} />
				</div>

				{/* <h1>{article.title}</h1>
    			<div dangerouslySetInnerHTML={{ __html: article.content }} />
    			<p>Likes: {article.likeCount}</p>
    			<p>Comments: {article.commentCount}</p> */}

				<div className={classes.dop}>
					<div className={classes.card__buttons}>
						<button className={classes.buttons__card} onClick={() => handleLike(article.articleId)}>
							{article.userLiked ? <img src="../liked1.png" alt="Liked" /> : <img src="../like1.png" alt="Like" />}
						</button>
						{/* <button className={classes.buttons__card} onClick={() => handleViewArticle(article.articleId)}>
    						<img src="./comm.png" alt="Comments" />
    					</button> */}
						<button className={classes.buttons__card} onClick={() => handleFavorite(article.articleId)}>
							{article.userFavorited ? <img src="../saved.png" alt="Saved" /> : <img src="../save.png" alt="Save" />}
						</button>
					</div>

					<p>Нравится: {article.likeCount}</p>
					{/* <p onClick={() => handleViewArticle(article.articleId)}>Смотреть комментарии ({article.commentCount})</p> */}
				</div>
			</div>

			{/* <button onClick={() => handleLike(article.articleId)}>{article.userLiked ? 'Liked' : 'Like'}</button>
			<button onClick={() => handleFavorite(article.articleId)}>{article.userFavorited ? 'Favorited' : 'Favorite'}</button>
			{userId !== article.userId && <button onClick={() => handleSubscribe(article.articleId, article.userId)}>{article.userSubscribed ? 'Subscribed' : 'Subscribe'}</button>} */}
			<h2 className={classes.comm__title}>Комментарии</h2>
			<div className={classes.allform}>
				<CommentForm articleId={articleId} handleAddComment={handleAddComment} />
			</div>
			<div className={classes.forms}>
				{article.comments.map((comment) => (
					<li key={comment.commentId} className={classes.form}>
						<div className={classes.user}>
							<img
								src={comment.userImage ? 'http://localhost:9000/writewave/' + comment.userImage : 'Default User Image URL'}
								alt="Comment Author Avatar"
								style={{ width: '50px', height: '50px', borderRadius: '50%' }}
							/>
							<h3 className={classes.username}>{comment.username}</h3>
						</div>
						<p>{comment.content}</p>

						<div className={classes.del_btn_cont}>
							{comment.userId === userId && (
								
								<button className={classes.delete_button} onClick={() => handleDeleteComment(comment.commentId)}>
									<img src="../delete.png" />
								</button>
							)}
						</div>
					</li>
				))}
			</div>

			<div className={classes.pagin}>
				<Pagination pageNumber={pageNumber} totalCount={article.commentCount} onPageChange={handlePageChange} pageSize ={3} />
			</div>
		</div>
	);
};

export default ArticlePage;
