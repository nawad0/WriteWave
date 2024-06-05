import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import classes from './Header.module.css';

const Header = ({ isAuthenticated, setIsAuthenticated, isAdmin }) => {
	const navigate = useNavigate();

	const handleLogout = () => {
		document.cookie = 'cook=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
		setIsAuthenticated(false);
		navigate('/register');
	};

	return (
		<header className={classes.header}>
			<nav>
				<ul>
					{!isAuthenticated && (
						<>
							<li>
								<Link to="/login">Логин</Link>
							</li>
							<li>
								<Link to="/register">Регистрация</Link>
							</li>
						</>
					)}
					{isAuthenticated && isAdmin && (
						<li>
							<Link to="/admin">Админ панель</Link>
						</li>
					)}
					{isAuthenticated && (
						<>
							<li>
								<Link to="/">Главная</Link>
							</li>
							<li>
								<Link to="/my-articles">Мои статьи</Link>
							</li>
							<li className={classes.li}>
								<Link to="/profile">Профиль</Link>
							</li>
							<li className={classes.li}>
								<Link to="/chats">Чаты</Link>
							</li>
						</>
					)}
				</ul>
			</nav>
			{isAuthenticated && (
				<button className={classes.button} onClick={handleLogout}>
					Выход
				</button>
			)}
		</header>
	);
};

export default Header;
