import React, { useState, useEffect, useRef } from 'react';
import http from '../http';
import Cookies from 'js-cookie';
const ChatComponent = () => {
        const token = Cookies.get("access_token");
        const [users, setUsers] = useState([]);
        const [selectedUserId, setSelectedUserId] = useState(null);
        const [messages, setMessages] = useState([]);
        const [messageContent, setMessageContent] = useState('');
        const chatboxRef = useRef(null);

    useEffect(() => {
    fetchUsers();
    }, []); 

        useEffect(() => {
            if (users.length > 0) {
                setSelectedUserId(users[0].id); // Select the first user as the default selected user
                fetchMessages(users[0].id); // Fetch messages for the default selected user
                }
        }, [users]);

        useEffect(() => {
            // Scroll to the bottom of the chatbox when messages update
            if (chatboxRef.current) {
                chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
            }
            }, [messages]);
   
    
        const fetchUsers = async () => {
                try {
                const response = await http.get('/messages/list/users', {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                });
                const { data } = response;
                setUsers(data.users);
                console.log(data);
                fetchLastMessages(data.users);

                } catch (error) {
                console.log('Error fetching users:', error);
                }
            };

            const fetchLastMessages = async (users) => {
                try {
                    const lastMessagesPromises = users.map(async (user) => {
                        const response = await http.get(`/messages/last/${user.id}`, {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                        });
                        const { data } = response;
                        return { ...user, lastMessage: data.message };
                        
                    });
                    
                    const usersWithLastMessages = await Promise.all(lastMessagesPromises);
                    setUsers(usersWithLastMessages);
                    console.log(usersWithLastMessages);
                    } catch (error) {
                    console.log('Error fetching last messages:', error);
                    }
                };

                const fetchMessages = async (userId) => {
                    try {
                    const response = await http.get(`/messages/${userId}`, {
                        headers: {
                        Authorization: `Bearer ${token}`,
                        },
                    });
                    const { data } = response;
                    setMessages(data.messages);
                    console.log(data);
                    } catch (error) {
                    console.log('Error fetching messages:', error);
                    }
                };

                const handleUserClick = (userId) => {
                    setSelectedUserId(userId);
                    fetchMessages(userId);
                };

                    useEffect(() => {
                        // Set up polling interval to fetch new messages
                        const interval = setInterval(() => {
                        if (selectedUserId) {
                            fetchMessages(selectedUserId);

                        }
                        }, 5000); // Polling interval of 5 seconds (adjust as needed)
                    
                        return () => {
                        clearInterval(interval); // Clear interval on component unmount
                        };
                    }, [selectedUserId]);

                    const formatMessageDate = (createdAt) => {
                        const date = new Date(createdAt);
                        
                        const currentDate = new Date();
                    
                        const sameWeek = (currentDate, date) => {
                        const millisecondsPerDay = 24 * 60 * 60 * 1000; //the number of the millisecond per day 
                        const daysDiff = Math.round(
                            Math.abs((currentDate - date) / millisecondsPerDay)
                    );
                    
                        return daysDiff <= 7 && currentDate.getDay() >= date.getDay();
                        };
                    
                        const sameYear = (currentDate, date) => {
                        return currentDate.getFullYear() === date.getFullYear();
                        };
                    
                        if (sameWeek(currentDate, date)) {
                        return date.toLocaleDateString(undefined, {
                            weekday: 'long',
                            hour: 'numeric',
                            minute: 'numeric',
                        });
                        } else if (sameYear(currentDate, date)) {
                        return date.toLocaleDateString(undefined, {
                            weekday: 'long',
                            day: 'numeric',
                            month: 'long',
                            hour: 'numeric',
                            minute: 'numeric',
                        });
                        } else {
                        return date.toLocaleDateString(undefined, {
                            day: 'numeric',
                            month: 'numeric',
                            year: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        });
                        }
                    };

                const sendMessage = async () => {
                    try {
                        const response = await http.post(
                            '/store/messages',
                        {
                            receiver_id: selectedUserId, // Use the selected user ID as the receiver
                            content: messageContent, // Use the message content entered by the user
                        },
                        {
                            headers: {
                            Authorization: `Bearer ${token}`,
                            },
                        }
                        );
                        console.log(response.data); // Optional: Handle the response from the server
                        // Clear the message content after sending
                        setMessageContent('');
                    } catch (error) {
                        console.log('Error sending message:', error);
                    }
                    
                    };
                    const handleKeyDown = (event) => {
                        if (event.key === 'Enter') {
                          event.preventDefault(); // Prevent the default form submission behavior
                            sendMessage();
                            }
                        };
        return (
            <div className="container justify-between my-10 h-screen flex mx-auto border-1 border">
                <div className="border-1 border col-span-3 w-1/4">
                <h1 className="text-center p-5 font-semibold text-2xl">Discussion</h1>
                <form className='flex justify-center mb-10'>
                <input
                        type="text"
                        className=" mx-auto w-10/12 rounded-full px-4 py-2 border border-gray-300 focus:outline-none"
                        placeholder="search someone"
                        />
                </form>
                <ul>
                    {/* Render the list of users */}
                    {users.map((user) => (
                        <li
                        className={`flex border px-1 py-3 border-1 ${
                            user.id === selectedUserId ? 'bg-gray-200' : ''
                        }`}
                        key={user.id}
                        onClick={() => handleUserClick(user.id)}
                        >
                        <img
                            className="h-12 w-12 rounded-full object-cover"
                            src={`http://localhost:8000/storage/${user?.photo}`}
                            alt={user.name}
                        />
                        <div className="px-5">
                            <span className="font-bold">{user.name}</span>
                            <p>{user.lastMessage?.content}</p> {/* Display the last message for the user */}
                        </div>
                        </li>
                    ))}
                </ul>
                </div>
                <div className=" my-5 p-2 sm:p-6 justify-between flex flex-col w-full h-screen">
                <div className="flex sm:items-center justify-between py-3 border-b-2 border-gray-200">
                    {/* Display user details here */}
                    {/* You can use the selectedUserId state to fetch and display user details */}
                    {/* For example: */}
                    {selectedUserId && (
                        <div className="relative flex items-center space-x-4">
                            <div className="relative">
                            <span className="absolute text-green-500 right-0 bottom-0">
                                <svg width="20" height="20">
                                <circle cx="8" cy="8" r="8" fill="currentColor"></circle>
                                </svg>
                            </span>
                            <img
                                src={`http://localhost:8000/storage/${users.find(user => user.id === selectedUserId)?.photo}`}
                                alt=""
                                className="w-10 sm:w-16 h-10 object-cover sm:h-16 rounded-full"
                            />
                            </div>
                            <div className="flex flex-col leading-tight">
                            <div className="text-2xl mt-1 flex items-center">
                                <span className="text-gray-700 mr-3">
                                {users.find(user => user.id === selectedUserId)?.name}
                                </span>
                            </div>
                            <span className="text-lg text-gray-600">
                                {users.find(user => user.id === selectedUserId)?.position}
                            </span>
                            </div>
                        </div>
                        )}
                    <div className="flex items-center space-x-2">
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        ></path>
                        </svg>
                    </button>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        ></path>
                        </svg>
                    </button>
                    <button type="button"
                        className="inline-flex items-center justify-center rounded-lg border h-10 w-10 transition duration-500 ease-in-out text-gray-500 hover:bg-gray-300 focus:outline-none"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-6 w-6"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                        ></path>
                        </svg>
                    </button>
                    </div>
                </div>
        
                <div className="flex-1 overflow-y-auto" ref={chatboxRef}>
                    {/* Display messages here */}
                    {/* You can use the messages state to map and display the messages */}
                    {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`grid grid-cols-12 gap-4 ${
                            message.sender_id === selectedUserId ? 'justify-start' : 'justify-end'
                        }`}
                    >
                        <div className="col-span-12">
                        <div className={`flex items-start space-x-2 mb-4 ${message.sender_id === selectedUserId ? 'justify-start' : 'justify-end'}`}>
                            {message.sender_id === selectedUserId ? (
                            <img
                                src={`http://localhost:8000/storage/${message.sender.photo}`}
                                alt="sqfsfq"
                                className="w-8 h-8 rounded-full object-cover"
                            />
                            ) : null}
                            <div className="flex flex-col">
                            <div
                                className={`bg-${
                                message.sender_id === selectedUserId ? 'gray-100' : 'blue-500'
                                } rounded-lg p-2`}
                            >
                                <p
                                className={`text-${
                                    message.sender_id === selectedUserId ? 'gray-600' : 'white'
                                }`}
                                >
                                {message.content}
                                </p>
                            </div>
                            <p className="text-gray-500 text-sm mt-1">
                            {formatMessageDate(message.created_at)}
                            </p>
                            </div>
                            {message.sender_id !== selectedUserId ? (
                            <img
                                src={`http://localhost:8000/storage/${message.sender.photo}`}
                                alt=""
                                className="w-8 h-8 rounded-full"
                            />
                            ) : null}
                        </div>
                        </div>
                    </div>
                    ))}
                </div>
        
                <div className="py-4">
                    <div className="flex items-center space-x-3">
                    <input
                        type="text"
                        value={messageContent}
                        onChange={(e) => setMessageContent(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="w-full rounded-full px-4 py-2 border border-gray-300 focus:outline-none"
                        placeholder="Type your message..."
                        />
                        <button
                        type="button"
                        onClick={sendMessage}
                        className="inline-flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none px-4 py-2"
                        >
                        <i className="bi bi-send"></i>
                        </button>
                    <button
                        type="button"
                        className="inline-flex items-center justify-center rounded-full bg-blue-500 text-white hover:bg-blue-600 focus:outline-none px-4 py-2"
                    >
                        <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        className="h-5 w-5"
                        >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                        />
                        </svg>
                    </button>
                    </div>
                </div>
                </div>
            </div>
            );
        };
                
export default ChatComponent;