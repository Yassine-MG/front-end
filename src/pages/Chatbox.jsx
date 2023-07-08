import React, { useState, useEffect,useRef } from 'react';
import http from '../http';
import Cookies from 'js-cookie';
    export default function ChatBox(props) {
    const [messages, setMessages] = useState([]);
    const [inputValue, setInputValue] = useState('');
    const [authId,setAuthId] = useState("") 
    let pollInterval;
    const token = Cookies.get("access_token");

    const textareaRef = useRef(null);

    const handleTextareaChange = (event) => {
      const textarea = textareaRef.current;
      textarea.style.height = 'auto'; // Reset the height to auto to recalculate the height based on the content
      textarea.style.height = `${textarea.scrollHeight}px`; // Set the height to match the scroll height of the content
      setInputValue(event.target.value);
    };

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
                console.log(response);
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
        <div className=" border w-[400px] border-1  bg-white shadow-lg rounded-lg">
            <div className=' border border-1 flex py-3 px-2 justify-between bg-[#2592c5] '>
                <div className='flex items-center'>
                     <img src={props.src} className='w-8 h-8 rounded-full mr-2' alt="image" />
                     <h2 className=' font-semibold text-white'>{props.username}</h2>
                </div>
                <div>
                <button className=' text-2xl mr-3 text-white font-semibold ' onClick={props.onClickReduce} type='button'><i class="bi bi-dash-lg"></i></button>
                <button className=' text-3xl text-white font-semibold ' onClick={props.onClickClose} type='button'><i class="bi bi-x"></i></button>
                </div>
            </div>
        <div className="h-80 p-4 overflow-y-auto overflow-x-hidden">
            {messages.map((message, index) => (
            <div key={index} className="mb-2">
                {
                    message.sender_id == authId ?
                    <div className="flex justify-end ">
                        <p className='py-2 px-4 rounded-lg max-w-[80%] bg-[#2592c5] text-white' style={{ wordBreak: 'break-word' }}>
                            {message.content}
                        </p>
                    
                    </div>:
                    <div className=" flex justify-start">
                        <p className='bg-gray-300 text-white max-w-[80%] w-fit py-2 px-4 rounded-lg'>
                            {message.content}
                        </p>
                    </div>
                }

            </div>
            ))}
        </div>
        

        
        <form className="flex py-2 px-2 border border-1 rounded-b-lg " onSubmit={handleMessageSubmit}>
            <div className='flex w-full'>
            <textarea
            type="text"
            ref={textareaRef}
            className="flex-1 w-[80%] flex-wrap resize-none min-h-[50px] max-h-[100px] rounded-lg  border-gray-300 mr-2 px-2 py-1 focus:outline-none"
            placeholder="Type your message..."
            value={inputValue}
            onChange={(e) => handleTextareaChange(e)}
            >
            </textarea>
            </div>
            <div className='flex'>
            <button
                type="button"
                className="bg-gray-200 mx-2 hover:bg-gray-300 h-fit text-gray-700 px-4 py-2 rounded-lg focus:outline-none"
                onClick={() => handleEmojiClick('😊')}
                >
                😊
            </button>
            <button
            type="submit"
            className="bg-[#2592c5]   hover:bg-[#0e7490] transition-all h-fit ease-out duration-300 text-white px-4 py-2 rounded-lg focus:outline-none"
            >
            <i className="bi bi-send"></i>
            </button>
            </div>
        </form>
        </div>
    );
    };
