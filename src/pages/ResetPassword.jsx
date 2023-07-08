import React, { useState, useParams } from 'react';
import { useNavigate, Link} from "react-router-dom";
import http from "../http";
// import {saveUserInSession} from '../Helpers/functions';
import Logged from '../components/ProtectedRoutes/Logged';
export default function ResetPassword() {
  const { token } = useParams(); // Use useParams to access the route parameters
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");

  const resetPassword = async (event) => {
    event.preventDefault();
    try {
      const response = await http.post('/reset-password', {
        token,
        password,
        password_confirmation: passwordConfirmation,
      });

      if (response.status === 200) {
        console.log('Password reset successfully');
      } else {
        console.log('Error resetting password');
      }
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
              Sign in to your Freelance Hub
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6">
              <h2 className="text-center text-red-600 font-bold">{error}</h2>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>

                </div>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full rounded-md border-0 p-3 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#86d2f4] outline-none sm:text-sm sm:leading-6"
                  />
                </div>
                <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password Confirmation
                  </label>
                </div>
                <div className="mt-2">
                  <span>
                  </span>
                  <input
                    id="password_confirmation"
                    name="password_confirmation"
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    autoComplete="current-password"
                    required 
                    className="block w-full p-3 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
                <Link className=' text-[#62a1be] hover:text-[#135d80] block mt-2 underline text-sm'>Forgot Password</Link>
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