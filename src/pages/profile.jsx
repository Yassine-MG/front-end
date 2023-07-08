import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Login from "./login";
import { useNavigate } from "react-router-dom";
import {saveUserInSession} from '../Helpers/functions';
// import http from '../http';
import Cookies from 'js-cookie';
import img1 from "../images/default.jfif";
import img2 from "../images/defaultpic.jpg";
import http from "../http";
export default function Profile() {
    const [user, setUser] = useState(null);
    const [services, setServices] = useState([]);
    const token = Cookies.get("access_token");
    const navigate = useNavigate();
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
    const [showOptions, setShowOptions] = useState(false);
    const [selectedService, setSelectedService] = useState(null);
    const [showFullDescription, setShowFullDescription] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const toggleDescription = () => {
        setShowFullDescription(!showFullDescription);
      };
    useEffect(() => {
        const userfromstorage = JSON.parse(sessionStorage.getItem("user"))
        setUser(userfromstorage);
            const id = userfromstorage.id;
            http.get(`/edit/${id}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then((response) => {
                console.log(response);
                saveUserInSession(response.data.user)
                console.log(response.data.user.role);
                if(sessionUser.role){
                    if(sessionUser.role != response.data.user.role){
                        navigate('/profile')  
                    }
                }
                
            })
            .catch((error) => {
                console.log(error.message);
            });
        }, []);

            const fetchServices = async () => {
                try {
                const response = await http.get('/profile/services', {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                });
                console.log(response);
                setServices(response.data.services);
                console.log(response.data.services);
                } catch (error) {
                console.log(error);
                }
            };

            useEffect(()=>{
                if (sessionUser.role == "Freelancer") {
                    fetchServices()
                }  
        },[])
            const handleOptionsClick = (serviceId) => {
                if (showOptions && selectedService === serviceId) {
                setShowOptions(false);
                setSelectedService(null);
                } else {
                setShowOptions(true);
                setSelectedService(serviceId);
                }
            };

            const handleDeleteService = (serviceId) => {
                http.delete(`/service/delete/${serviceId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                })
                    .then((response) => {
                       console.log(response);
                       window.location.reload();
                    })
                    .catch((error) => {
                        console.error(error)
                    });
            };

        console.log(services);
    if (document.cookie.match("access_token")) {
        return (
            <div className="cat">
        <div className="py-20 min-h-screen container grid grid-cols-5 align-center gap-4 mx-auto">
            <div className=" mx-3 mt-10 lg:col-span-2 col-span-full">
                <div className="bg-white border p-4 border-gray-200 ">
                    <Link to={"/modif"} className="block text-right"><i className="bi bi-pencil text-gray-400"></i></Link>
                    <div className="flex flex-col items-center pb-10">
                        
                {    user?.photo ? 
                    <img src={`http://localhost:8000/storage/${user?.photo}`} className="w-24 h-24 mb-3 cursor-pointer hover:scale-110 duration-300 transition-all rounded-full shadow-lg object-cover"  onClick={() => setIsModalOpen(true)} alt="" />  
                    :
                    <img
                        className="w-24  mb-3 rounded-full shadow-lg cursor-pointer hover:scale-110 duration-300 transition-all"
                        src={img1}
                        onClick={() => setIsModalOpen(true)}
                        alt="Bonnie image"
                    />
                    }
                                        {
                        isModalOpen && (
                            <div className="fixed top-0 left-0 z-50 right-0 bottom-0 flex w-screen h-screen justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm">
                            <div className=" rounded-lg">
                                <button
                                onClick={() => setIsModalOpen(false)}
                                className="absolute top-0 text-white transition-all ease-in-out duration-200 font-semibold text-4xl right-10 hover:text-gray-700"
                                >
                                X
                                </button>
                                {    user?.photo ? 
                                <img src={`http://localhost:8000/storage/${user?.photo}`} className="w-[500px] h-[500px] object-cover rounded-full" alt={user?.name} onClick={() => setIsModalOpen(true)}/>  
                                :
                                <img
                                    className=" w-[500px] h-[500px] object-cover rounded-full "
                                    src={img1}
                                    alt="Bonnie image"
                                    onClick={() => setIsModalOpen(true)}

                                />
                                }
                            </div>
                            </div>
                        )
                        }
                    
                    <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
                        {user?.name}
                    </h5>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                        {user?.email}
                    </span>
                    </div>
                    <hr />
                    <div>
                        <div className="flex justify-between mt-5">
                            <h2 className=" font-semibold">Role :</h2>
                            <h2>
                            <i className="bi bi-person"></i> {user?.role}
                            </h2>
                        </div>
                        <div className="flex justify-between my-4">
                            <h2 className=" font-semibold">From : </h2>
                            <h2> {user?.countries}</h2>
                        </div>

                        {/*  */}
                        <div className="md:hidden block">
                            <div>
                                <div className="flex justify-between">
                                    <h2 className="font-semibold">About me:</h2>
                                {user?.description?.length > 400 &&       <>             
                                    {showFullDescription ?(
                                            <button
                                                onClick={toggleDescription}
                                                className="text-red-500 font-semibold text-2xl"
                                            >
                                                <i className="bi bi-dash"></i>
                                            </button>
                                            ) : (
                                            <button
                                            className="text-red-500 font-semibold text-2xl"
                                            onClick={toggleDescription}
                                            >
                                            <i className="bi bi-plus"></i>
                                            </button>
                                    )}</> 
                                    }
                                </div>

                                <p
                                    className={`text-sm my-5 text-justify  overflow-hidden ${
                                    showFullDescription ? ' max-h-[100vh]' : ' max-h-16'
                                    } transition-all ease-in-out duration-500`}
                                >
                                    {user?.description}
                                </p>
                                </div>
                                <hr />
                                <div className="flex my-5 justify-between">
                                    <h2 className=" font-semibold">Language : </h2>
                                    <p className="text-sm"><i className="bi bi-translate mr-3"></i>{user?.Language}</p>
                                </div>
                        </div>
                    </div>
                </div>
                <div className=" md:block hidden mt-10 bg-white border p-5 border-gray-200">
                <div>
                    <div className="flex justify-between">
                        <h2 className="font-semibold">About me:</h2>
                    {user?.description?.length > 400 &&       <>             
                        {showFullDescription ?(
                                <button
                                    onClick={toggleDescription}
                                    className="text-red-500 font-semibold text-2xl"
                                >
                                    <i className="bi bi-dash"></i>
                                </button>
                                ) : (
                                <button
                                className="text-red-500 font-semibold text-2xl"
                                onClick={toggleDescription}
                                >
                                <i className="bi bi-plus"></i>
                                </button>
                        )}</> 
                        }
                    </div>

                    <p
                        className={`text-sm my-5 text-justify  overflow-hidden ${
                        showFullDescription ? ' max-h-[100vh]' : ' max-h-16'
                        } transition-all ease-in-out duration-500`}
                    >
                        {user?.description}
                    </p>
                    </div>
                    <hr />
                    <div className="flex my-5 justify-between">
                        <h2 className=" font-semibold">Language : </h2>
                        <p className="text-sm"><i className="bi bi-translate mr-3"></i>{user?.Language}</p>
                    </div>
                </div>
            </div>
            {sessionUser.role === "Freelancer"?
                <div className="mx-3 lg:col-span-3 col-span-full">
                        <div className=" flex flex-col justify-center items-center mt-10  bg-white border py-3 border-gray-200">
                            <h1 className="text-[#86d2f4] text-xl font-semibold">Services</h1>
                        </div>
                
                    <div className="grid 2xl:grid-cols-3 md:grid-cols-2 sm:grid-cols-2 grid-cols-1 gap-5 ">
                    <Link to={'/add/service/overview'} className="flex box-addservice flex-col justify-center h-[100%]  items-center  border border-solid my-5 gap bg-white ">
                            <i className=" text-[#86d2f4] transition-all duration-300 ease-in-out text-6xl bi bi-plus-circle-fill"></i>
                            <h1 className="text-gray-400 transition-all duration-300 ease-in-out font-semibold text-md ">Create New Service</h1>   
                        </Link>
                            {services.map(service => (
                                <div key={service.id} className=" md:h-[34vh] h-[38vh] items-center  lg:mb-0 rounded-t-lg">
                                    <div key={service.id} className="relative border h-full border-solid rounded-t-lg my-5 gap bg-white">
                                        <Link to={`/service/${service.id}`}>
                                            <div className="containerdiv rounded-t-lg h-[65%] md:h-[70%] w-[100%]">
                                            {
                                                service.image1 == null ?
                                                <img className="border border-gray-200 border-t-0 border-l-0 rounded-t-lg border-r-0 border-b-1  h-[100%] w-[100%]" src={img2} alt={service.title} />:
                                                <img className="border border-gray-200 border-t-0 rounded-t-lg  border-l-0 border-r-0 border-b-1 h-[100%] w-[100%]" src={`http://localhost:8000${service.image3}`} alt={service.title} />
                                            }  
                                            </div>
                                        </Link>
                                        <div className="p-3 ">
                                            <Link to={`/service/${service.id}`} className=" items-center  flex justify-between mb-2">
                                                <h5 className="mb-2 text-lg font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                                                {service.title.length > 21
                                                    ?service.title.substring(0, 20) + "..."
                                                    :service.title
                                                    }
                                                </h5>
                                                {
                                                    service?.price ?
                                                    <h4>{service?.price} $</h4>
                                                    : 
                                                    <></>
                                                } 
                                            </Link>
                                            <div className="flex justify-between items-center">
                                                <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-200">
                                                {service.description.length > 20
                                                    ? service.description.substring(0, 20) + "..."
                                                    : service.description 
                                                }
                                                </p>
                                                <button className="mb-4" onClick={() => handleOptionsClick(service.id)}>
                                                    <i className="bi bi-three-dots"></i>
                                                </button>
                                                
                                            </div>

                                        </div>




                                        {showOptions && selectedService === service.id && (
                                        <div  className={`absolute options-container h-full mt-0 top-0 z-10 flex flex-col justify-between transition-all duration-800 ease-in-out  w-full right-0 bg-white border border-gray-200 rounded-t-lg ${
                                            showOptions && selectedService === service.id
                                              ? "opacity-1"
                                              : "opacity-0"
                                          }`}
                                        >
                                            <div>
                                                <button onClick={() => handleDeleteService(service.id)} className="block w-full text-red-500 font-semibold text-left px-4 text-lg py-2 hover:bg-gray-100">
                                                <i className="bi bi-trash"></i> Delete
                                                </button>
                                                <Link to={`/edit/service/overview/${service.id}`} className="block font-semibold w-full text-left text-lg px-4 py-2 text-gray-700 hover:bg-gray-100">
                                                <i className="bi bi-pencil "></i> Modify
                                                </Link>
                                            </div>
                                            
                                            <div>
                                                <hr />
                                                <button onClick={() => handleOptionsClick(service.id)} className=" w-full flex items-center text-gray-700 font-semibold text-xl  text-left px-4 py-2 hover:bg-gray-100">
                                                <span className="flex items-center">
                                                    <i className="bi bi-x text-2xl"></i> Cancel
                                                </span>
                                                </button>
                                            </div>

                                        </div>
                                        )}
                                    </div>               
                                                                 

                                </div>
                            ))}

                            

                        </div>
                    </div>
                :
            <div className="mx-3 lg:col-span-3 col-span-full">
                <div className=" flex flex-col justify-center items-center mt-10 h-[370px] bg-white border p-5 border-gray-200">
                    <h3 className="mb-10">Ready to earn on your own terms ?</h3>
                    <Link
                    to={"/register/freelancers"}
                    className="py-3 px-4 bg-[#86d2f4] hover:bg-[#135d80] duration-500 transition-all ease-in-out font-semibold text-white rounded-lg text-lg"
                    >
                    Become A Seller
                    </Link>
                </div>
            </div> 
            }
        </div>
        </div>
        );
    } else {
        return <Login />;
    }
}
