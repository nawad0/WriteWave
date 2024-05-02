import React, {useEffect, useState} from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
    const [isAdmin, setIsAdmin] = useState(false);
    useEffect(() => {
        // Получаем информацию о текущем пользователе, включая его роль
        fetch('http://localhost:5177/Admin/current', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setIsAdmin(data.role === 'Admin');
            })
            .catch(error => console.error('Error fetching user info:', error));

    }, []);
    return (
        <header>
            <nav>
                <ul>
                    <li>
                        <Link to="/">Главная</Link>
                    </li>
                    <li>
                        <Link to="/my-articles">Твои статьи</Link>
                    </li>
                    <li>
                        <Link to="/profile">Профиль</Link>
                    </li>
                    {isAdmin && (
                        <li>
                            <Link to="/admin">Админ панель</Link>
                        </li>
                    )}
                </ul>
            </nav>
        </header>
    );
};

export default Header;
