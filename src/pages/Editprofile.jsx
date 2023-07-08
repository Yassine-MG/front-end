import React, { useEffect, useState, useRef } from 'react'

import http from '../http'
import { useNavigate, Link } from "react-router-dom";
import Login from './login';
import Cookies from 'js-cookie';
import img1 from "../images/default.jfif";

export default function EditProfile() {
    const[inputs,setInputs] = useState({});
    const[error,setError] = useState([]);
    const [countries, setCountries] = useState([]);
    const [defaultImage, setDefaultImage] = useState('default.jpg');
    const [focusedInput, setFocusedInput] = useState('');
    const navigate = useNavigate();

    
    useEffect(()=>{
    const token = Cookies.get("access_token");
    if(token){
        const userfromstorage = JSON.parse(sessionStorage.getItem("user"))
        const id = userfromstorage.id
        http.get(`/edit/${id}`, {headers: {"Authorization": `Bearer ${token}`}}).then(res=>{
            setInputs(res.data.user);
            if (res.data.user.photo) {
                // If the user has a photo in the database, update the default image URL
                setDefaultImage(`http://localhost:8000/storage/${res.data.user.photo}`);
              }
        })
        http.get('https://countriesnow.space/api/v0.1/countries/positions').then(res=>{
            const data = res.data.data.flat();
            setCountries(data.map(item => item.name));
            console.log(countries);
        })
    }
    },[])

    const handleInput = (event) => {
        if (event.target.name === 'photo') {
          // Handle profile picture input separately
            const file = event.target.files[0];
        
            if (file) {
                // If a file is selected, display the selected image
                setInputs((values) => ({
                ...values,
                photo: file,
                }));
                const reader = new FileReader();
                reader.onload = (e) => {
                setDefaultImage(e.target.result);
                };
                reader.readAsDataURL(file);
            } else {
                // If no file is selected, display the default image or the user's existing photo
                setInputs((values) => ({
                ...values,
                photo: null,
                }));
                if (inputs.photo) {
                // If the user has a photo, display it
                setDefaultImage(`http://localhost:8000/storage/${inputs.photo}`);
                } else {
                // If the user doesn't have a photo, display the default image
                setDefaultImage(img1);
                }
            }
            } else {
            // Handle other inputs
            const name = event.target.name;
            const value = event.target.value;
            setInputs((values) => ({ ...values, [name]: value }));
            }
        };
    
    function handleSubmit (event) {
        event.preventDefault()
            const token = Cookies.get("access_token");
            const userfromstorage = JSON.parse(sessionStorage.getItem("user"));
            const id = userfromstorage.id;
            console.log(id);
            const formData = new FormData();
            formData.append('_method', 'put');
            formData.append('photo', inputs.photo);
            // Append other form data
            Object.keys(inputs).forEach((key) => {
                if (key !== 'photo') {
                    formData.append(key, inputs[key]);
                }
            });
            http.post(`/update/${id}`,formData,{
                'Content-Type': 'multipart/form-data',
                headers: {"Authorization": `Bearer ${token}`
            }}).then(res=>{
                console.log(res.data)
                sessionStorage.setItem('user', JSON.stringify(res.data.user));
                navigate("/profile");
            }).catch(err=>{
                console.log(err)
                setError(err.response.data.errors)
            })


    }
    console.log(error);
    const handleFocus = (inputId) => {
        setFocusedInput(inputId);
      };
    
      const handleBlur = () => {
        setFocusedInput('');
      };
    if(document.cookie.match("access_token")){
    return (
        <div className='min-h-screen lg:mt-[200px] my-24'>
            <div className="mt-10 lg:w-[80%] mx-auto">
                <div className=" w-[85%] mx-auto bg-white border p-4 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <form onSubmit={handleSubmit} method="put">
                    <div className="block  sm:flex justify-center items-center space-x-6">
                    <div className="shrink-8 ">
                        {inputs.photo ? (
                            <img
                            className="h-16 w-16 mx-auto object-cover rounded-full"
                            src={defaultImage}
                            alt="Current profile photo"
                            />
                        ) : (
                            <img
                            className="h-16 w-16 mx-auto object-cover rounded-full"
                            src={img1}
                            alt="Current profile photo"
                            />
                        )}
                    </div>
                    
                        <label className="block ">
                            <span className="sr-only ">Choose profile photo</span>
                            <input type="file" 
                                    accept="image/*"
                                    name="photo"
                                    capture="user"
                                    onChange={handleInput}
                                    className=" w-full  text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-[#f3efef] file:text-[#86d2f4] cursor-pointer hover:file:bg-[#ebf0f3]"
                            />
                        </label>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            First name
                        </label>
                        <div className="mt-2 relative">
                            <input
                            type="text"
                            name="name"
                            id="name"
                            onFocus={() => handleFocus('name')}
                            onBlur={handleBlur}
                            value={inputs.name||''}
                            onChange={handleInput}
                            autoComplete="given-name"
                            className={`block w-full pr-2 pl-9 rounded-md  border-1  focus:border-[#73caf3] outline-none  py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6`}
                            />
                            <span className={`absolute transition-all ease-in-out duration-300 ${focusedInput === 'name' ? "text-[#73caf3]" : "text-gray-400"} left-3 top-2`}>
                                <i className="bi bi-person"></i>
                            </span>
                            <span className='text-red-500 font-semibold text-xs'>{error.name ?"*" + error.name :<></>}</span>
                        </div>
                        <div className="sm:col-span-4">

                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            
                            <div className="mt-2 relative">
                                <input
                                id="email"
                                name="email"
                                onFocus={() => handleFocus('email')}
                                onBlur={handleBlur}
                                value={inputs.email ||''}
                                onChange={handleInput}
                                type="email"
                                autoComplete="email"
                                className="block w-full pr-2 rounded-md outline-none border-1  focus:border-[#73caf3] pl-9 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#86d2f4] sm:text-sm sm:leading-6"
                                />
                            <span className={`absolute transition-all ease-in-out duration-300 ${focusedInput === 'email' ? "text-[#73caf3]" : "text-gray-400"} left-3 top-2`}>
                            <i className="bi bi-envelope"></i>
                            </span>
                            <span className='text-red-500 font-semibold text-xs'>{error.email ?"*" + error.email :<></>}</span>
                            </div>
                        </div>
                    </div>
                        <div className="col-span-full mb-5">
                            <label
                            htmlFor="description"
                            className="block text-sm font-medium leading-6 text-gray-900"
                            >
                            About
                            </label>
                            <div className="mt-2">
                            <textarea
                                id="description"
                                name="description"
                                value={inputs.description == "null" ? '': inputs.description}
                                onChange={handleInput}
                                rows={3}
                                className="block w-full p-2 text-lg border-1  focus:border-[#73caf3] font-semibold outline-none rounded-md py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            />
                            </div>
                            <p className="mt-3 text-xs leading-6 font-semibold text-gray-600">
                            Write a Description about yourself.
                            </p>
                        </div>
                        <hr />
                        <div className="sm:col-span-3 mt-5">

                            <div className="mt-2 mb-5 grid grid-cols-2 gap-4">

                                <div className=' sm:col-span-1 col-span-2'>
                                <label htmlFor="Language" className="block text-sm font-medium leading-6 text-gray-900">
                                    Languages :
                                </label>
                                    <select
                                    id="Language"
                                    name="Language"
                                    autoComplete="country-name"
                                    onChange={handleInput}
                                    value={inputs.Language||''}
                                    className="block w-full rounded-md outline-none border-1 focus:border-[#73caf3] py-1.5 text-gray-900 shadow-sm sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option>English</option>
                                        <option>Frensh</option>
                                        <option>Spanish</option>
                                        <option>Arabic</option>
                                    </select>
                                </div>

                                <div className='sm:col-span-1  col-span-2'>
                                <label htmlFor="Language" className="block  text-sm font-medium leading-6 text-gray-900">
                                    Country From :
                                </label>
                                    <select
                                    id="countries"
                                    name="countries"
                                    autoComplete="country-name"
                                    onChange={handleInput}
                                    value={inputs.countries == "null" ? '': inputs.countries}
                                    className="block w-full rounded-md border-1 outline-none focus:border-[#73caf3] py-1.5 text-gray-900 shadow-sm sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        {countries.map(country => (
                                            <option key={country}>{country}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <hr />
                            <div className="sm:col-span-3 mt-2">
                                <label htmlFor="skills" className="block text-sm font-medium leading-6 text-gray-900">
                                    Skills
                                </label>
                                <div className="mt-2 relative">
                                    <input
                                    type="text"
                                    name="skills"
                                    onFocus={() => handleFocus('skills')}
                                    onBlur={handleBlur}
                                    value={inputs.skills == "null" ? '': inputs.skills}
                                    onChange={handleInput}
                                    id="skills"
                                    autoComplete="given-name"
                                    className="block w-full pr-2 text-lg pl-9 font-semibold outline-none rounded-md border-1 focus:border-[#73caf3] py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    />

                                    <span className={`absolute transition-all ease-in-out duration-300 ${focusedInput === 'skills' ? "text-[#73caf3]" : "text-gray-400"} left-3 top-2`}>
                                        <i className="bi bi-lightning-charge-fill"></i>
                                     </span>
                                </div>
                            </div>
                        </div>
                        <div className='flex justify-end my-10'>
                            <Link to={"/profile"} className='text-red-700 hover:text-white border border-red-700 duration-300 transition-all  hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-2 text-center mx-2 '>Cancel</Link>
                            <button
                                type="submit"
                                className="text-[#86d2f4] hover:text-white border border-[#86d2f4] duration-300 transition-all  hover:bg-[#39a0cf] focus:ring-4 focus:outline-none focus:ring-[#9dd4ee] font-medium rounded-lg text-sm px-6 py-2 text-center mx-2"
                                >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}else{
        return <Login />;
    }
}
