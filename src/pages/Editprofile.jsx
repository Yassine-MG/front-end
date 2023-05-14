import React, { useEffect, useState } from 'react'
import http from '../http'
import { useNavigate } from "react-router-dom";
import Login from './login';
import Cookies from 'js-cookie';
export default function EditProfile() {
    const[inputs,setInputs] = useState({});
    const[error,setError] = useState("");
    const [countries, setCountries] = useState([]);
    const navigate = useNavigate();
    
    useEffect(()=>{
    const token = Cookies.get("access_token");
    if(token){
        const userfromstorage = JSON.parse(sessionStorage.getItem("user"))
        const id = userfromstorage.id
        http.get(`/edit/${id}`, {headers: {"Authorization": `Bearer ${token}`}}).then(res=>{
            setInputs(res.data.user);
        })
        http.get('https://countriesnow.space/api/v0.1/countries/positions').then(res=>{
            const data = res.data.data.flat();
            setCountries(data.map(item => item.name));
            console.log(countries);
        })
    }
    },[])

    const handleInput = (event)=>{
        const name = event.target.name;
        const value = event.target.value;
        setInputs(values=>({...values,[name]:value}))
    }
    
    function handleSubmit (event) {
        event.preventDefault()
            const token = Cookies.get("access_token");
            const userfromstorage = JSON.parse(sessionStorage.getItem("user"));
            const id = userfromstorage.id;
            console.log(id);
            http.put(`/update/${id}`,inputs,{headers: {"Authorization": `Bearer ${token}`}}).then(res=>{
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
