import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";

const ResetPasswordPage = () => {
    const navigateTo = useNavigate();
    const { token } = useParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [resetted, setResetted] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrorMessage("");
        console.log(token, password, confirmPassword);
        try {
            const response = await axios.post("http://localhost:5177/api/auth/reset-password", {
                token,
                password,
                confirmPassword
            });

            if (response.status === 200) {
                setErrorMessage("");
                setResetted(true);
            } else {
                setErrorMessage("Password not changed");
            }

        } catch (error) {
            if (error.response && error.response.status === 400) {
                const errors = error.response.data;
                if (errors.Password != null) {
                    setErrorMessage(errors.Password);
                }
                else if(errors.Token != null)
                {
                    setErrorMessage(errors.Token);
                }else
                {
                    setErrorMessage("Ошибка при смене пароля");
                }
                
            }
            if (error.response && error.response.status === 404) {
                setErrorMessage("Такой ссылки не существует, или пользователь уже восстановил пароль");
            }
            if (error.response && error.response.status === 403) {
                setErrorMessage("Срок дейтсвия ссылки истек или не существует");
            }
        }
    };
    if(resetted)
    {
        return (
            <div>
                <h2>Пароль успешно изменен</h2>
                <button onClick={() => navigateTo("/login")}>Вход</button>
            </div>
        );
    }
    else
    {
        return (
            <div>
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter new password"
                    />
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder="Confirm new password"
                    />
                    {errorMessage && <p>{errorMessage}</p>}
                    <button type="submit">Reset Password</button>
                </form>
            </div>
        );
    }
};

export default ResetPasswordPage;
