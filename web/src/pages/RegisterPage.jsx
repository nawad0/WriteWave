import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';// Импортируем toast из библиотеки
import ErrorAlert from '../components/ErrorAllert';
import classes from './RegisterPage.module.css';
const RegisterPage = () => {
	const navigate = useNavigate();
	const [username, setUsername] = useState('');
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [registerSuccess, setRegisterSuccess] = useState(false);
	const [usernameIncorrectRegister, setUsernameIncorrectRegister] = useState(false);
	const [emailIncorrectRegister, setEmailIncorrectRegister] = useState(false);
	const [passwordIncorrectRegister, setPasswordIncorrectRegister] = useState(false);
	const [errorUsernameRegisterMessage, setErrorUsernameRegisterMessage] = useState('');
	const [errorEmailRegisterMessage, setErrorEmailRegisterMessage] = useState('');
	const [errorPasswordRegisterMessage, setErrorPasswordRegisterMessage] = useState('');

	const handleRegisterUsernameError = (message, value) => {
		setUsernameIncorrectRegister(value);
		setErrorUsernameRegisterMessage(message);
	};

	const handleRegisterEmailError = (message, value) => {
		setEmailIncorrectRegister(value);
		setErrorEmailRegisterMessage(message);
	};

	const handleRegisterPasswordError = (message, value) => {
		setPasswordIncorrectRegister(value);
		setErrorPasswordRegisterMessage(message);
	};

	const handleBoolFalse = () => {
		setUsernameIncorrectRegister(false);
		setEmailIncorrectRegister(false);
		setPasswordIncorrectRegister(false);
		setErrorUsernameRegisterMessage('');
		setErrorEmailRegisterMessage('');
		setErrorPasswordRegisterMessage('');
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		handleBoolFalse();

		toast.promise(
			axios.post(`${window.apiUrl}/api/auth/register`, {
				username,
				email,
				password,
				confirmPassword,
			}),
			{
				loading: 'Регистрация...', // Сообщение о загрузке
				success: (response) => {
					setRegisterSuccess(true);
					navigate('/login');
					return 'Регистрация прошла успешно, пожалуйста, проверьте вашу почту для активации аккаунта'; // Сообщение об успешной регистрации
				},
				error: (error) => {
					if (error.response && error.response.status === 400) {
						const errors = error.response.data;
						
						if (errors.Username != null) {
							handleRegisterUsernameError(errors.Username.join('\n'), true);
							
						}
						if (errors.Email != null) {
							handleRegisterEmailError(errors.Email.join('\n'), true);
							
						}
						if (errors.Password != null) {
							handleRegisterPasswordError(errors.Password.join('\n'), true);
							
						}
						return 'Ошибка'; // Сообщение об ошибке
					}
					return 'Ошибка'; // Сообщение об ошибке
				}
			}
		);
	};
	
	return (
		<div>
			<Toaster
				position="top-right"
				reverseOrder={true}
			/>
			<div className={classes.register__container}>
				<div className={classes.register__box}>
					<h2 className={classes.register__heading}>Регистрация</h2>
					<form className={classes.register__form} onSubmit={handleSubmit}>
						<div>
							<input type="text" placeholder="Имя пользователя" value={username}
								   onChange={(e) => setUsername(e.target.value)}/>
							<ErrorAlert message={errorUsernameRegisterMessage} isOpen={usernameIncorrectRegister}
										onClose={() => setUsernameIncorrectRegister(false)}/>
						</div>
						<div>
							<input type="text" placeholder="Email" value={email}
								   onChange={(e) => setEmail(e.target.value)}/>
							<ErrorAlert message={errorEmailRegisterMessage} isOpen={emailIncorrectRegister}
										onClose={() => setEmailIncorrectRegister(false)}/>
						</div>
						<div>
							<input type="password" placeholder="Пароль" value={password}
								   onChange={(e) => setPassword(e.target.value)}/>
							<ErrorAlert message={errorPasswordRegisterMessage} isOpen={passwordIncorrectRegister}
										onClose={() => setPasswordIncorrectRegister(false)}/>
						</div>
						<div>
							<input type="password" placeholder="Подтвердите пароль" value={confirmPassword}
								   onChange={(e) => setConfirmPassword(e.target.value)}/>
						</div>
						<button type="submit">Зарегистрироваться</button>
					</form>
					<Link to="/login" className={classes.link}>
						Уже зарегистрированы?
					</Link>

				</div>
			</div>
		</div>
	);
};

export default RegisterPage;
