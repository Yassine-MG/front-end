import React , {useState,useEffect} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Error from '../../../components/ProtectedRoutes/Error';
import { options, deleverytimes } from '../../../Helpers/functions';
import Cookies from 'js-cookie';
import http from '../../../http';

export default function EditPriceForm() {
    const { id } = useParams(); // Access the ID from the route
    const [selectedOption, setSelectedOption] = useState("");
    const [category,setCategory] = useState("")
    const navigate = useNavigate();
    const token = Cookies.get("access_token");
    const selectedOptions = options.find((option) => option.value === category);
    const dynamicInputs = selectedOptions ? selectedOptions.inputs : [];

    useEffect(() => {
        if (id) {
          http.get(`/service/${id}`)
            .then((response) => {
              const service = response.data.service;
              setCategory(service.category);
              setInputs({
                offer_name: service.offer_name,
                details: service.details,
                price: service.price,
                delevery: service.delevery,
                ...(service.dynamicInputs
                  ? service.dynamicInputs.reduce((acc, input) => {
                      acc[input.name] = input.value;
                      return acc;
                    }, {})
                  : {}),
              });
            })
            .catch((error) => {
              console.error(error);
            });
        }
      }, [id]);
    const[inputs,setInputs] = useState({
        offer_name: '',
        details: '',
        price: '',
        delevery:'',
    });
console.log(id);

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
        http.put(`/edit/service/price/${id}`,data,{headers: {"Authorization": `Bearer ${token}`}})
        .then(response => {
            console.log(response.data.user);
            // saveUserInSession(response.data.user);
            navigate(`/edit/service/file/${id}`);
        })
        .catch(error => {
            console.log(error);
        });
    };
    return (
        <div className='md:w-[70%] w-[90%] mx-auto border my-20 p-4 border-gray-200'>
        <form>
            <div className='grid items-center my-4 grid-cols-5'>
                <div className='lg:col-span-1 col-span-5 pr-5'>
                    <h1 className='text-lg font-semibold my-2'>Title</h1>
                    <p className='text-sm'>Name Your Offer </p>
                </div>
                <div className='lg:col-span-4 col-span-5'>
                <input
                    type="text"
                    name="offer_name"
                    maxLength="55"
                    value={inputs.offer_name} 
                    onChange={(e) => setInputs({ ...inputs, offer_name: e.target.value })}
                    id="name_offer"
                    className="block w-full p-2 mt-5 border-1 border-gray-300  focus:border-[#86d2f4] outline-none py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            
            <div className='grid items-center my-4 grid-cols-5'>
                <div className='lg:col-span-1 col-span-5 pr-5'>
                    <h1 className='text-lg font-semibold my-2'>Description</h1>
                    <p className='text-sm'>Describe the details of your offering </p>
                </div>
                <div className='lg:col-span-4 col-span-5'>
                    <textarea className='resize-none w-full p-2 outline-none border-1 border-gray-300  focus:border-[#86d2f4] mt-8  h-[10vh]' value={inputs.details} onChange={(e) => setInputs({ ...inputs, details: e.target.value })} rows="2" maxLength="200" cols="100" name="details" id="details" ></textarea>
                </div>
            </div>
            <div className='grid items-center my-4 grid-cols-5'>
                <div className='lg:col-span-1 col-span-5 pr-5'>
                    <h1 className='my-5 text-lg font-semibold'>Delevery Day :</h1>
                </div>
                <div className='lg:col-span-4 col-span-5'>
                    <select className='block w-full py-1.5 text-gray-900 outline-none shadow-sm border-1  border-gray-300  focus:border-[#86d2f4] placeholder:text-gray-500  sm:text-sm sm:leading-6' value={selectedOption} onChange={handleSelectChange}>
                        <option value="">Select an option</option>
                        {deleverytimes.map((deleverytime) => (
                            <option key={deleverytime.value} value={deleverytime.value}>
                            {deleverytime.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <div className='grid items-center my-4 grid-cols-5'>
                <div className='lg:col-span-1 col-span-5 pr-5'>
                    <h1 className='text-lg font-semibold my-2 '>Price</h1>
                </div>
                <div className='lg:col-span-4 col-span-5'>
                <input
                    type="number"
                    name="price"
                    id="price"
                    value={inputs.price} 
                    onChange={(e) => setInputs({ ...inputs, price: e.target.value })}
                    className="block webki w-full px-2  border-1 border-gray-300 py-2 focus:border-[#86d2f4] outline-none text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
                </div>
            </div>
            {dynamicInputs.map((input, index) => (
                <div key={index} className=" input-box">
                    {input.type === "checkbox" ? (
                    <div className='my-3'>
                    <input
                        type="checkbox"
                        name={input.name}
                        id={input.label}
                        checked={inputs[input.name] || false}
                        onChange={(e) =>
                        setInputs({ ...inputs, [input.name]: e.target.checked })
                        }
                        className="mr-4 cursor-pointer px-2 outline-none focus:ring-[#86d2f4] text-[#fff] accent-[#86d2f4] w-5 h-5 transition-all duration-300"
                    />
                    <label htmlFor={input.label} className='font-semibold'>{input.label}</label>
                    </div>
                    ) : input.type === "select" ? (
                        <div className='grid items-center my-4 grid-cols-5'>
                            <div className='lg:col-span-1 col-span-5 pr-5'>
                                <h1 className='font-semibold'>{input.label}</h1>
                            </div>
                            <div className='lg:col-span-4 col-span-5'>
                                <select
                                    className="block w-full py-1.5 outline-none border-1 border-gray-300  focus:border-[#86d2f4] text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                        </div>
                    ) : (
                    <div className='grid items-center my-4 grid-cols-5'>
                        <div className='lg:col-span-1 col-span-5 pr-5'>
                            <h1 className='font-semibold'>{input.label}</h1>
                        </div>
                        <div className='lg:col-span-4 col-span-5'>
                        <textarea
                            className="resize-none p-2 outline-none border mt-8 border-gray-200 h-[10vh]"
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
                    </div>
                    )}
                </div>
                ))}
            <div className='flex justify-end mt-10'>
                <Link
                    to={"/profile"}
                    type="button"
                    className="text-red-700 hover:text-white border border-red-700 duration-300 transition-all  hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-2 text-center mx-2"
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
    )
}
