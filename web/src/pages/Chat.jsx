import React, { useState, useEffect, useRef } from 'react';
import * as signalR from '@microsoft/signalr';
import { useLocation } from 'react-router-dom';
import { format, parseISO } from 'date-fns';

const Chat = () => {
    const location = useLocation();
    const { userName, userId, otherUserId } = location.state;
    const [connection, setConnection] = useState(null);
    const [message, setMessage] = useState('');
    const [username, SetUsername] = useState('');
    const [messages, setMessages] = useState([]);
    const messagesEndRef = useRef(null);

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

                    connection.on('ReceiveMessage', (mes) => {
                        setMessages(messages => [...messages, mes]);
                    });

                    connection.on('LoadMessages', (loadedMessages, username) => {
                        setMessages(loadedMessages);
                        SetUsername(username);
                        console.log(username);
                        scrollToBottom(); // Прокрутить вниз после загрузки сообщений
                    });

                    connection.invoke('JoinChat', { UserId: parseInt(userId), UserName: userName }, parseInt(otherUserId))
                        .catch(err => console.error('JoinChat failed: ', err));
                })
                .catch(e => console.log('Connection failed: ', e));
        }
    }, [connection]);

    const sendMessage = async () => {
        if (connection) {
            try {
                await connection.invoke('SendMessage', parseInt(otherUserId), message);
                setMessage('');
            } catch (e) {
                console.error(e);
            }
        } else {
            alert('No connection to server yet.');
        }
    };

    useEffect(() => {
        scrollToBottom(); // Прокрутить вниз после обновления сообщений
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <div className="container mx-auto p-4 max-w-2xl">
            <h1 className="text-3xl font-bold mb-6 text-center">Чат c {username}</h1>
            <div className="bg-white shadow-md rounded-lg p-6 mb-6 h-96 overflow-y-auto">
                {messages.map((m, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex items-center mb-1">
                            <img className=" rounded-full w-8 h-8 flex items-center justify-center mr-2" src={`${window.minioUrl}/writewave/${m.userImage}`} alt="User Avatar"/>
                            <strong>{m.userName}</strong>
                            <span className="text-xs text-gray-500 ml-2">
                                {new Date(m.sentAt).toLocaleString()}
                            </span>
                        </div>
                        <div className="ml-10 p-2 bg-gray-100 rounded-lg">
                            {m.message}
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="flex items-center space-x-4">
                <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Твое сообщение..."
                    className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                    onClick={sendMessage}
                    className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
                >
                    Отправить
                </button>
            </div>
        </div>
    );
};

export default Chat;
