import React, { useState, useEffect } from 'react';
import classes from './MyProfilePgae.module.css';
import {
	Avatar,
	Button,
	Dialog,
	DialogActions,
	DialogContent,
	DialogTitle,
	List,
	ListItem,
	ListItemText
} from "@mui/material";

const MyProfilePage = () => {
	const [user, setUser] = useState(null);
	const [subscriptions, setSubscriptions] = useState([]);
	const [subscribers, setSubscribers] = useState([]);
	const [formData, setFormData] = useState({
		username: '',
		email: '',
		userImage: null,
	});
	const [isEditing, setIsEditing] = useState(false);
	const [openSubscriptions, setOpenSubscriptions] = useState(false);
	const [openSubscribers, setOpenSubscribers] = useState(false);
	useEffect(() => {
		fetch('http://localhost:5177/api/user', {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setUser(data.user);
				// Load user data into form fields
				setFormData({
					username: data.user.username,
					email: data.user.email,
					userImage: null, // Assuming you don't want to change the user image by default
				});
				// Fetch subscriptions and subscribers
				fetchUserData(data.user.userId);
			})
			.catch((error) => console.error('Error fetching user data:', error));
	}, [isEditing]);

	const fetchUserData = (userId) => {
		// Fetch subscriptions
		fetch(`http://localhost:5177/api/user/subscriptions/${userId}`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setSubscriptions(data.subscriptions);
			})
			.catch((error) => console.error('Error fetching user subscriptions:', error));

		// Fetch subscribers
		fetch(`http://localhost:5177/api/user/subscribers/${userId}`, {
			method: 'GET',
			credentials: 'include',
		})
			.then((response) => response.json())
			.then((data) => {
				setSubscribers(data.subscribers);
			})
			.catch((error) => console.error('Error fetching user subscribers:', error));
	};

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData((prevState) => ({
			...prevState,
			[name]: value,
		}));
	};

	const handleImageChange = (e) => {
		const file = e.target.files[0];
		setFormData((prevState) => ({
			...prevState,
			userImage: file,
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
			body: formDataToSend,
		})
			.then((response) => {
				if (response.ok) {
					setIsEditing(false); // Hide the form after successful submission
				} else {
					// Handle error response
					throw new Error('Failed to update user data');
				}
			})
			.catch((error) => console.error('Error updating user data:', error));
	};

	return (
		<div className={classes.container}>
			<div className={classes['profile-card']}>
				<div className={classes['profile-info']}>
					{!isEditing && user && (
						<div>
							<img src={'http://localhost:9000/writewave/' + user.userImage} alt="User Avatar" />
							<div className={classes['profile-data']}>
								<p className={classes.name}> {user.username}</p>
								<p className={classes.email}> {user.email}</p>
								<button onClick={() => setIsEditing(true)}>Редактировать</button>
							</div>
						</div>
					)}

					{isEditing && (
						<form onSubmit={handleSubmit}>
							<div className={classes['profile-data']}>
								<label>Имя пользователя:</label>
								<input type="text" name="username" value={formData.username} onChange={handleInputChange} />
								<label>Email:</label>
								<input type="email" name="email" value={formData.email} onChange={handleInputChange} />
								<label>Фотография пользователя:</label>
								<input type="file" accept="image/*" onChange={handleImageChange} />
								<button type="submit">Сохранить изменения</button>
								<button onClick={() => setIsEditing(false)} className={classes.cancel}>
									{' '}
									Закрыть
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
			<Button style={{ margin: '20px' }} variant="contained" color="primary" onClick={() => setOpenSubscriptions(true)}>Подписки</Button>
			<Dialog open={openSubscriptions} onClose={() => setOpenSubscriptions(false)}>
				<DialogTitle>Подписки</DialogTitle>
				<DialogContent>
					<List>
						{subscriptions.map((subscription) => (
							<ListItem key={subscription.userId}>
								<ListItemText primary={subscription.username} secondary={subscription.email} />
								{subscription.userImage && (
									<Avatar src={'http://localhost:9000/writewave/' + subscription.userImage} />
								)}
							</ListItem>
						))}
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenSubscriptions(false)} color="primary">Закрыть</Button>
				</DialogActions>
			</Dialog>

			<Button variant="contained" color="primary" onClick={() => setOpenSubscribers(true)}>Подписчики</Button>
			<Dialog open={openSubscribers} onClose={() => setOpenSubscribers(false)}>
				<DialogTitle>Подписчики</DialogTitle>
				<DialogContent>
					<List>
						{subscribers.map((subscriber) => (
							<ListItem key={subscriber.userId}>
								<ListItemText primary={subscriber.username} secondary={subscriber.email} />
								{subscriber.userImage && (
									<Avatar src={'http://localhost:9000/writewave/' + subscriber.userImage} />
								)}
							</ListItem>
						))}
					</List>
				</DialogContent>
				<DialogActions>
					<Button onClick={() => setOpenSubscribers(false)} color="primary">Закрыть</Button>
				</DialogActions>
			</Dialog>
		</div>
	);
};

export default MyProfilePage;
