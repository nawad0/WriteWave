import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import UpdateArticleForm from '../components/UpdateArticleForm';

const CreateArticlePage = () => {
	const { articleId } = useParams();
	const [article, setArticle] = useState({});
	const navigate = useNavigate();
	useEffect(() => {
		fetch(`${window.apiUrl}/api/article/${articleId}?commentPageSize=0&commentPageNumber=0`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => setArticle(data))
			.catch((error) => console.error('Error fetching article:', error));
	}, [articleId]);

	const handleUpdateArticle = (newArticle, articleId) => {
		toast.promise(
			fetch(`${window.apiUrl}/api/article/${articleId}`, {
				method: 'PUT',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newArticle),
			}),
			{
				loading: 'Обновление статьи...',
				success: () => {
					navigate("/my-articles");
					return 'Статья успешно обновлена';
				},
				error: (error) => {
					console.error('Ошибка обновления статьи:', error);
					return 'Не удалось обновить статью';
				},
				duration: 3000, // Установка длительности отображения в миллисекундах
			}
		);
	};

	return (
		<div>
			<UpdateArticleForm onUpdate={handleUpdateArticle} article={article} />
		</div>
	);
};

export default CreateArticlePage;
