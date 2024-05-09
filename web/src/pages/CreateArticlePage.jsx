import React from 'react';
import CreateArticleForm from '../components/CreateArticleForm';
import toast, {Toaster} from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const CreateArticlePage = () => {
	const navigate = useNavigate();


	const handleCreateArticle = (newArticle) => {
		toast.promise(
			fetch('http://localhost:5177/api/article', {
				method: 'POST',
				credentials: 'include',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(newArticle),
			}),
			{
				loading: 'Создание статьи...',
				success: () => {
					navigate("/my-articles");
					return 'Статья создана успешно';
				},
				error: (error) => {
					console.error('Ошибка создания статьи:', error);
					return 'Не удалось создать статью';
				},
				duration: 3000, // Установка длительности отображения в миллисекундах
			}
		);
	};

	return (
		
		<div>
			<Toaster position="top-right" reverseOrder={false} />
			<CreateArticleForm onCreate={handleCreateArticle} /> {/* Передаем обработчик для создания статьи */}
		</div>
	);
};

export default CreateArticlePage;
