import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Login from "./login";
// import http from '../http';
import Cookies from 'js-cookie';
import img1 from "../images/default.jfif";
import http from "../http";
export default function Profile() {
    const [user, setUser] = useState(null);
    const token = Cookies.get("access_token");
    useEffect(() => {
        const userFromStorage = JSON.parse(sessionStorage.getItem("user"));
        setUser(userFromStorage);
    }, []);
    useEffect(() => {
        const userfromstorage = JSON.parse(sessionStorage.getItem("user"))
        
            // if(userfromstorage == null){
            //     // throw new Error('User deleted from session storage')
            //     navigate('/');
            // }
            const id = userfromstorage.id;

            http.get(`/edit/${id}`,{headers: {"Authorization": `Bearer ${token}`}})
            .then((response) => {
                console.log(response);
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
                        <h2 className=" font-semibold">Description : </h2>
                        <p className="text-sm my-5">{user?.description}</p>
                    </div>
                    <hr />
                    <div className="flex my-5 justify-between">
                        <h2 className=" font-semibold">Language : </h2>
                        <p className="text-sm"><i className="bi bi-translate mr-3"></i>{user?.Language}</p>
                    </div>
                </div>
            </div>
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
        </div>
        );
    } else {
        return <Login />;
    }
}
