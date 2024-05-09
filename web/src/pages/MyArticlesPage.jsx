import React, { useState, useEffect } from 'react';
import MyArticlesList from '../components/MyArticlesList';
import { useNavigate } from 'react-router-dom';
import classes from './MyArticlesPage.module.css';
import MyProfilePage from './MyProfilePage';
import {Toaster} from "react-hot-toast";
const MyArticlesPage = () => {
	const [articles, setArticles] = useState([]);
	const [deleteArticle, setDeleteArticle] = useState(false);
	const navigate = useNavigate();
	const [counter, setCounter] = useState(1);
	const handleCreatePage = () => {
		navigate(`/create-article`);
	};

	useEffect(() => {
		fetch(`${window.apiUrl}/api/article/myArticles?pageSize=0&pageNumber=0`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setArticles(data.articles);
			})
			.catch((error) => console.error('Error fetching articles:', error));
	}, [deleteArticle, counter]);

	const handlePublishArticle = (articleId) => {
		handleUpdate();
		setDeleteArticle(true);
		fetch(`${window.apiUrl}/api/article/updateStatus/${articleId}?articleStatus=0`, {
			method: 'PUT',
			credentials: 'include',
		})
			.then((response) => {
				if (response.ok) {
				} else {
					setDeleteArticle(false);
					throw new Error('Failed to publish article');
				}
			})
			.catch((error) => console.error('Error publishing article:', error));
	};

	const handleDeleteArticle = (articleId) => {
		handleUpdate();
		setDeleteArticle(true);
		fetch(`${window.apiUrl}/api/article/${articleId}`, {
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
				setDeleteArticle(false);
			})
			.catch((error) => console.error('Ошибка удаления комментария:', error));
	};
	const handleUpdate = () => {
		setCounter(counter + 1);
	};

	return (
		<div>
			<Toaster position={ "top-right"}/>
			<div className={classes.main}>
				
				<div className={classes.button__container}>
					<button onClick={() => handleCreatePage()}>+</button>
				</div>
				{/* <h1>My Articles</h1> */}
				<MyArticlesList handleDeleteArticle={handleDeleteArticle} articles={articles} handlePublishArticle={handlePublishArticle} />
			</div>
		</div>
	);
};

export default MyArticlesPage;
