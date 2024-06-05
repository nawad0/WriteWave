import React, { useState, useEffect } from 'react';
import * as signalR from '@microsoft/signalr';
import { useNavigate } from 'react-router-dom';

const ChatsPage = ({user}) => {
    const [connection, setConnection] = useState(null);
    const [chats, setChats] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const newConnection = new signalR.HubConnectionBuilder()
            .withUrl(`${window.apiUrl}/api/chat`)
            .withAutomaticReconnect()
            .build();

        setConnection(newConnection);
    }, []);

    useEffect(() => {
        if (connection) {
            connection.start()
                .then(result => {
                    console.log('Connected!');

                    connection.on('LoadChatsWithLatestMessages', (loadedChats) => {
                        setChats(loadedChats);
                    });

                    const currentUserId = user.userId; // Replace with actual current user ID
                    connection.invoke('GetAllChatsWithLatestMessages', currentUserId)
                        .catch(err => console.error('GetAllChatsWithLatestMessages failed: ', err));
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const handleOpenChat = (chatId, userName, userId) => {
        navigate('/chat', { state: { userName: user.username, userId: user.userId, otherUserId: chatId } });
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-2xl font-bold mb-4">Мои чаты</h1>
            <div className="space-y-4">
                {chats.map((chat) => (
                    <div
                        key={chat.chatId}
                        className="p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-100"
                        onClick={() => handleOpenChat(chat.userId, chat.userName, chat.userId)}
                    >
                        <div className="text-lg font-semibold">{chat.userName}</div>
                        <div className="flex justify-between text-gray-600">
                            <span>{chat.latestMessage}</span>
                            <span className="text-sm text-gray-400">{new Date(chat.latestMessageSentAt).toLocaleString()}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ChatsPage;
