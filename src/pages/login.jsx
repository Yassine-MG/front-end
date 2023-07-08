import React, { useState } from 'react';
import { useNavigate, Link} from "react-router-dom";
import http from "../http";
import {saveUserInSession} from '../Helpers/functions';
import Logged from '../components/ProtectedRoutes/Logged';
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [error, setError] = useState([]);
  const [focusedInput, setFocusedInput] = useState('');

  const handleFocus = (inputId) => {
    setFocusedInput(inputId);
  };

  const handleBlur = () => {
    setFocusedInput('');
  };
  const handleSubmit = async (event)=>{
    event.preventDefault();
    await http.post('/auth', {email, password})
      .then((response) => {
        console.log(response);
        if (response.status === 200) {
          setEmail("");
          setPassword();
          const inf = response.data.user;
          console.log(inf);
          const id = response.data.user.id;
          const token = response.data.access_token;
          console.log(token);
          console.log(id);
          // sessionStorage.setItem('user', JSON.stringify(inf));
          saveUserInSession(inf);
          document.cookie = `access_token=${token}; path=/; secure; http-only`;
          navigate("/");
          window.location.reload();
        } else if (response.status === 204) {
          console.log("error");
        }
      })
      .catch((error) => {
        console.error(error);
        setError(error.response.data.error);
        console.error(error.response.data.error);
      });
  }
  if(!document.cookie.match('access_token')){
    return (
      <div className='flex'>
        <div className=' hidden lg:flex w-[40%] login'>

        </div>
        <div className={`flex min-h-screen flex-1 flex-col justify-center px-6 py-12 lg:px-8`}>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h1 className='text-center text-4xl'><i className="bi bi-globe pr-2 text-[#86d2f4]"></i></h1>
            
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Sign in to your Freelance Hub
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <h2 className="text-center text-red-600 font-bold">{error}</h2>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2 relative">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onFocus={() => handleFocus('email')}
                    onBlur={handleBlur}
                    onChange={(e)=>setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-1  border-gray-300  focus:border-[#86d2f4]  pl-9 pr-3 py-2 text-gray-900 outline-none shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                  />
                    <span className={`absolute transition-all ease-in-out duration-300 ${focusedInput === 'email' ? "text-[#73caf3]" : "text-gray-400"} left-3 top-2`}>
                      <i className="bi bi-envelope-at"></i>
                    </span>
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>

                </div>
                <div className="mt-2 relative">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    onFocus={() => handleFocus('password')}
                    onBlur={handleBlur}
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-1 border-gray-300 focus:border-[#86d2f4] pl-9 pr-3 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#86d2f4] outline-none sm:text-sm sm:leading-6"
                  />
                  <span className={`absolute transition-all ease-in-out duration-300 ${focusedInput === 'password' ? "text-[#73caf3]" : "text-gray-400"} left-3 top-2`}>
                    <i className="bi bi-key"></i>
                  </span>
                </div>
                <Link to={"/reset/password/email"} className=' text-[#62a1be] hover:text-[#135d80] block mt-2 underline text-sm'>Forgot Password</Link>
              </div>
              <div>
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md duration-300 bg-[#86d2f4] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#135d80] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }else{
    return(<Logged/>)
  }
}
