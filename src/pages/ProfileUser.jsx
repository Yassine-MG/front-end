import React, { useEffect, useState } from "react";
import img2 from "../images/defaultpic.jpg";
import img1 from "../images/default.jfif";
import { Link, useParams } from 'react-router-dom';
import http from "../http";
export default function ProfileUser() {
    const [user, setUser] = useState(null);
    const [services, setServices] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const { id } = useParams();

        useEffect(() => {
            http.get(`/user/${id}`)
            .then(response => {
                setUser(response.data.user);
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
        
            http.get(`/user/${id}/services`)
            .then(response => {
                setServices(response.data.services);
                console.log(response);
            })
            .catch(error => {
                console.log(error);
            });
        }, [id]);

  return (
    <div className="my-20 mx-5 md:mx-0 min-h-screen">
        <div className="container grid grid-cols-5 align-center gap-4 mx-auto">
            <div className="lg:col-span-2 mt-10 col-span-5">
                <div className=" bg-white border p-5 border-gray-200 ">
                    <div className="flex flex-col items-center pb-10">
                        
                {    user?.photo ? 
                    <img src={`http://localhost:8000/storage/${user?.photo}`} className="w-24 h-24 mb-3 cursor-pointer hover:scale-110 duration-300 transition-all rounded-full shadow-lg object-cover" alt={user?.name} onClick={() => setIsModalOpen(true)}/>  
                    :
                    <img
                        className="w-24  mb-3 rounded-full hover:scale-110 duration-300 transition-all shadow-lg"
                        src={img1}
                        alt="Bonnie image"
                        onClick={() => setIsModalOpen(true)}

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
                        <div className="flex justify-between mt-2">
                            <h2 className=" font-semibold">From : </h2>
                            <h2> {user?.countries}</h2>
                        </div>
                        
                    </div>
                </div>
                <div className=" mt-10 bg-white border p-5 border-gray-200">
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
            <div className="lg:col-span-3 col-span-5">
                    <div className=" flex flex-col justify-center items-center mt-10  bg-white border p-5 border-gray-200">
                        <h1 className="text-[#86d2f4] text-xl  font-semibold">Services</h1>
                    </div>
            {services && services.length > 0 ? (
                <div className=" grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-2 gap-[20px]  grid-cols-1">
                        {services.map(service => (
                            <div key={service.id} className="relative xl:col-span-1 md:col-span-1">
                                <div key={service.id} className="w-full h-fit min-h-[400px] border border-solid rounded-t-lg my-5 gap bg-white">
                                    <Link to={`/service/${service.id}`}>
                                        {
                                            service.image1 == null ?
                                            <img className="border border-gray-200 border-t-0 object-cover border-l-0 rounded-t-lg border-r-0 border-b-1 h-[70%] w-[100%]" src={img2} alt={service.title} />:
                                            <img className="border border-gray-200 border-t-0 rounded-t-lg object-cover h-[280px]  border-l-0 border-r-0 border-b-1 w-[100%]" src={`http://localhost:8000${service.image3}`} alt={service.title} />
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
                                                <h4 className="font-semibold">{service?.price} $</h4>
                                                : 
                                                <></>
                                            } 
                                        </Link>
                                        <div className="flex justify-between items-center">
                                            <p className="mb-4 text-sm text-neutral-600 font-semibold dark:text-neutral-200">
                                            {service.description.length > 20
                                                ? service.description.substring(0, 20) + "..."
                                                : service.description 
                                            }
                                            </p>
                                        </div>

                                    </div>
                                </div>                                            
                            </div>
                            
                        ))}
                    </div>
                ) : (
                    <p>No services found.</p>
                )}
                </div>
        </div>
    </div>
  )
}
