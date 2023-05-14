import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom'
import http from '../../http';
import Cookies from 'js-cookie';


import NavLinks from './navlinks'
const Navbar = () => {
    const [open, setOpen] = useState(false);
    // const [isAuthenticated, setIsAuthenticated] = useState(false);
    const navigate = useNavigate();

        useEffect(() => {
            if(document.cookie.match('access_token')){
            const checkAuth = async () => {
            try {
                // create an axios instance with the `withCredentials` option set to `true`
                const instance = http.create({
                    withCredentials: true,           
                });
                // send a request to the server to check if the access token is valid
                await instance.get("/checkauth");
                    // setIsAuthenticated(true); 
            } catch (err) {
                // if the request is not successful, redirect the user to the login page
                navigate("/login");
            }
            };
            checkAuth();
        }
        });

        const handleLogout = async () => {
            const token = Cookies.get('access_token');
                try {
                // const instance = http.create();
                // var obj = JSON.parse(sessionStorage.user);
                await http.post('/logout',{headers: {"Authorization": `Bearer ${token}`}});
                Cookies.remove('access_token');
                sessionStorage.removeItem("user");
                sessionStorage.removeItem("id");
                // console.log(obj);
                navigate('/login');
                // setIsAuthenticated(false);
                } catch (err) {
                    console.log(err);
                }
            };


  return (
    <nav className='bg-white border border-gray-200 border-t-0 border-l-0 border-r-0 border-b-1'>
        <div className='flex items-center font-medium justify-around'>
            <div className='z-50 md:mb-0 mb-5 md:pt-0 pt-5 px-5 md:w-auto flex justify-between w-full'>
                <Link to={"/"}><h1 className=' text-[20px] md:mt-0'>The Freelance Hub</h1></Link>
                <div className='text-3xl md:hidden' onClick={()=>setOpen(!open)}>
                <ion-icon name={`${open ?'close-outline':'menu-outline'}`}></ion-icon>
                </div>
            </div>
            
            <ul className=' md:flex hidden uppercase items-center gap-4'>
                <li>
                    <Link to={"/"} className='py-7 px-3 inline-block'>Home</Link>
                </li>
                <NavLinks></NavLinks>
            </ul>
            <div className='md:block hidden '>
                {document.cookie.match('access_token') ?
                    <>
                        <button className='mr-5' onClick={handleLogout}>Log Out</button>
                        <Link to={"/profile"} className='ml-4'>Profile</Link>
                    </>

                    : <>
                    <Link to={"/register"} className='bg-sky-500/50 mx-4 px-6 py-2 rounded-full '>Register</Link>
                    <Link to={"/login"} className='bg-sky-500/50 py-2 px-6 rounded-full'>Log in</Link>
                    </> 
                    }

            </div>
            {/* Mobile nav */}
            <ul className={`md:hidden bg-white absolute w-full h-full bottom-0 py-20 pl-4 duration-500 ${open? "left-0":"left-[-100%]"}`}>
                <li>
                        <Link to={"/"} className='py-7 px-3 inline-block'>Home</Link>
                    </li>
                    <NavLinks></NavLinks>
                    <div className='py-5 flex  flex-col'>
                    {document.cookie.match('access_token') ? 
                        <>
                            <button className='mr-5' onClick={handleLogout}>Log Out</button>
                            <Link to={"/profile"} className='ml-4'>Profile</Link>
                        </>
                        : <> 
                        <Link to={"/register"} className='bg-sky-500/50 w-[100px] mb-10 md:mx-4 px-6 py-2 rounded-full '>Register</Link>
                        <Link to={"/login"} className='bg-sky-500/50 py-2 w-[100px] px-6 rounded-full'>Log in</Link>
                        </>
                    }
                    </div>
                </ul>
        </div>
    </nav>
  )
}

export default Navbar