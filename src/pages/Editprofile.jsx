import React, { useEffect, useState } from 'react'
import http from '../http'
import { useNavigate } from "react-router-dom";
import Login from './login';
import Cookies from 'js-cookie';
import img1 from "../images/default.jfif";
export default function EditProfile() {
    const[inputs,setInputs] = useState({});
    const[error,setError] = useState("");
    const [countries, setCountries] = useState([]);
    const [defaultImage, setDefaultImage] = useState('default.jpg');
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
            }).catch(err=>{
                console.log(err)
                setError(err.response.data.message+'*')
            })
            http.get(`/edit/${id}`,{headers: {"Authorization": `Bearer ${token}`}}).then(response=>{
                console.log(response)
                sessionStorage.setItem('user', JSON.stringify(response.data.user));
                navigate("/profile");
        })

    }
    if(document.cookie.match("access_token")){
    return (
        <div>
            <div className="mt-10">
                <div className=" w-[85%] mx-auto bg-white border p-5 border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
                    <form onSubmit={handleSubmit} method="put">
                    <div className="flex justify-center items-center space-x-6">
                    <div className="shrink-8">
                        {inputs.photo ? (
                            <img
                            className="h-16 w-16 object-cover rounded-full"
                            src={defaultImage}
                            alt="Current profile photo"
                            />
                        ) : (
                            <img
                            className="h-16 w-16 object-cover rounded-full"
                            src={img1}
                            alt="Current profile photo"
                            />
                        )}
                    </div>
                        <label className="block">
                            <span className="sr-only">Choose profile photo</span>
                            <input type="file" 
                                    accept="image/*"
                                    name="photo"
                                    onChange={handleInput}
                                    className="block w-full  text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-violet-50 file:text-violet-900 hover:file:bg-violet-100"
                            />
                        </label>
                    </div>
                    <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            First name
                        </label>
                        <div className="mt-2">
                            <input
                            type="text"
                            name="name"
                            id="name"
                            value={inputs.name||''}
                            onChange={handleInput}
                            autoComplete="given-name"
                            className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="sm:col-span-4">

                            <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                                Email address
                            </label>
                            <span className='text-red-500'>{error}</span>
                            <div className="mt-2">
                                <input
                                id="email"
                                name="email"
                                value={inputs.email||''}
                                onChange={handleInput}
                                type="email"
                                autoComplete="email"
                                className="block w-full px-2 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                />
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
                                value={inputs.description||''}
                                onChange={handleInput}
                                rows={3}
                                className="block w-full p-2 text-lg font-semibold rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                            </div>
                            <p className="mt-3 text-sm leading-6 text-gray-600">
                            Write a Description about yourself.
                            </p>
                        </div>
                        <hr />
                        <div className="sm:col-span-3 mt-5">

                            <div className="mt-2 mb-5 flex justify-between">

                                <div className='w-full'>
                                <label htmlFor="Language" className="block text-sm font-medium leading-6 text-gray-900">
                                    Languages :
                                </label>
                                    <select
                                    id="Language"
                                    name="Language"
                                    autoComplete="country-name"
                                    onChange={handleInput}
                                    value={inputs.Language||''}
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                                    >
                                        <option>English</option>
                                        <option>Frensh</option>
                                        <option>Spanish</option>
                                        <option>Arabic</option>
                                    </select>
                                </div>

                                <div className='w-full'>
                                <label htmlFor="Language" className="block ml-5  text-sm font-medium leading-6 text-gray-900">
                                    Country From :
                                </label>
                                    <select
                                    id="countries"
                                    name="countries"
                                    autoComplete="country-name"
                                    onChange={handleInput}
                                    value={inputs.countries||''}
                                    className="block w-full mx-5 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
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
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    name="skills"
                                    value={inputs.skills||''}
                                    onChange={handleInput}
                                    id="skills"
                                    autoComplete="given-name"
                                    className="block w-full p-2 text-lg font-semibold rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                        <button
                            type="submit"
                            className="flex w-full mt-8 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                            >
                            Submit
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}else{
        return <Login />;
    }
}
