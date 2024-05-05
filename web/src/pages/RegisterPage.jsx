import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [registerSuccess, setRegisterSuccess] = useState(false);
    const navigate = useNavigate();

    const [usernameIncorrectLogin, setUsernameIncorrectLogin] = useState(false);
    const [passwordIncorrectLogin, setPasswordIncorrectLogin] = useState(false);

    const [usernameIncorrectRegister, setUsernameIncorrectRegister] = useState(false);
    const [emailIncorrectRegister, setEmailIncorrectRegister] = useState(false);
    const [passwordIncorrectRegister, setPasswordIncorrectRegister] = useState(false);

    const [errorUsernameRegisterMessage, setErrorUsernameRegisterMessage] = useState("");
    const [errorEmailRegisterMessage, setErrorEmailRegisterMessage] = useState("");
    const [errorPasswordRegisterMessage, setErrorPasswordRegisterMessage] = useState("");
    const handleRegisterUsernameError = (message, value) => {
        setUsernameIncorrectRegister(value);
        setErrorUsernameRegisterMessage(message);
    }

    const handleRegisterEmailError = (message, value) => {
        setEmailIncorrectRegister(value);
        setErrorEmailRegisterMessage(message);
    }

    const handleRegisterPasswordError = (message, value) => {
        setPasswordIncorrectRegister(value);
        setErrorPasswordRegisterMessage(message);
    }
    const handleBoolFalse = () => 
    {
        setUsernameIncorrectRegister(false);
        setEmailIncorrectRegister(false);
        setPasswordIncorrectRegister(false);
        setErrorUsernameRegisterMessage("");
        setErrorEmailRegisterMessage("");
        setErrorPasswordRegisterMessage("");    
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        handleBoolFalse();
        try {
            const response = await axios.post('http://localhost:5177/api/auth/register', {
                username,
                email,
                password,
                confirmPassword
            });

            if (response.status === 200) {
                setRegisterSuccess(true);
            }
        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data;
                console.log(errors);
                if (errors.Username != null) {
                    handleRegisterUsernameError(errors.Username, true);
                }
                if (errors.Email != null) {
                    handleRegisterEmailError(errors.Email, true);
                }
                if (errors.Password != null) {
                    handleRegisterPasswordError(errors.Password, true);
                }
            }
        }
    }
    if(registerSuccess)
    {
        return (
            <div>
                <h2>Регистрация прошла успешно, пожалуйста, проверьте вашу почту для активации аккаунта</h2>
            </div>
        );
    }
    return (
        <div>
            <h2>Register</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <input type="text" placeholder="Username" value={username} onChange={(e) => setUsername(e.target.value)} />
                    {usernameIncorrectRegister && <span className="error">{errorUsernameRegisterMessage}</span>}
                </div>
                <div>
                    <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    {emailIncorrectRegister && <span className="error">{errorEmailRegisterMessage}</span>}
                </div>
                <div>
                    <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    {passwordIncorrectRegister && <span className="error">{errorPasswordRegisterMessage}</span>}
                </div>
                <div>
                    <input type="password" placeholder="Confirm Password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </div>
                <button type="submit">Register</button>
            </form>
            <Link to="/login">Уже зарегистрированы?</Link>
        </div>
    );

};

export default RegisterPage;
