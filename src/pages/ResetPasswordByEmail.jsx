import React, { useState } from 'react';
import { useNavigate, Link} from "react-router-dom";
import http from "../http";
import {saveUserInSession} from '../Helpers/functions';
import Logged from '../components/ProtectedRoutes/Logged';
export default function ResetPasswordByEmail() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const sendResetEmail = async (event) => {
    event.preventDefault();
    try {
      const response = await http.post('/send/password/reset/email', { email });
     console.log(response);
    } catch (error) {
      console.error(error);
    }
    
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
              Reset Your Password
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" onSubmit={sendResetEmail}>
              <h2 className="text-center text-red-600 font-bold">{error}</h2>
              <div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="my-5">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="block w-full rounded-md border-0 p-3 py-1.5 text-gray-900 outline-none shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#86d2f4] sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
                
                <button
                  type="submit"
                  className="flex w-full justify-center rounded-md duration-300 bg-[#86d2f4] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#135d80] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Send Code
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
