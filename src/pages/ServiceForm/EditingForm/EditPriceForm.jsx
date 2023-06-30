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
        <div className='w-[70%] mx-auto border my-20 p-5 border-gray-200'>
        <form>
            <div className='flex mr-5 ml-10'>
                <div className='w-[30%]'>
                    <h1 className='text-lg font-semibold my-2'>Title</h1>
                    <p className='text-sm'>Name Your Offer </p>
                </div>
                <input
                    type="text"
                    name="offer_name"
                    maxLength="55"
                    value={inputs.offer_name} 
                    onChange={(e) => setInputs({ ...inputs, offer_name: e.target.value })}
                    id="name_offer"
                    className="block w-[70%] h-[50px] p-2 mt-5 border-0 outline-none py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
            </div>
            {dynamicInputs.map((input, index) => (
                <div key={index} className="flex mr-5 ml-10 input-box">
                    <div className="w-[30%]">
                    <h1 className="text-lg font-semibold my-2">{input.label}</h1>
                    </div>
                    {input.type === "checkbox" ? (
                    <input
                        type="checkbox"
                        name={input.name}
                        checked={inputs[input.name] || false}
                        onChange={(e) =>
                        setInputs({ ...inputs, [input.name]: e.target.checked })
                        }
                        className=""
                    />
                    ) : input.type === "select" ? (
                    <select
                        className="block m-5 w-[70%] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
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
                    ) : (
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
                    )}
                </div>
                ))}
            <div className='flex p-5 '>
                <div className='w-[30%] m-5 pr-5'>
                    <h1 className='text-lg font-semibold my-2'>Description</h1>
                    <p className='text-sm'>Describe the details of your offering </p>
                </div>
                <textarea className='resize-none p-2 outline-none border mt-8 border-gray-200 h-[10vh]' value={inputs.details} onChange={(e) => setInputs({ ...inputs, details: e.target.value })} rows="2" maxLength="200" cols="100" name="details" id="details" ></textarea>
            </div>
            <div className='flex'>
                    <h1 className='w-[30%] my-5 ml-10 text-lg font-semibold'>Delevery Day :</h1>
                    <select className='block  m-5 w-[70%] border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' value={selectedOption} onChange={handleSelectChange}>
                        <option value="">Select an option</option>
                        {deleverytimes.map((deleverytime) => (
                            <option key={deleverytime.value} value={deleverytime.value}>
                            {deleverytime.label}
                            </option>
                        ))}
                    </select>
            </div>
            <div className='flex mr-5 ml-10 input-box'>
                <div className='w-[30%]'>
                    <h1 className='text-lg font-semibold my-2'>Price</h1>
                </div>
                <input
                    type="number"
                    name="price"
                    id="price"
                    value={inputs.price} 
                    onChange={(e) => setInputs({ ...inputs, price: e.target.value })}
                    className="block webki w-[70%] h-[40px] px-2 mt-5 border-0 outline-none text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6"
                />
            </div>
            <div className='flex justify-end mt-10'>
                <button
                    type="button"
                    className="justify-center ml-5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    onClick={handleSubmit}
                    className=" justify-center mx-10 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                    Next
                </button>
                </div>
        </form>
    </div>
    )
}