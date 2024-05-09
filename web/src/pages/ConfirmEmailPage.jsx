import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link} from 'react-router-dom';
import axios from 'axios';
import './Confirm.css'

const ConfirmEmailPage = () => {
    const navigate = useNavigate();
    const { token } = useParams();
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        const confirmEmail = async () => {
            try {
                const response = await axios.get(`${window.apiUrl}/api/auth/confirm-email?token=${token}`);
                const data = response.data;
                if (response.status === 200) {
                    setMessage(data.message);
                    }
                
            } catch (error) {
                if (error.response && error.response.status === 400)
                {
                    const errors = error.response.data;
                    if(errors.message != null)
                        setError(errors.message);
                }
            }
        };

        confirmEmail();
    }, [token]);

    return (
        <div>
            {message &&
                <div>
                <p className='a'>{message}</p>
                <Link to="/login">Вход</Link>
                </div>
            }
            {error && <p>{error}</p>}
        </div>
    );
};

export default ConfirmEmailPage;
