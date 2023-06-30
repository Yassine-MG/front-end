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
    useEffect(() => {
        const userfromstorage = JSON.parse(sessionStorage.getItem("user"))
        setUser(userfromstorage);
            const id = userfromstorage.id;
            http.get(`/edit/${id}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then((response) => {
                console.log(response);
                saveUserInSession(response.data.user)
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
                fetchServices()
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
        <div className="mt-20 container grid grid-cols-3 align-center gap-4 mx-auto">
            <div className="col-span-1 mt-10 w-[80%]">
                <div className=" max-w-lg mr-5  bg-white border p-5 border-gray-200 ">
                    <Link to={"/modif"} className="block text-right"><i className="bi bi-pencil text-gray-400"></i></Link>
                    <div className="flex flex-col items-center pb-10">
                        
                {    user?.photo ? 
                    <img src={`http://localhost:8000/storage/${user?.photo}`} className="w-24 h-24 mb-3 rounded-full shadow-lg object-cover" alt="" />  
                    :
                    <img
                        className="w-24  mb-3 rounded-full shadow-lg"
                        src={img1}
                        alt="Bonnie image"
                    />
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
                        <div className="flex justify-between mt-2">
                            <h2 className=" font-semibold">From : </h2>
                            <h2> {user?.countries}</h2>
                        </div>
                        
                    </div>
                </div>
                <div className="max-w-lg mr-5 mt-10 bg-white border p-5 border-gray-200">
                    <div >
                        <h2 className=" font-semibold">About me : </h2>
                        <p className="text-sm my-5">{user?.description}</p>
                    </div>
                    <hr />
                    <div className="flex my-5 justify-between">
                        <h2 className=" font-semibold">Language : </h2>
                        <p className="text-sm"><i className="bi bi-translate mr-3"></i>{user?.Language}</p>
                    </div>
                </div>
            </div>
            {sessionUser.role === "Freelancer"?
                <div className="col-span-2">
                        <div className=" flex flex-col justify-center items-center mt-10  bg-white border p-5 border-gray-200">
                            <h1 className="text-green-900 text-xl underline font-semibold">Services</h1>
                        </div>
                
                    <div className=" grid grid-cols-3 gap-[80px] ">

                            {services.map(service => (
                                <div key={service.id} className="relative">
                                    <div key={service.id} className="w-full h-full border border-solid rounded-t-lg   my-5 gap bg-white">
                                        <Link to={`/service/${service.id}`}>
                                            {
                                                service.image1 == null ?
                                                <img className="border border-gray-200 border-t-0 border-l-0 rounded-t-lg border-r-0 border-b-1 h-[70%] w-[100%]" src={img2} alt={service.title} />:
                                                <img className="border border-gray-200 border-t-0 rounded-t-lg  border-l-0 border-r-0 border-b-1 h-[70%] w-[100%]" src={`http://localhost:8000${service.image3}`} alt={service.title} />
                                            }  
                                        </Link>
                                        <div className="p-3">
                                            <Link to={`/service/${service.id}`} className="  flex justify-between mb-2">
                                                <h5 className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
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
                                    </div>                                            
                                    {showOptions && selectedService === service.id && (
                                        <div  className={`absolute options-container flex flex-col justify-between transition-all duration-800 ease-in-out top-4 w-full h-full right-0 mt-1 bg-white border border-gray-200 rounded-t-lg ${
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
                            ))}
                        <Link to={'/add/service/overview'} className="flex flex-col justify-center items-center w-[280px] h-[340px] border border-solid my-5 gap bg-white ">
                            <i className=" text-cyan-500 text-6xl bi bi-plus-circle-fill"></i>
                            <h1 className="text-gray-400 font-semibold text-md ">Create New Service</h1>   
                        </Link>
                        </div>
                    </div>
                :
            <div className="col-span-2 ">
                <div className=" flex flex-col justify-center items-center mt-10 h-[350px] bg-white border p-5 border-gray-200">
                    <h3 className="mb-10">Ready to earn on your own terms ?</h3>
                    <Link
                    to={"/register/freelancers"}
                    className="py-3 px-4 bg-green-600 font-semibold text-white rounded-lg text-lg"
                    >
                    Become A Seller
                    </Link>
                </div>
            </div> 
            }
        </div>
        );
    } else {
        return <Login />;
    }
}
