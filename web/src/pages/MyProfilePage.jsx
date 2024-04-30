import React, { useState, useEffect } from 'react';

const MyProfilePage = () => {
    const [user, setUser] = useState(null);
    const [subscriptions, setSubscriptions] = useState([]);
    const [subscribers, setSubscribers] = useState([]);
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        userImage: null
    });
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        fetch('http://localhost:5177/api/user', {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setUser(data.user);
                // Load user data into form fields
                setFormData({
                    username: data.user.username,
                    email: data.user.email,
                    userImage: null // Assuming you don't want to change the user image by default
                });
                // Fetch subscriptions and subscribers
                fetchUserData(data.user.userId);
            })
            .catch(error => console.error('Error fetching user data:', error));
    }, [isEditing]);

    const fetchUserData = (userId) => {
        // Fetch subscriptions
        fetch(`http://localhost:5177/api/user/subscriptions/${userId}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setSubscriptions(data.subscriptions);
            })
            .catch(error => console.error('Error fetching user subscriptions:', error));

        // Fetch subscribers
        fetch(`http://localhost:5177/api/user/subscribers/${userId}`, {
            method: 'GET',
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => {
                setSubscribers(data.subscribers);
            })
            .catch(error => console.error('Error fetching user subscribers:', error));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        setFormData(prevState => ({
            ...prevState,
            userImage: file
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const formDataToSend = new FormData();
        formDataToSend.append('Username', formData.username);
        formDataToSend.append('Email', formData.email);
        if (formData.userImage) {
            formDataToSend.append('UserImage', formData.userImage);
        }

        fetch('http://localhost:5177/api/user', {
            method: 'PUT',
            credentials: 'include',
            body: formDataToSend
        })
            .then(response => {
                if (response.ok) {
                    setIsEditing(false); // Hide the form after successful submission
                } else {
                    // Handle error response
                    throw new Error('Failed to update user data');
                }
            })
            .catch(error => console.error('Error updating user data:', error));
    };

    return (
        <div>
            <h1>My Profile</h1>
            {!isEditing && user && (
                <div>
                    <p>Username: {user.username}</p>
                    <p>Email: {user.email}</p>
                    {user.userImage && (
                        <img
                            src={"http://localhost:9000/writewave/" + user.userImage}
                            alt="User Avatar"
                            style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                        />
                    )}
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}

            {isEditing && (
                <form onSubmit={handleSubmit}>
                    <label>
                        Username:
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        Email:
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                        />
                    </label>
                    <br />
                    <label>
                        User Image:
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </label>
                    <br />
                    <button type="submit">Save Changes</button>
                    <button onClick={() => setIsEditing(false)}>Cancel</button>
                </form>
            )}

            <h2>Subscriptions</h2>
            <ul>
                {subscriptions.map(subscription => (
                    <li key={subscription.userId}>
                        <p>Username: {subscription.username}</p>
                        <p>Email: {subscription.email}</p>
                        {subscription.userImage && (
                            <img
                                src={"http://localhost:9000/writewave/" + subscription.userImage}
                                alt="Subscription Avatar"
                                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                            />
                        )}
                    </li>
                ))}
            </ul>
            <h2>Subscribers</h2>
            <ul>
                {subscribers.map(subscription => (
                    <li key={subscription.userId}>
                        <p>Username: {subscription.username}</p>
                        <p>Email: {subscription.email}</p>
                        {subscription.userImage && (
                            <img
                                src={"http://localhost:9000/writewave/" + subscription.userImage}
                                alt="Subscription Avatar"
                                style={{ width: '50px', height: '50px', borderRadius: '50%' }}
                            />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default MyProfilePage;
