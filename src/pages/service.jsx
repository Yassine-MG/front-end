import React,{ useEffect, useState } from 'react'
import http from '../http';
import { Link, useParams } from 'react-router-dom';
import defaultimg from "../images/defaultpic.jpg"
import img1 from "../images/default.jfif";
import { Carousel } from 'react-responsive-carousel';
import Cookies from 'js-cookie';
import 'react-responsive-carousel/lib/styles/carousel.min.css';
import ServiceNavbar from '../components/Navbar/ServiceNavbar'
import ChatBox from './Chatbox';
export default function ServicePage({ match } ) {
    const [service, setService] = useState(null);
    const [images, setImages ] = useState([])
    const [skills, setSkills]= useState([])
    const [user, setUser]= useState([])
    const [authuser, setAuthuser]= useState([])
    const [contents, setContent]= useState([])
    const [freelancer, setFreelancer] = useState([])
    const { id } = useParams();
    const token = Cookies.get("access_token");
    const [receiverId, setReceiverId] = useState("");
    const [messages, setMessages] = useState([]);
    const [showChatbox, setShowChatbox] = useState(false);
    const [reduceChatbox, setReduceChatbox] = useState(false);
    
    
        const formatDate = (dateString) => {
            const date = new Date(dateString);
            const options = { year: 'numeric', month: 'long' };
            return date.toLocaleDateString(undefined, options);
        };
        useEffect(() => {
            if(id){
                http.get(`/service/${id}`)
                    .then(response => {
                    setService(response.data.service);
                    console.log(response);
                    setSkills(JSON.parse(response.data.service.skills));
                    setUser(response.data.user)
                    setReceiverId(response.data.user.id)
                    setFreelancer(response.data.freelancer)
                    setContent(JSON.parse(response.data.service.dynamic_inputs));
                    // console.log(skills);
                    if(response.data.service.image1 !=null ||response.data.service.image2 !=null ||response.data.service.image3 !=null){
                        setImages([response.data.service.image1 ,response.data.service.image2,response.data.service.image3])
                    }
                    
                    })
                    .catch(error => {
                    console.error(error);
                    });
            }
        }, [id]);
        const fetchServices = async () => {
            try {
            const response = await http.get('/profile/services', {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });
            setAuthuser(response.data.user)
            console.log(response);
            } catch (error) {
            console.log(error);
            }
        };
        useEffect(()=>{
            if(token){
                fetchServices()
            }
        },[])

        const handleReduce = () =>{
            setShowChatbox(false);
            setReduceChatbox(true);
        }

        const handleOpen = () =>{
            setShowChatbox(true);
            setReduceChatbox(false);
        }
    return (
        <div className='min-h-screen mt-20 pb-10 lg:container mx-auto'>
            <div className='bg-white border border-gray-200 border-t-0 border-l-0 border-r-0 border-b-1'>

            </div>
            <div className="md:mx-14  lg:mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className=" my-10 grid relative grid-cols-5 gap-8">
                <div className="lg:col-span-3  bg-white col-span-5">
                    <div className="border bg-white border-gray-300 p-3">
                    <h1 className="my-5 text-2xl font-semibold text-[#404145]">
                        {service?.title}
                    </h1>
                    <Link to={`/profile/${user.id}`} className="flex items-center my-5">
                        {user?.photo ? (
                        <img
                            className="inline-block mr-5 h-12 w-12 rounded-full object-cover ring-2 ring-white"
                            src={`http://localhost:8000/storage/${user?.photo}`}
                            alt="profile picture"
                        />
                        ) : (
                        <img
                            src={img1}
                            className="inline-block mr-5 h-12 w-12 rounded-full ring-2 ring-white"
                            alt="default"
                        />
                        )}
                        <h2 className="font-semibold text-xl">{freelancer?.displayed_name}</h2>
                    </Link>
                    <div id="carouselExample" className="relative carousel slide">
                    <div className="carousel-inner w-[100%] h-fit md:h-[50vh]  object-cover">
                        {images.map((image, index) => (
                        <div key={index} className={`carousel-item bg-transparent ${index === 0 ? 'active' : ''}`}>
                            <img src={`http://localhost:8000${image}`} className="d-block  w-[100%] h-[35vh] md:h-[50vh] object-cover " alt={`image ${index + 1}`} />
                        </div>
                        ))}
                        <div className="carousel-item w-[100%] h-fit md:h-[50vh] bg-transparent">
                        {service?.video ? (
                            <video className=" w-full h-full " controls>
                            <source src={`http://localhost:8000${service?.video}`} type="video/mp4" />
                            </video>
                        ) : (
                            <></>
                        )}
                        </div>
                    </div>
                  
                    <div className="absolute left-10 top-[50%]">
                    <button className="carousel-control-prev text-black  md:text-2xl " type="button" data-bs-target="#carouselExample" data-bs-slide="prev">
                        <i className="bi bi-chevron-left bg-[#ffffffc4] px-2 py-1 rounded-full"></i>
                    </button>
                    </div>  
                    <div className="absolute right-10 top-[50%] ">
                    <button className="carousel-control-next text-black md:text-2xl" type="button" data-bs-target="#carouselExample" data-bs-slide="next">
                        <i className="bi bi-chevron-right bg-[#ffffffc4] px-2 py-1 rounded-full"></i>
                    </button>
                    </div>
                    </div>

                    <div>
                        {/* Render the current image */}

                    </div>
                    <h2 className="my-4 text-lg">About this Service</h2>
                    <p className="text-justify text-sm leading-7">{service?.description}</p>
                    <hr className="my-5" />
                    <div className="grid grid-cols-2 gap-4 ">
                        <div>
                        <h1 className="text-gray-500 font-semibold text-lg my-2">Category:</h1>
                        <p className="text-sm">{service?.category}</p>
                        </div>
                        <div>
                        <h1 className="text-gray-500 font-semibold text-lg my-2">Skills:</h1>
                        <ul>
                            {skills.map((skill, index) => (
                            <li className="my-1 text-sm  list-none" key={index}>
                                {skill}
                            </li>
                            ))}
                        </ul>
                        </div>
                    </div>
                    </div>
                    <div className="mt-5 px-3">
                    <h1 className="font-semibold text-2xl">About the Seller</h1>
                    <div className="flex my-2  justify-between xs:justify-normal items-center">
                        {user?.photo ? (
                        <Link to={`/profile/${user.id}`}>
                            <img
                                className="inline-block mr-5 h-[150px] w-[150px] object-cover rounded-full ring-2 ring-white"
                                src={`http://localhost:8000/storage/${user?.photo}`}
                                alt="profile picture"
                            />
                        </Link>
                        ) : (
                        <Link to={`/profile/${user.id}`}>
                            <img
                                src={img1}
                                className="inline-block mr-5 h-[80px] w-[80px] rounded-full ring-2 ring-white"
                                alt=""
                            />
                        </Link>
                        )}
                        <div className="lg:ml-20 ml-10">
                        <Link to={`/profile/${user.id}`}><h2 className="font-semibold text-xl">{freelancer?.displayed_name}</h2></Link>
                        <p className="my-3">{freelancer?.category}</p>
                        {
                        authuser?.freelancer?.id == service?.freelancer_id ?
                        <></>
                        : 
                        <button type='button' onClick={() => setShowChatbox(true)} className="rounded-full bg-cyan-700 px-3 py-2 font-semibold text-white  hover:bg-cyan-500 transition-all delay-100">
                            Contact me
                        </button>
                        }
                        </div>
                    </div>
                    </div>
                    <div className="border bg-white border-gray-300 p-4 mt-10">
                    <div className="grid grid-cols-1  gap-4 xs:grid-cols-2">
                        {user?.countries ? (
                        <div>
                            <h1>From:</h1>
                            <p className="text-[#62646a] md:text-lg text-sm font-semibold">{user?.countries}</p>
                        </div>
                        ) : (
                        <></>
                        )}
                        <div>
                        <h1>Member Since:</h1>
                        <p className="text-[#62646a] md:text-lg text-sm font-semibold">
                            {user?.created_at ? formatDate(user.created_at) : 'N/A'}
                        </p>
                        </div>
                        {user?.Language ? (
                        <div>
                            <h1>Language:</h1>
                            <p className="text-[#62646a] md:text-lg text-sm font-semibold">{user?.Language}</p>
                        </div>
                        ) : (
                        <></>
                        )}
                        <div>
                        <h1>Email:</h1>
                        <p className="text-[#62646a] md:text-lg text-sm font-semibold">{user?.email}</p>
                        </div>
                        {freelancer?.first_name || freelancer?.last_name ? (
                        <div>
                            <h1 className="text-[#4c4c4d]">Name:</h1>
                            <p className="text-[#62646a] md:text-lg text-sm font-semibold">
                            {freelancer?.first_name} {freelancer?.last_name}
                            </p>
                        </div>
                        ) : (
                        <></>
                        )}
                    </div>
                    {user?.description != null ? (
                        <>
                        <hr className="my-10" />
                        <div>
                            <p className="text-justify">{user?.description}</p>
                        </div>
                        </>
                    ) : (
                        <></>
                    )}
                    </div>

                    
                </div>

                <div className="lg:col-span-2  col-span-5">
                    <div className="border bg-white border-gray-300 p-4">
                    <div className="flex text-base font-semibold justify-between">
                        <p>{service?.offer_name}</p>
                        <p>{service?.price ? <span>${service.price}</span> : <></>}</p>
                    </div>
                    <p className="text-justify my-5 text-sm">{service?.details}</p>
                    <p className="text-sm font-semibold text-gray-400">
                        <i className="text-red-600 text-lg bi bi-clock-history"></i> {service?.delevery}
                    </p>
                    <ul>
                        {Array.isArray(contents) &&
                        contents.map((content, index) => (
                            <li className="text-sm font-semibold text-gray-400" key={index}>
                            <span className="text-green-600 text-xl">
                                <i className="bi bi-check-lg"></i>
                            </span>
                            {content.name} {content.value === "true" ? <></> : content.value}
                            </li>
                        ))}
                    </ul>
                    {
                        authuser?.freelancer?.id == service?.freelancer_id ?
                        <></>
                        : 
                        <Link
                            to={`/request/service/${id}`}
                            type="button"
                            className="mt-6 py-3 w-full px-4 inline-flex items-center justify-between gap-2 rounded-md border-2 border-gray-900 font-semibold  text-gray-800 hover:text-white hover:bg-gray-800 hover:border-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-800 focus:ring-offset-2 transition-all text-sm dark:hover:bg-gray-900 dark:border-gray-900 dark:hover:border-gray-900 dark:text-white dark:focus:ring-gray-900 dark:focus:ring-offset-gray-800"
                        >
                            <span className="flex-grow text-center">Continue (${service.price})</span>
                            <span className="text-right">
                            <i className="bi bi-arrow-right"></i>
                            </span>
                        </Link> 
                    }

                    </div>
                    {showChatbox &&  (
                    <div className=" flex justify-center my-5 md:sticky top-[420px] 2xl:ml-[180px]">
                    <ChatBox src={`${user?.photo ? `http://localhost:8000/storage/${user?.photo}`: img1}`} onClickReduce={handleReduce} onClickClose={() => setShowChatbox(false)} username={freelancer.displayed_name} receiverId={receiverId} />
                    </div>
                    )}
                    {
                        reduceChatbox && (
                            <div className=" flex justify-center my-5 md:sticky top-[850px] text-right left-[100px]">
                            <button type='button' onClick={handleOpen}>
                               
                               <div className='flex items-center bg-[#2592c59a] p-2 rounded-full'>
                               <img src={`${user?.photo ? `http://localhost:8000/storage/${user?.photo}`: img1}`}className='w-12 h-12 mr-3  rounded-full' alt="" /> 
                                <p className=' font-semibold text-sm text-white'> Message {freelancer?.displayed_name}</p>
                               </div>
                            </button>
                        </div>
                        )
                    }

                </div>
            </div>
        </div>
    </div>
    )
}