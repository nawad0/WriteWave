import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import classes from './FrogotParrword.module.css';
import ErrorAlert from '../components/ErrorAllert';

const ForgotPasswordPage = () => {
	const navigateTo = useNavigate();
	const [email, setEmail] = useState('');
	const [errorMessage, setErrorMessage] = useState('');
	const [message, setMessage] = useState(''); // Устанавливаем значение true, чтобы отобразить форму

	const sendLetter = async () => {
		try {
			const response = await axios.post(`http://localhost:5177/api/auth/forgot-password?email=${email}`);
			const data = response.data;
			const status = response.status;

			if (status === 200) {
				setMessage(data.message);
				console.log(data.message);
			}
		} catch (error) {
			if (error.response && error.response.status === 404) {
				const errors = error.response.data;
				if (errors.message != null) setErrorMessage(errors.message);
			}
			if (error.response && error.response.status === 400) {
				const errors = error.response.data;
				if (errors.message != null) setErrorMessage(errors.message);
			}
		}
	};
	if (message) {
		return (
			<div className={classes.box}>
				<h2 className={classes.heading}>{message}</h2>
				<button onClick={() => navigateTo('/login')}>Вход</button>
			</div>
		);
	} else {
		return (
			<div>
				<div className={classes.register__container}>
					<div className={classes.register__box}>
						<h2 className={classes.register__heading}>Восстановление пароля</h2>
						<input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Введите свой email" />
						<ErrorAlert message={errorMessage} isOpen={errorMessage} onClose={() => setErrorMessage('')} />
						<button onClick={sendLetter} className={classes.button}>
							Отправить письмо
						</button>{' '}
						<br />
						<button className={classes.button1} onClick={() => navigateTo('/login')}>
							Вход
						</button>
					</div>
				</div>
			</div>
		);
	}
};

export default ForgotPasswordPage;
