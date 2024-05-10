import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import classes from './ResertPassword.module.css';
import ErrorAlert from '../components/ErrorAllert';
const ResetPasswordPage = () => {
	const navigateTo = useNavigate();
	const { token } = useParams();
	const [password, setPassword] = useState('');
	const [confirmPassword, setConfirmPassword] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [resetted, setResetted] = useState(false);

	const handleSubmit = async (e) => {
		e.preventDefault();
		setErrorMessage('');
		console.log(token, password, confirmPassword);
		try {
			const response = await axios.post(`${window.apiUrl}/api/auth/reset-password`, {
				token,
				password,
				confirmPassword,
			});

			if (response.status === 200) {
				setErrorMessage('');
				setResetted(true);
			} else {
				setErrorMessage('Password not changed');
			}
		} catch (error) {
			if (error.response && error.response.status === 400) {
				const errors = error.response.data;
				if (errors.Password != null) {
					setErrorMessage(errors.Password.join('\n'));
				} else if (errors.Token != null) {
					setErrorMessage(errors.Token);
				} else {
					setErrorMessage('Ошибка при смене пароля');
				}
			}
			if (error.response && error.response.status === 404) {
				setErrorMessage('Такой ссылки не существует, или пользователь уже восстановил пароль');
			}
			if (error.response && error.response.status === 403) {
				setErrorMessage('Срок дейтсвия ссылки истек или не существует');
			}
		}
	};
	if (resetted) {
		return (
			<div className={classes.box}>
				<h2 className={classes.heading}>Пароль успешно изменен</h2>
				<button onClick={() => navigateTo('/login')}>Вход</button>
			</div>
		);
	} else {
		return (
			<div className={classes.register__box}>
				<h2 className={classes.register__heading}>Изменение пароля</h2>
				<form onSubmit={handleSubmit}>
					<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Введите новый пароль" />
					<input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Подтвердите новый пароль" />
					<ErrorAlert message={errorMessage} isOpen={errorMessage} onClose={() => setErrorMessage('')} />
					<button type="submit">Изменить пароль</button>
				</form>
			</div>
		);
	}
};

export default ResetPasswordPage;
