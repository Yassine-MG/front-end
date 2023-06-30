import React, { useState, useEffect} from 'react';
import http from '../http';
import Cookies from 'js-cookie';
    export default function ChatBox(props) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [authId,setAuthId] = useState("") 
    let pollInterval;
    const token = Cookies.get("access_token");


    const fetchMessages = () => {
            http
            .get(`/get/messages/${props.receiverId}`, {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            })
            .then((response) => {
                if (typeof response.data.messages === 'object') {
                const messageArray = Object.values(response.data.messages);
                setMessages(messageArray);
                } else {
                console.error('Invalid messages data:', response.data.messages);
                }
                setAuthId(response.data.auth);
            })
            .catch((error) => {
                console.error(error);
            });
        };


        const startPolling = () => {
            stopPolling();
            pollInterval = setInterval(fetchMessages, 1000); // Poll every 5 seconds (adjust the interval as needed)
          };
        
          const stopPolling = () => {
            clearInterval(pollInterval);
          };

          useEffect(() => {
            // Fetch messages from the server initially
            fetchMessages();
        
            // Start polling for new messages
            startPolling();
        
            // Clean up the interval when the component unmounts
            return () => {
              stopPolling();
            };
          }, [props.receiverId, token]);

        useEffect(() => {
            // Fetch messages from the server initially
            fetchMessages();
          }, [props.receiverId, token]);


          
        
        const handleMessageSubmit = (e) => {
            e.preventDefault();
            if (inputValue.trim() !== '') {
              // Send the message to the server
                http
                    .post(
                    '/store/messages',
                    {
                        receiver_id: props.receiverId,
                        content: inputValue,
                    },
                    {
                        headers: {
                        Authorization: `Bearer ${token}`,
                        },
                    }
                    )
                    .then((response) => {
                    const newMessage = response.data.message; // Assuming the response contains the newly sent message
                    setMessages((prevMessages) => [...prevMessages, newMessage]);
                    setInputValue('');
                    })
                    .catch((error) => {
                    console.error(error);
                    });
                }
            };

    const handleEmojiClick = (emoji) => {
        setInputValue(inputValue + emoji);
      };

    return (
        <div className=" border w-96 border-1 bg-white shadow-lg rounded-lg">
        <div className="h-80 p-4 overflow-y-auto">
            {messages.map((message, index) => (
            <div key={index} className="mb-2">
                {
                    message.sender_id == authId ?
                    <div className="flex justify-end ">
                        <p className='py-2 px-4 rounded-lg bg-blue-500 text-white'>
                            {message.content}
                        </p>
                    
                    </div>:
                    <div className=" flex justify-start">
                        <p className='bg-gray-300 text-white  py-2 px-4 rounded-lg'>
                            {message.content}
                        </p>
                    </div>
                }

            </div>
            ))}
        </div>
        <form className="flex p-4 border border-1" onSubmit={handleMessageSubmit}>
            <input
            type="text"
            className="flex-1 rounded-lg border-gray-300 mr-2 px-2 py-1 focus:outline-none"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            />
            <button
                type="button"
                className="bg-gray-200 mx-2 hover:bg-gray-300 text-gray-700 px-4 py-2 rounded-lg focus:outline-none"
                onClick={() => handleEmojiClick('😊')}
                >
                😊
            </button>
            <button
            type="submit"
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg focus:outline-none"
            >
            Send
            </button>
        </form>
        </div>
    );
    };
