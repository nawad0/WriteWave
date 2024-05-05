import React, { useState } from 'react';
import {Link, useNavigate} from "react-router-dom";
import  axios from 'axios';
const LoginPage = ({setIsAuthenticated}) => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const [errorUsernameLoginMessage, setErrorUsernameLoginMessage] = useState("");
    const [errorPasswordLoginMessage, setErrorPasswordLoginMessage] = useState("");

    const [usernameIncorrectLogin, setUsernameIncorrectLogin] = useState(false);
    const [passwordIncorrectLogin, setPasswordIncorrectLogin] = useState(false);

    const handleLoginUsernameError = (message, value) => {
        setUsernameIncorrectLogin(value);
        setErrorUsernameLoginMessage(message);
    }
    const handleLoginPasswordError = (message, value) => {
        setPasswordIncorrectLogin(value);
        setErrorPasswordLoginMessage(message);
    }
    
    const handleBoolFalse = () => {
        setUsernameIncorrectLogin(false);
        setPasswordIncorrectLogin(false);
        setErrorUsernameLoginMessage("");
        setErrorPasswordLoginMessage("");
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        handleBoolFalse();
        try {
            const response = await axios.post('http://localhost:5177/api/auth/login', {
                username,
                password
            });

            const data = response.data;
            const status = response.status;
            console.log(status);

            if (status === 200) {
                const expiresDate = new Date();
                expiresDate.setDate(expiresDate.getDate() + 3000);
                document.cookie = `cook=${data.token}; path=/; expires=${expiresDate.toUTCString()}`;
                setIsAuthenticated(true);
                navigate("/");
            }

        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data;
                if (errors.Username != null) {
                    handleLoginUsernameError(errors.Username, true);
                }
                if (errors.Password != null) {
                    handleLoginPasswordError(errors.Password, true);
                }
            }
            if (error.response && error.response.status === 403)
            {
                handleLoginPasswordError("Неправильный пароль", true);
            }
            if (error.response && error.response.status === 401)
            {
                handleLoginUsernameError("Вы не потвердили почту", true);
            }
        }
    };


    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="Username"
                />
                {usernameIncorrectLogin && <span className="error">{errorUsernameLoginMessage}</span>}
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                />
                {passwordIncorrectLogin && <span className="error">{errorPasswordLoginMessage}</span>}
                <button type="submit">Login</button>
            </form>
            <Link to="/register">Нет аккаунта?</Link>
            <Link to="/forgot-password">Забыли пароль?</Link>
        </div>
    );
};

export default LoginPage;
