import logo from './logo.svg';

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
function App() {
  return (
      <Router>
          <Header />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create-article" element={<CreateArticlePage />}/>
            <Route path="/profile" element={<MyProfilePage />}/>
            <Route path="/my-articles" element={<MyArticlesPage />}/>
            <Route path="/article/:articleId" element={<ArticlePage />}/>
            <Route path="/profile/:userId" element={<ProfilePage />}/>
            <Route path="/update-article/:articleId" element={<UpdateArticlePage />}/>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
      </Router>
  );
}

export default App;
