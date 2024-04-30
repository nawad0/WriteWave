import React, { useState, useEffect } from 'react';
import ArticleList from '../components/ArticleList';
import Pagination from '../components/Pagination';

const Home = () => {
    const [articles, setArticles] = useState([]);
    const [pageNumber, setPageNumber] = useState(1);
    const [userId, setUserId] = useState(0);
    const [totalCount, setTotalCount] = useState(0);
    const [selectedEndpoint, setSelectedEndpoint] = useState('http://localhost:5177/api/article/published');

    useEffect(() => {
      
            fetch(`${selectedEndpoint}?pageSize=3&pageNumber=${pageNumber}`, {
                method: 'GET',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(data => {
                    setArticles(data.articles);
                    setTotalCount(data.totalCount);
                    
                  
                })
                .catch(error => console.error('Error fetching data:', error)); 
            
            fetch('http://localhost:5177/api/user', {
                method: 'GET',
                credentials: 'include'
            })
                .then(response => response.json())
                .then(data => {
                    setUserId(data.user.userId);
                    
                  
                })
                .catch(error => console.error('Error fetching data:', error));
          
        
    }, [pageNumber, selectedEndpoint]);

    const handleLike = (articleId) => {
        fetch(`http://localhost:5177/api/article/like/${articleId}`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add like');
                }
                return response.json();
            })
            .then(data => {

                // Update the articles state to reflect the updated userLiked status and like count
                setArticles(prevArticles => {
                    return prevArticles.map(article => {
                        if (article.articleId === articleId) {
                            if(data.userLiked == true)
                            {
                                return {
                                    ...article,
                                    userLiked: true,
                                    likeCount: article.likeCount + 1
                                };
                            }
                            else
                            {
                                return {
                                    ...article,
                                    userLiked: false,
                                    likeCount: article.likeCount - 1
                                };
                            }

                        } else {
                            return article;
                        }
                    });
                });
            })
            .catch(error => console.error('Error liking article:', error));
    };
    const handleFavorite = (articleId) => {
        fetch(`http://localhost:5177/api/article/favorite/${articleId}`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to add like');
                }
                return response.json();
            })
            .then(data => {

                // Update the articles state to reflect the updated userLiked status and like count
                setArticles(prevArticles => {
                    return prevArticles.map(article => {
                        if (article.articleId === articleId) {
                            if(data.userFavorited == true)
                            {
                                return {
                                    ...article,
                                    userFavorited: true
                                };
                            }
                            else
                            {
                                return {
                                    ...article,
                                    userFavorited: false,
                                };
                            }

                        } else {
                            return article;
                        }
                    });
                });
            })
            .catch(error => console.error('Error favoriting article:', error));
    };
    const handleSubscribe = (articleId, userId) => {
        fetch(`http://localhost:5177/api/article/subscribe/${userId}`, {
            method: 'POST',
            credentials: 'include'
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to subscribe');
                }
                return response.json();
            })
            .then(data => {
                // Обновляем состояние статей, чтобы отразить обновленный статус подписки пользователя
                setArticles(prevArticles => {
                    return prevArticles.map(article => {
                        if (article.articleId === articleId) {
                            if(data.userSubscribed == true)
                            {
                                return {
                                    ...article,
                                    userSubscribed: true,
                                };
                            }
                            else
                            {
                                return {
                                    ...article,
                                    userSubscribed: false,
                                };
                            }
                        } else {
                            return article;
                        }
                    });
                });
            })
            .catch(error => console.error('Ошибка подписки на статью:', error));
    }
    // Функция для получения пользователя по запросу
    const handleGetUserByQuery = (query) => {
        fetch(`http://localhost:5177/api/user/${query}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setUserId(data.userId);
            })
            .catch(error => console.error('Error fetching data:', error));
    }
    

    const handlePageChange = (newPageNumber) => {
        setPageNumber(newPageNumber);
    };

    const handleEndpointChange = (endpoint) => {
        setSelectedEndpoint(endpoint)
        setPageNumber(1);
    };

    return (
        <div>
            <div>
                <button onClick={() => handleEndpointChange('http://localhost:5177/api/article/published')}>Published Articles</button>
                <button onClick={() => handleEndpointChange('http://localhost:5177/api/article/favorites')}>Favorite Articles</button>
                <button onClick={() => handleEndpointChange('http://localhost:5177/api/article/subscribed-articles')}>Subscribed Articles</button>
            </div>
            <ArticleList articles={articles} handleLike={handleLike} handleSubscribe = {handleSubscribe} userId = {userId} handleFavorite = {handleFavorite}/>
            <Pagination
                pageNumber={pageNumber}
                totalCount={totalCount}
                onPageChange={handlePageChange}
            />
        </div>
    );
};




export default Home;