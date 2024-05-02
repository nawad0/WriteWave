import React, { useState, useEffect } from 'react';
import {useNavigate} from "react-router-dom";

const AdminPage = () => {
    const [articles, setArticles] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [totalCount, setTotalCount] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:5177/api/article/moderation?pageSize=10&pageNumber=${pageNumber}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setArticles(data.articles);
                setTotalCount(data.totalCount);
            })
            .catch(error => console.error('Error fetching moderation articles:', error));
    }, [pageNumber]);

    const handlePageChange = (newPageNumber) => {
        setPageNumber(newPageNumber);
    };
    const navigate = useNavigate();

    const handleViewArticle = (articleId) => {
        navigate(`/admin/article/${articleId}`);
    };

    return (
        <div>
            <h1>Admin Page</h1>
            <div>
                <h2>Moderation Articles</h2>
                <ul>
                    {articles.map(article => (
                        <li key={article.articleId}>
                            <p>Title: {article.title}</p>
                            <p>Content: {article.content}</p>
                            <button onClick={() => handleViewArticle(article.articleId)}>
                                View Article
                            </button>
                        </li>
                    ))}
                </ul>

            </div>
        </div>
    );
};

export default AdminPage;
