import {useEffect} from "react";
import './App.css';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Home from './pages/home'; 
import Header from './components/Header';
import ArticlePage from './pages/ArticlePage'; 
import MyArticlesPage from './pages/MyArticlesPage';
import CreateArticlePage from './pages/CreateArticlePage';
import UpdateArticlePage from './pages/UpdateArticlePage';
import MyProfilePage from './pages/MyProfilePage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/AdminPage';
import AdminArticlePage from './pages/AdminArticlePage';
import {useState} from "react";
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import ConfirmEmailPage from './pages/ConfirmEmailPage';
function App() {
    const [isAdmin, setIsAdmin] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    useEffect(() => {
        fetch(`${window.apiUrl}/Admin/current`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setIsAdmin(data.role === 'Admin');
            })
            .catch(error => console.error('Error fetching user info:', error));

    }, [isAuthenticated]);
    
    const getAuthToken = () => {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.startsWith('cook=')) {
                return cookie.substring(5); 
            }
        }
        return null; 
    };
    useEffect(() => {
        const token = getAuthToken(); 
        setIsAuthenticated(!!token);
    }, [isAuthenticated]);
    
    
    
    return (
        <Router>
            <Header setIsAuthenticated={setIsAuthenticated} isAuthenticated={isAuthenticated} isAdmin={isAdmin}/>
            <Routes>
                {isAuthenticated ? (
                    <>
                        <Route path="/" element={<Home />} />
                        <Route path="/create-article" element={<CreateArticlePage />} />
                        <Route path="/profile" element={<MyProfilePage />} />
                        {isAdmin && <Route path="/admin" element={<AdminPage />} />}
                        <Route path="/my-articles" element={<MyArticlesPage />} />
                        <Route path="/article/:articleId" element={<ArticlePage />} />
                        {isAdmin && <Route path="/admin/article/:articleId" element={<AdminArticlePage />} />}
                        <Route path="/profile/:userId" element={<ProfilePage />} />
                        <Route path="/update-article/:articleId" element={<UpdateArticlePage />} />
                        <Route path="*" element={<Navigate to="/" />} />
                    </>
                ) : (
                    <>
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/login" element={<LoginPage setIsAuthenticated = {setIsAuthenticated} />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
                        <Route path="/confirm-email/:token" element={<ConfirmEmailPage />} />
                        <Route path="*" element={<Navigate to="/register" />} />
                    </>
                )}
            </Routes>
        </Router>
    );
}

export default App;
