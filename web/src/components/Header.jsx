import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = ({ isAuthenticated, setIsAuthenticated, isAdmin }) => {
    const navigate = useNavigate();

    const handleLogout = () => {
        document.cookie = 'cook=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
        setIsAuthenticated(false);
        navigate('/register');
    };

    return (
        <header>
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
                    {isAdmin && (
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
                                <Link to="/my-articles">Твои статьи</Link>
                            </li>
                            <li>
                                <Link to="/profile">Профиль</Link>
                            </li>
                            <li>
                                <button onClick={handleLogout}>Выход</button>
                            </li>
                        </>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
