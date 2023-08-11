import React, { useState, useEffect, useRef } from 'react';
import http from '../http';
import img1 from "../images/default.jfif";
import EmojiPicker from 'emoji-picker-react';
import Cookies from 'js-cookie';
const ChatComponent = () => {
        const token = Cookies.get("access_token");
        const [users, setUsers] = useState([]);
        const [selectedUserId, setSelectedUserId] = useState(null);
        const [messages, setMessages] = useState([]);
        const [messageContent, setMessageContent] = useState('');
        const chatboxRef = useRef(null);
        const [showDiscussion, setShowDiscussion] = useState(false);
        const [isMobile, setIsMobile] = useState(false);
        const [showemojies, setShowEmojies] = useState(false);
        const handleBackClick = () => {
        setShowDiscussion(false);
        };
    
        useEffect(() => {
        const checkIsMobile = () => {
            setIsMobile(window.innerWidth <= 768); // Adjust the breakpoint according to your needs
        };
    
        checkIsMobile();
    
        window.addEventListener('resize', checkIsMobile);
        return () => {
            window.removeEventListener('resize', checkIsMobile);
        };
        }, []);


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
            if (showDiscussion && chatboxRef.current) {
              chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
            }
          }, [showDiscussion]);
        const handleEmojiSelect = (emoji) => {
            setMessageContent((prevContent) => prevContent + emoji.emoji);
          };
          
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
                    const sortedUsers = usersWithLastMessages.sort((a, b) => {
                        const dateA = new Date(a.lastMessage?.created_at);
                        const dateB = new Date(b.lastMessage?.created_at);
                        return dateB - dateA;
                      });
                    setUsers(sortedUsers);
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
                    if (isMobile) {
                        setShowDiscussion(true);
                    }
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
            <div className='min-h-screen py-[100px] cat'>
            <div className="container  bg-white md:max-h-[800px] lg:w-[60%] px-0 grid grid-cols-5 mx-auto ">
            {/* Mobile version */}    
            {
                isMobile && (
                    <>
                    {
                        !showDiscussion ?
                            <div className="border-r-1 border-l-0 col-span-5 h-screen  border md:col-span-2 2xl:col-span-1">
                                    <h1 className="text-center p-3 font-semibold text-2xl">Discussions</h1>

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
                                                src={`${user?.photo ? `http://localhost:8000/storage/${user?.photo}`: img1}`}
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
                        :
                        <div className="2xl:col-span-4 col-span-5 md:col-span-3 border-1 border border-l-0">
                        <div className="">
        
                            {selectedUserId && (

                                <div className=" flex items-center ml-3 space-x-4">
                                    <div className=" flex py-3">
                                    <button type='button' onClick={handleBackClick} className='md:hidden mr-2 font-semibold text-2xl '><i className="bi bi-arrow-left"></i></button>
                                    <img
                                        src={`${ users.find(user => user.id === selectedUserId)?.photo ?`http://localhost:8000/storage/${users.find(user => user.id === selectedUserId)?.photo}`:img1}`}
                                        
                                        alt=""
                                        className="w-10 sm:w-12 h-10 object-cover sm:h-12 rounded-full"
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
                        
                            </div>
                            <hr />
                        </div>
                        
                        <div className="flex-1 m-2 h-[600px] overflow-y-auto " ref={chatboxRef}>
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
                                <div className={`flex items-start space-x-2 mb-4  ${message.sender_id === selectedUserId ? 'justify-start' : 'justify-end'}`}>
                                    {message.sender_id === selectedUserId ? (
                                        
                                    <img
                                        src={`${message.sender.photo ?` http://localhost:8000/storage/${message.sender.photo}` : img1}`} 
                                        alt="sqfsfq"
                                        className="w-8 h-8  rounded-full object-cover"
                                    />

                                    ) : null}
                                    <div className="max-w-[70%]">
                                    <div
                                            className={`bg-${
                                            message.sender_id === selectedUserId ? 'gray-100 rounded-r-lg rounded-b-lg ' : '[#d8e5ff] hover:bg-[#afc2e9] rounded-s-lg rounded-b-lg  transition-all ease-out duration-300' 
                                            }  p-2`}
                                        >
                                            <p style={{wordWrap: 'break-word' }}
                                            
                                            className={` font-semibold text-${
                                                message.sender_id === selectedUserId ? 'gray-600' : 'black'
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
                                    src={`${message.sender.photo ?` http://localhost:8000/storage/${message.sender.photo}` : img1}`} 
                                        alt=""
                                        className="w-8 h-8 object-cover rounded-full"
                                    />
                                    ) : null}
                                </div>
                                </div>
                            </div>
                            ))}
                        </div>
                
                        <div className="">
                            <div className=" relative flex items-center space-x-3">
                                <div className={`absolute right-0 bottom-[60px]  ${!showemojies ? "hidden" : ""}`}>   
                                    <div className='  '>
                                        {showemojies && (
                                        <div className="">
                                            <EmojiPicker onEmojiClick={handleEmojiSelect} />
                                        </div>
                                        )}
                                    </div>
                                        <div className='triangle absolute  right-20'>

                                        </div>
                                    </div>
                            
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
                                    onClick={()=>setShowEmojies(!showemojies)}
                                    className="inline-flex items-center justify-center rounded-full  text-white bg-[#d8e5ff] hover:bg-[#afc2e9] transition-all ease-out duration-300 focus:outline-none px-4 py-2"
                                >
                                    😊
                                </button>
                                <button
                                type="button"
                                onClick={sendMessage}
                                className="inline-flex items-center justify-center rounded-full bg-[#d8e5ff] hover:bg-[#afc2e9] text-white focus:outline-none px-4 py-2"
                                >
                                <i className="bi bi-send"></i>
                                </button>
                            </div>
                        </div>
                    </div>
                    }
                    </>
                )
            }
            {/* Laptop version */}    
            {
                !isMobile &&(
                    <>
                        <div className="border-r-1 border-l-0 col-span-5 border md:col-span-2 2xl:col-span-1">
                                <h1 className="text-center p-3 font-semibold text-2xl">Discussions</h1>

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
                                            src={`${user?.photo ? `http://localhost:8000/storage/${user?.photo}`: img1}`}
                                            alt={user.name}
                                        />
                                        <div className="lg:px-3">
                                            <span className="font-semibold">{user.name}</span>
                                            <p>{user.lastMessage?.content}</p> {/* Display the last message for the user */}
                                        </div>
                                        </li>
                                    ))}
                                </ul>
                        </div>
                        <div className="2xl:col-span-4 col-span-5 md:col-span-3 border-1 border border-l-0">
                            <div className="">
            
                                {selectedUserId && (

                                    <div className=" flex items-center ml-3 space-x-4">
                                        <div className=" flex py-3">
                                        <button type='button' onClick={handleBackClick} className='md:hidden mr-2'><i className="bi bi-arrow-left"></i></button>
                                        <img
                                            src={`${ users.find(user => user.id === selectedUserId)?.photo ?`http://localhost:8000/storage/${users.find(user => user.id === selectedUserId)?.photo}`:img1}`}
                                            
                                            alt=""
                                            className="w-10 md:w-14 h-10 object-cover md:h-14 rounded-full"
                                        />
                                        </div>
                                        
                                        <div className="flex flex-col leading-tight">
                                        <div className="text-2xl mt-1 flex items-center">
                                            <span className="text-gray-700 mr-3 text-lg font-semibold" >
                                            {users.find(user => user.id === selectedUserId)?.name}
                                            </span>
                                        </div>

                                        </div>
                                    </div>
                                    )}
                                <div className="flex items-center space-x-2">
                            
                                </div>
                                <hr />
                            </div>
                            
                            <div className="flex-1 m-2 h-[600px] overflow-y-auto " ref={chatboxRef}>
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
                                    <div className={`flex items-start space-x-2 mb-4  ${message.sender_id === selectedUserId ? 'justify-start' : 'justify-end'}`}>
                                        {message.sender_id === selectedUserId ? (
                                            
                                        <img
                                            src={`${message.sender.photo ?` http://localhost:8000/storage/${message.sender.photo}` : img1}`} 
                                            alt="sqfsfq"
                                            className="w-8 h-8 rounded-full object-cover"
                                        />

                                        ) : null}
                                        <div className="max-w-[70%] ">
                                        <div
                                            className={`bg-${
                                            message.sender_id === selectedUserId ? 'gray-100 rounded-r-lg rounded-b-lg ' : '[#d8e5ff] hover:bg-[#afc2e9] rounded-s-lg rounded-b-lg  transition-all ease-out duration-300' 
                                            }  p-2`}
                                        >
                                            <p style={{wordWrap: 'break-word' }}
                                            
                                            className={` font-semibold text-${
                                                message.sender_id === selectedUserId ? 'gray-600' : 'black'
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
                                        src={`${message.sender.photo ?` http://localhost:8000/storage/${message.sender.photo}` : img1}`} 
                                            alt=""
                                            className="w-8 h-8 object-cover rounded-full"
                                        />
                                        ) : null}
                                    </div>
                                    </div>
                                </div>
                                ))}
                            </div>
                    
                            <div className="">

                                <div className="flex relative items-center space-x-3">
                                    <div className={`absolute right-0 bottom-[60px]  ${!showemojies ? "hidden" : ""}`}>   
                                        <div className='  '>
                                        {showemojies && (
                                        <div className="">
                                            <EmojiPicker onEmojiClick={handleEmojiSelect} />
                                        </div>
                                        )}
                                        </div>
                                        <div className='triangle absolute  right-20'>

                                        </div>
                                    </div>
                                    
                                <textarea
                                    type="text"
                                    value={messageContent}
                                    onChange={(e) => setMessageContent(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    className="flex-1 w-[100%] m-0 border  flex-wrap resize-none h-[50px] rounded-r-lg  border-gray-300  px-2 py-1 focus:outline-none"
                                    placeholder="Type your message..."
                                    />
                                    <button
                                        type="button"
                                        onClick={()=>setShowEmojies(!showemojies)}
                                        className="inline-flex items-center justify-center ml-2 rounded-lg mr-0 bg-[#d8e5ff] hover:bg-[#afc2e9] text-white transition-all ease-out duration-300 focus:outline-none px-4 py-2"
                                    >
                                        😊
                                    </button>

                                    <button
                                    type="button"
                                    onClick={sendMessage}
                                    className="inline-flex items-center justify-center rounded-lg bg-[#d8e5ff] hover:bg-[#afc2e9] transition-all ease-out duration-300 text-white focus:outline-none px-4 py-2"
                                    >
                                    <i className="bi bi-send"></i>
                                    </button>

                                </div>
                            </div>
                        </div>
                    </>
                )
            }
            </div>
            </div>
            );
        };
                
export default ChatComponent;