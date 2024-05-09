import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Box } from '@mui/material';
import ErrorAlert from '../components/ErrorAllert';// Импортируй новый компонент

import classes from './loginPage.module.css';
import toast, {Toaster} from "react-hot-toast";

const LoginPage = ({ setIsAuthenticated }) => {
	const [username, setUsername] = useState('');
	const [password, setPassword] = useState('');
	const navigate = useNavigate();

	const [errorUsernameLoginMessage, setErrorUsernameLoginMessage] = useState('');
	const [errorPasswordLoginMessage, setErrorPasswordLoginMessage] = useState('');

	const [usernameIncorrectLogin, setUsernameIncorrectLogin] = useState(false);
	const [passwordIncorrectLogin, setPasswordIncorrectLogin] = useState(false);

	const handleLoginUsernameError = (message, value) => {
		setUsernameIncorrectLogin(value);
		setErrorUsernameLoginMessage(message);
	};
	const handleLoginPasswordError = (message, value) => {
		setPasswordIncorrectLogin(value);
		setErrorPasswordLoginMessage(message);
	};

	const handleBoolFalse = () => {
		setUsernameIncorrectLogin(false);
		setPasswordIncorrectLogin(false);
		setErrorUsernameLoginMessage('');
		setErrorPasswordLoginMessage('');
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		handleBoolFalse();

		toast.promise(
			axios.post(`${window.apiUrl}/api/auth/login`, {
				username,
				password,
			}),
			{
				loading: 'Logging in...', // Сообщение о загрузке
				success: (response) => {
					const data = response.data;
					const expiresDate = new Date();
					expiresDate.setDate(expiresDate.getDate() + 3000);
					document.cookie = `cook=${data.token}; path=/; expires=${expiresDate.toUTCString()}`;
					setIsAuthenticated(true);
					navigate('/');
					return 'Вход прошел успешно'; // Сообщение об успешной регистрации
				},
				error: (error) => {
					if (error.response && error.response.status === 400) {
						const errors = error.response.data;
						let errorMessage = '';
						if (errors.Username != null) {
							handleLoginUsernameError(errors.Username.join("\n"), true);
							errorMessage += 'Username error\n';
						}
						if (errors.Password != null) {
							handleLoginPasswordError(errors.Password.join("\n"), true);
							errorMessage += 'Password error\n';
						}
						return "Ошибка"; // Сообщение об ошибке
					}
					if (error.response && error.response.status === 403) {
						handleLoginPasswordError('Неправильный пароль', true);
						return 'Неправильный пароль'; // Сообщение об ошибке
					}
					if (error.response && error.response.status === 401) {
						handleLoginUsernameError('Вы не подтвердили почту', true);
						return 'Вы не подтвердили почту'; // Сообщение об ошибке
					}
					return 'Unknown error'; // Сообщение об ошибке
				},
				duration: 20000,
			}
		);
	};

	return (
		<div>
			<Toaster
				position="top-right"
			/>
			<div className={classes.register__container}>
				<div className={classes.register__box}>
					<h2 className={classes.register__heading}>Вход</h2>
					<form onSubmit={handleSubmit} className={classes.register__form}>
						<input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Имя пользователя" />
						<ErrorAlert message={errorUsernameLoginMessage} onClose={() => setUsernameIncorrectLogin(false)} isOpen={usernameIncorrectLogin} />
						<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Пароль" />
						<ErrorAlert message={errorPasswordLoginMessage} onClose={() => setPasswordIncorrectLogin(false)} isOpen={passwordIncorrectLogin} />
						<button type="submit">Войти</button>
					</form>
					<Link to="/register" className={classes.link}>
						Нет аккаунта?
					</Link>{' '}
					<br />
					<Link to="/forgot-password" className={classes.link}>
						Забыли пароль?
					</Link>
				</div>
			</div>
		</div>
	);
};

export default LoginPage;
