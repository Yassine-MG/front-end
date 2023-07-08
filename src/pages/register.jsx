import React, {useState} from 'react'
import http from '../http'
import { useNavigate } from 'react-router-dom';
import Logged from '../components/ProtectedRoutes/Logged';

export default function Register() {
  const navigate = useNavigate();
  const[inputs,setInputs] = useState({});
  const [error, setError] = useState(null);
  const [emailErrors,setEmailErrors] = useState(null);
  const handleChange = (event)=>{
    const name = event.target.name;
    const value = event.target.value;
    console.log(name);
    console.log(value);
    setInputs(values=>({...values,[name]:value}))
  }

  const submitForm = () =>{
    http.post('/register',inputs).then((res)=>{
      console.log(res);
      if(res.data.status === 200){
        navigate('/');
        setError(null);
      }else if(res.data.status === 204){
        const errors = res;
        console.log(errors);
        const emailError =  errors.email || [];
        setEmailErrors(emailError);
        const passwordErrors = errors.password || [];
        setError(passwordErrors);
      }
    })
    .catch((error) => {
        setError("Something went wrong.");
    });
  }
  if(!document.cookie.match('access_token')){
    return (
      <div className='flex h-screen'>
          <div className=' hidden lg:flex w-[40%] login'>

          </div>
        <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <h1 className='text-center text-4xl'><i className="bi bi-globe pr-2 text-[#86d2f4]"></i></h1>
          <div className="sm:mx-auto sm:w-full sm:max-w-sm">
            <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
              Registration
            </h2>
          </div>

          <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <form className="space-y-6" method="POST">
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    value={inputs.name||''}
                    onChange={handleChange}
                    type="text"
                    required
                    className="block w-full rounded-md border-1 border-gray-300  focus:border-[#86d2f4]  px-3 py-2 text-gray-900 shadow-sm  outline-none placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                <ul>
                      {emailErrors && emailErrors.map((msg) => (
                        <li key={msg} className="text-red-500">{msg}</li>
                        ))}
                    </ul>
                  <input
                    id="email"
                    name="email"
                    value={inputs.email||''}
                    onChange={handleChange}
                    type="email"
                    autoComplete="email"
                    required
                    className="block w-full  border-1 border-gray-300  focus:border-[#86d2f4]  px-3 py-2 rounded-md outline-none text-gray-900 shadow-sm  placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                    Password
                  </label>
                </div>
                <div className="mt-2">
                <ul>
                    {Array.isArray(error) && error.map((msg) => (
                      <li key={msg} className="text-red-500">{msg}</li>
                    ))}
                  </ul>

                  <input
                    id="password"
                    name="password"
                    value={inputs.password||''}
                    onChange={handleChange}
                    type="password"
                    autoComplete="current-password"
                    required 
                    className="block w-full p-3 rounded-md border-1 border-gray-300  focus:border-[#86d2f4]  py-2 text-gray-900 outline-none shadow-sm  placeholder:text-gray-400 focus:ring-2 focus:ring-inset  sm:text-sm sm:leading-6"
                  />
                </div>
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
                    onChange={handleChange}
                    type="password"
                    autoComplete="current-password"
                    required 
                    className="block w-full p-3 border-1 border-gray-300  focus:border-[#86d2f4]  rounded-md py-2 text-gray-900 shadow-sm outline-none  placeholder:text-gray-400   sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <button
                  type="button"
                  onClick={submitForm}
                  className="flex w-full justify-center rounded-md duration-300 bg-[#86d2f4] px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-[#135d80] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2"
                >
                  Register
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
