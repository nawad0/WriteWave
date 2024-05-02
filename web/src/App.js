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
function App() {
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
    if (isAdmin) {
        return (
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-article" element={<CreateArticlePage />} />
                    <Route path="/profile" element={<MyProfilePage />} />
                    <Route path="/admin" element={<AdminPage />} />
                    <Route path="/my-articles" element={<MyArticlesPage />} />
                    <Route path="/article/:articleId" element={<ArticlePage />} />
                    <Route path="/admin/article/:articleId" element={<AdminArticlePage />} />
                    <Route path="/profile/:userId" element={<ProfilePage />} />
                    <Route path="/update-article/:articleId" element={<UpdateArticlePage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        );
    } else {
        return (
            <Router>
                <Header />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/create-article" element={<CreateArticlePage />} />
                    <Route path="/profile" element={<MyProfilePage />} />
                    <Route path="/my-articles" element={<MyArticlesPage />} />
                    <Route path="/article/:articleId" element={<ArticlePage />} />
                    <Route path="/profile/:userId" element={<ProfilePage />} />
                    <Route path="/update-article/:articleId" element={<UpdateArticlePage />} />
                    <Route path="*" element={<Navigate to="/" />} />
                </Routes>
            </Router>
        );
    }
}

export default App;
