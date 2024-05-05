import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ForgotPasswordPage = () => {
    const navigateTo = useNavigate();
    const [email, setEmail] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [message, setMessage] = useState(""); // Устанавливаем значение true, чтобы отобразить форму

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
                if(errors.message != null)
                    setErrorMessage(errors.message);

            }
            if (error.response && error.response.status === 400)
            {
                const errors = error.response.data;
                if(errors.message != null)
                    setErrorMessage(errors.message);
            }
        }
    };
    if(message) 
    {
        return (
            <div>
                <h2>{message}</h2>
                <button onClick={() => navigateTo("/login")}>Вход</button>
            </div>
        );
    }
    else
    {
        return (
            <div>
                <h2>Forgot Password</h2>
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                />
                {errorMessage && <p>{errorMessage}</p>}
                <button onClick={sendLetter}>Отправить письмо</button>
                <button onClick={() => navigateTo("/login")}>Вход</button>
            </div>
        );
    }

};

export default ForgotPasswordPage;
