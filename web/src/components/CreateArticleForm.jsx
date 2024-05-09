import React, { useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import imageCompression from 'browser-image-compression';
import ImageUploader from 'quill-image-uploader';
import 'quill-image-uploader/dist/quill.imageUploader.min.css';
import './CreateArticleForm.css';
Quill.register('modules/imageUploader', ImageUploader);
const modules = {
	toolbar: {
		container: [
			['bold', 'italic', 'underline', 'strike'],
			[{ list: 'ordered' }, { list: 'bullet' }],
			[{ image: 'customImageHandler' }],
			['link'],
			[{ indent: '-1' }, { indent: '+1' }],
			[{ header: [1, 2, 3, 4, 5, 6, false] }],
			['clean'],
		],
	},
	imageUploader: {
		upload: async (file) => {
			try {
				const compressedFile = await compressImage(file);
				const filename = 'http://localhost:9000/writewave/' + (await uploadImageCallBack(compressedFile));
				return filename;
			} catch (error) {
				console.error('Failed to upload image:', error);
				throw error;
			}
		},
	},
};

const formats = ['header', 'bold', 'italic', 'underline', 'strike', 'blockquote', 'list', 'bullet', 'indent', 'link', 'image', 'imageBlot'];
const compressImage = async (file) => {
	try {
		const options = {
			maxSizeMB: 2, // Максимальный размер файла после сжатия (в мегабайтах)
			maxWidthOrHeight: 1000, // Максимальная ширина или высота изображения
			useWebWorker: true, // Использовать веб-воркер для сжатия
		};
		return await imageCompression(file, options);
	} catch (error) {
		console.error('Failed to compress image:', error);
		throw error;
	}
};
const uploadImageCallBack = (file) => {
	return new Promise(async (resolve, reject) => {
		const formData = new FormData();
		formData.append('file', file);

		try {
			const response = await fetch('http://localhost:5177/Object/Post', {
				method: 'POST',
				body: formData,
			});

			if (!response.ok) {
				throw new Error('Failed to upload image');
			}

			const data = await response.json();

			resolve(data.filename);
		} catch (error) {
			reject(error);
		}
	});
};
const CreateArticleForm = ({ onCreate }) => {
	const [title, setTitle] = useState('');
	const [content, setContent] = useState('');
	const [status, setStatus] = useState('0'); // Default status

	const handleTitleChange = (event) => {
		setTitle(event.target.value);
	};

	const handleContentChange = (value) => {
		setContent(value);
	};

	const handleStatusChange = (event) => {
		setStatus(event.target.value);
	};

	const handleSubmit = (event) => {
		event.preventDefault();
		const newArticle = {
			title: title,
			content: content,
			articleStatus: status, // Include the selected status in the new article object
		};
		onCreate(newArticle);
		setTitle('');
		setContent('');
		setStatus('0'); // Reset status to default after submission
	};

	return (
		<div className="main10">
			<form onSubmit={handleSubmit}>
				<div className="title10">
					{/* <label>Title:</label> */}

					<input type="text" value={title} onChange={handleTitleChange} required placeholder="Введите заголовок статьи" />
				</div>
				<div className="content10">
					<label>Напишите свою статью...</label>
					<ReactQuill className="react-quill" theme="snow" modules={modules} formats={formats} value={content} onChange={handleContentChange} required />
				</div>
				<div className="button10">
					<div className="status10">
						<label>Выбреите статус статьи: </label>
						<select value={status} onChange={handleStatusChange}>
							<option value="0">Опубликована</option>
							<option value="2">Неопубликована</option>
						</select>
						<button type="submit">Создать статью</button>
					</div>
				</div>
			</form>
		</div>
	);
};

export default CreateArticleForm;
