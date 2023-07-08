import React, {useEffect, useState} from 'react'
import {deleverytimes ,saveUserInSession,options} from '../../Helpers/functions';
import { Link, useNavigate } from "react-router-dom";
import Cookies from 'js-cookie';
import http from '../../http'
export default function PriceFrom() {
    const [selectedOption, setSelectedOption] = useState("");
    const [errors, setErrors] = useState([]);
    const navigate = useNavigate();
    const token = Cookies.get("access_token");
    const servicefromstorage = JSON.parse(sessionStorage.getItem("service"))
    const id = servicefromstorage.id
    const userFromStorage = JSON.parse(sessionStorage.getItem("service"));
    const category = userFromStorage.category;
    const selectedOptions = options.find((option) => option.value === category);
    const dynamicInputs = selectedOptions ? selectedOptions.inputs : [];
    const[inputs,setInputs] = useState({
        offer_name: '',
        details: '',
        price: '',
        delevery:'',
    });
console.log(category);

    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        console.log(event.target.value);
        setInputs({ ...inputs, delevery: event.target.value })
        };
    const handleSubmit = (e) => {
        e.preventDefault();
        const selectedInputs = dynamicInputs.map((input) => {
            return {
                name: input.name,
                value: inputs[input.name] || '', 
            };
        });
    
        const data = {
            ...inputs,
            delevery: selectedOption,
            dynamicInputs: selectedInputs,
        };
        http.put(`/add/price/${id}`,data,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response => {
            console.log(response.data.user);
            saveUserInSession(response.data.user);
            navigate('/add/service/fileform')
        })
        .catch(error => {
            console.log(error);
            setErrors(error.response.data.errors)
        });
    };
    return (
        <div className='my-[100px]'>

        
        <div className='w-[100%] md:w-[70%] mx-auto border p-4  border-gray-200'>
            <form>
                <div className='grid grid-cols-5 '>
                    <div className=' xl:col-span-1 md:col-span-2 col-span-5'>
                        <h1 className='text-lg font-semibold '>Title</h1>
                        <p className='text-sm'>Name Your Offer </p>
                    </div>
                    <div className='md:col-span-3 col-span-5 mt-2 md:mt-0 xl:col-span-4'>
                        <input
                            type="text"
                            name="offer_name"
                            maxLength={"55"}
                            value={inputs.offer_name} 
                            onChange={(e) => setInputs({ ...inputs, offer_name: e.target.value })}
                            id="name_offer"
                            className="block border-1 px-2 w-full border-gray-300 h-[40px] focus:border-[#86d2f4] outline-none text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm"
                        />
                        {
                            errors.offer_name ?<h4 className='text-xs font-bold text-red-500'>*{errors.offer_name}</h4> :<></>
                        }
                    </div>

                </div>
               
                <div className='grid items-center my-3 grid-cols-5 '>
                    <div className='xl:col-span-1 md:col-span-2 col-span-5'>
                        <h1 className='text-lg font-semibold my-2'>Description</h1>
                        <p className='text-sm'>Describe the details of your offering </p>
                    </div>
                    <div className='md:col-span-3 col-span-5 mt-2 md:mt-0 xl:col-span-4'>
                        <textarea className='resize-none w-full p-2 outline-none  border-1 border-gray-300 focus:border-[#86d2f4] h-[10vh]' value={inputs.details} onChange={(e) => setInputs({ ...inputs, details: e.target.value })} rows="2" maxLength="200" cols="100" name="details" id="details" ></textarea>
                        {
                            errors.details ?<h4 className='text-xs font-bold text-red-500'>*{errors.details}</h4> :<></>
                        }
                    </div>
                </div>
                <div className='grid items-center my-3 grid-cols-5  '>
                    <div className='xl:col-span-1 md:col-span-2 col-span-5'>
                        <h1 className='text-lg font-semibold'>Delevery Day </h1>
                    </div>
                    <div className='md:col-span-3 col-span-5 mt-2 md:mt-0 xl:col-span-4'>
                        <select className='block w-full outline-none border-1 border-gray-300 focus:border-[#86d2f4] py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' value={selectedOption} onChange={handleSelectChange}>
                            <option value="">Select an option</option>
                            {deleverytimes.map((deleverytime) => (
                                <option key={deleverytime.value} value={deleverytime.value}>
                                {deleverytime.label}
                                </option>
                            ))}
                        </select>
                        {
                            errors.delevery ?<h4 className='text-xs font-bold text-red-500'>*{errors.delevery}</h4> :<></>
                        }
                    </div>
                </div>
                <div className='grid items-center  grid-cols-5  my-3 input-box'>
                    <div className='xl:col-span-1 md:col-span-2 col-span-5 items-center'>
                        <h1 className='text-lg font-semibold my-2'>Price</h1>
                    </div>
                    <div className='md:col-span-3 col-span-5 mt-2 md:mt-0 xl:col-span-4'>
                    <input
                        type="number"
                        name="price"
                        id="price"
                        value={inputs.price} 
                        onChange={(e) => setInputs({ ...inputs, price: e.target.value })}
                        className="block webki w-full border-1 border-gray-300 focus:border-[#86d2f4] h-[40px] px-2 outline-none text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                    />
                    {
                        errors.delevery ?<h4 className='text-xs font-bold text-red-500'>*{errors.delevery}</h4> :<></>
                    }
                    </div>
                </div>
                {dynamicInputs.map((input, index) => (
                    <div key={index} className=" input-box">

                            {input.type === "checkbox" ? (
                            <div className=' my-2'>
                                <input
                                    type="checkbox"
                                    id={index}
                                    name={input.name}
                                    checked={inputs[input.name] || false}
                                    onChange={(e) =>
                                    setInputs({ ...inputs, [input.name]: e.target.checked })
                                    }
                                    className="mr-4 cursor-pointer px-2 outline-none focus:ring-[#86d2f4] text-[#fff] accent-[#86d2f4] w-5 h-5 transition-all duration-300"
                                /><label htmlFor={index} className='text-lg font-semibold'>{input.label}</label>
                            </div>
                        ) : input.type === "select" ? (
                            <div className='grid items-center  grid-cols-5'>
                                <div className=" xl:col-span-1 md:col-span-2 col-span-5 my-2.5">
                                    <h1 className="text-lg font-semibold ">{input.label}</h1>
                                </div>
                                <select
                                    className="block  md:col-span-3 col-span-5 xl:col-span-4  my-3 border-1 border-gray-300 py-2  focus:border-[#86d2f4] outline-none  text-gray-900 shadow-sm  placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    value={inputs[input.name] || ""}
                                    onChange={(e) =>
                                    setInputs({ ...inputs, [input.name]: e.target.value })
                                    }
                                >
                                    {input.options.map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                    ))}
                                </select>
                            </div>
                        ) : (
                            <div>
                                <div className=" xl:col-span-1 md:col-span-2 col-span-5 my-2.5">
                                    <h1 className="text-lg font-semibold ">{input.label}</h1>
                                </div>
                                <textarea
                                    className="resize-none outline-none mt-2 md:mt-0 md:col-span-3 col-span-5 xl:col-span-4  border  border-gray-200 h-[10vh]"
                                    value={inputs[input.name] || ""}
                                    onChange={(e) =>
                                    setInputs({ ...inputs, [input.name]: e.target.value })
                                    }
                                    rows="2"
                                    cols="100"
                                    name={input.name}
                                    id={input.name}
                                ></textarea>
                            </div>
                        )}
                    </div>
                    ))}
                <div className='flex justify-end mt-10'>
                    <Link
                        to={"/profile"}
                        type="button"
                        className="text-red-700 hover:text-white border border-red-700 duration-300 transition-all  hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-2 text-center mx-2 "
                    >
                        Cancel
                    </Link>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        className="text-[#86d2f4] hover:text-white border border-[#86d2f4] duration-300 transition-all  hover:bg-[#39a0cf] focus:ring-4 focus:outline-none focus:ring-[#9dd4ee] font-medium rounded-lg text-sm px-6 py-2 text-center mx-2"
                    >
                        Next
                    </button>
                    </div>
            </form>
        </div>
        </div>
    )
}
