import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Login from "./login";
import { useNavigate } from "react-router-dom";
import {saveUserInSession} from '../Helpers/functions';
// import http from '../http';
import Cookies from 'js-cookie';
import img1 from "../images/default.jfif";
import http from "../http";
export default function Profile() {
    const [user, setUser] = useState(null);
    const token = Cookies.get("access_token");
    const navigate = useNavigate();
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
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

    if (document.cookie.match("access_token")) {
        return (
        <div className="grid grid-cols-3 align-center gap-4 mx-auto">
            <div className="col-span-1 mt-10 w-[80%]">
                <div className=" max-w-lg mr-5  bg-white border p-5 border-gray-200 ">
                    <Link to={"/modif"} className="block text-right"><i className="bi bi-pencil text-gray-400"></i></Link>
                    <div className="flex flex-col items-center pb-10">
                        
                    <img
                        className="w-24 h-24 mb-3 rounded-full shadow-lg"
                        src={img1}
                        alt="Bonnie image"
                    />
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
                
                    <div className=" grid grid-cols-3 gap-4 ">

                        <div className=" w-[280px] border border-solid my-5 gap bg-white ">
                                <a href="#!">
                                    <img
                                    className=""
                                    src="https://tecdn.b-cdn.net/img/new/standard/nature/184.jpg"
                                    alt="" />
                                </a>
                                <div className="p-3">
                                        <h5
                                        className="mb-2 text-xl font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                                        Card title
                                        </h5>
                                        <p className="mb-4 text-sm text-neutral-600 dark:text-neutral-200">
                                        Some quick example text to build on the card title and make up the 
                                        </p>
                                        <button
                                        type="button"
                                        className="bg-green-400 hover:bg-indigo-600 transition-all text-sm rounded-md py-2 px-5">
                                        Button
                                        </button>
                                </div>
                        </div>
                        <Link to={'/add/service/overview'} className="flex flex-col justify-center items-center w-[280px] h-[340px] border border-solid my-5 gap bg-white ">
                            <i className=" text-cyan-500 text-6xl bi bi-plus-circle-fill"></i>
                            <h1 className="text-gray-400 font-semibold text-md ">Create New Service</h1>   
                        </Link>
                    </div>
                </div>
                :
            <div className="col-span-2 ">
                <div className=" flex flex-col justify-center items-center mt-10 h-[350px] bg-white border p-5 border-gray-200">
                    <h3 className="mb-10">Ready to earn on your own terms?</h3>
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
