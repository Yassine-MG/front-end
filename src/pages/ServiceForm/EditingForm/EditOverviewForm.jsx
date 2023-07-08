import React , {useState,useEffect} from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Error from '../../../components/ProtectedRoutes/Error';
import { saveUserInSession, postDataWithToken, options } from '../../../Helpers/functions';
import Cookies from 'js-cookie';
import http from '../../../http';
export default function EditOverviewForm() {
    const { id } = useParams(); // Access the ID from the route
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const [authuser, setAuthuser]= useState([])
    const [service, setService] = useState(null);

    const navigate = useNavigate();
    const token = Cookies.get("access_token");
    const[inputs,setInputs] = useState({
        title: '',
        description: '',
        category: '',
        skills: '',
    });
    console.log(id);

    const handleCheckboxChange = (event) => {
        const { value, checked } = event.target;
        
            if (checked) {
            if (selectedCheckboxes.length < 4) {
                setSelectedCheckboxes((prevCheckboxes) => {
                if (Array.isArray(prevCheckboxes)) {
                    return [...prevCheckboxes, value];
                } else {
                    return [value];
                }
                });
            }
            } else {
            setSelectedCheckboxes((prevCheckboxes) => {
                if (Array.isArray(prevCheckboxes)) {
                return prevCheckboxes.filter((item) => item !== value);
                } else {
                return [];
                }
            });
            }
        };
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        console.log(event.target.value);
        setInputs({ ...inputs, category: event.target.value })
        };
            
            const handleSubmit = async (e) => {
                e.preventDefault();
                const data = {
                ...inputs,
                category: selectedOption,
                skills: [...selectedCheckboxes],
                };
            
                try {
                const response = await http.put(`/edit/service/overview/${id}`, data); // Replace '/api/services' with your actual API endpoint
                // Handle the response as needed
                console.log(response.data); // Assuming the server returns the updated service data
                navigate(`/edit/service/price/${id}`); // Redirect to the profile page after successful update
                } catch (error) {
                // Handle error
                console.log('Error updating service:', error);
                }
            };
            const fetchServices = async () => {
                try {
                const response = await http.get('/profile/services', {
                    headers: {
                    Authorization: `Bearer ${token}`,
                    },
                });
                setAuthuser(response.data.user)
                console.log(response);
                } catch (error) {
                console.log(error);
                }
            };
            useEffect(()=>{
                if(token){
                    fetchServices()
                }
            },[])
            const fetchServicebyId = async () => {
                try {
                  const response = await http.get(`/service/${id}/edit/overview`); // Replace '/api/service' with your actual API endpoint to retrieve the service
                    setService(response.data); // Assuming the server returns the service data
                    console.log(response);
                    
                    // Set initial input values based on the retrieved service data
                    if (response.data) {
                        setInputs({
                        title: response.data.title || '',
                        description: response.data.description || '',
                        category: response.data.category || '',
                        skills: response.data.skills || '',
                        });
                        setSelectedOption(response.data.category || '');
                        setSelectedCheckboxes(response.data.skills || []);
                    }
                    } catch (error) {
                    console.log('Error fetching service:', error);
                    }
                };


                useEffect(() => {
                    if (id) {
                        fetchServicebyId();
                    }
                }, [id]);


                useEffect(() => {
                    setSelectedCheckboxes([]); // Clear selected checkboxes when selectedOption changes
                  }, [selectedOption]);

    if(authuser?.freelancer?.id == service?.freelancer_id ){
    return (
            <div className='container md:w-[70%] p-4 mx-auto border my-[100px] border-gray-200'>
            <form method='put'>
            
                <div className='grid items-center  my-4 grid-cols-5'>
                    <div className=' lg:col-span-2 col-span-5 pr-5'>
                        <h1 className='text-lg font-semibold my-2'>Title</h1>
                        <p className='text-sm'>As your Gig storefront, your title is the most important place to include keywords that buyers would likely use to search for a service like yours</p>
                    </div>
                    <div className=' lg:col-span-3 col-span-5'>
                        <textarea className='resize-none w-full p-2 outline-none border-1 border-gray-300  focus:border-[#86d2f4] mt-8  h-[10vh]' value={inputs.title} onChange={(e) => setInputs({ ...inputs, title: e.target.value })} rows="2" cols="100" maxLength="200" name="title" id="title" ></textarea>
                    </div>
                </div>
                <div className=' grid grid-cols-5 my-4 items-center'>
                    <div className='lg:col-span-2 col-span-5 pr-5'>
                        <h1 className='text-lg font-semibold my-2'>Description</h1>
                        <p className='text-sm'>As your Gig storefront, You must describe what You do on your services </p>
                    </div>
                    <div className='lg:col-span-3 col-span-5'>
                        <textarea className='resize-none w-full p-2 outline-none border-1 border-gray-300  focus:border-[#86d2f4] mt-8  h-[10vh]' value={inputs.description} onChange={(e) => setInputs({ ...inputs, description: e.target.value })} rows="2" cols="100" name="description" id="description" ></textarea>
                    </div>
                    
                </div>
                <div className='grid grid-cols-5 my-4 items-center'>
                    <div className='lg:col-span-2 col-span-5 pr-5'>
                        <h2 className=' font-semibold'>Select your Category</h2>
                    </div>
                    <div className='lg:col-span-3 col-span-5'>
                        <select className='block my-5 w-full border-1 py-1.5 text-gray-900 border-1 border-gray-300  focus:border-[#86d2f4] shadow-sm placeholder:text-gray-500 outline-none sm:text-sm sm:leading-6' value={selectedOption} onChange={handleSelectChange}>
                            <option value="">Select an option</option>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                {option.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
                <div className='mx-auto'>
                {selectedOption && (
                <div className='grid md:grid-cols-2 grid-cols-1 ml-7 md:w-[70%] md:mx-auto'>
                    {options
                    .find((option) => option.value === selectedOption)
                    .checkboxes.map((checkbox) => (
                        <div className='py-2' key={checkbox.value}>
                            <input className='mr-4 cursor-pointer px-2 outline-none focus:ring-[#86d2f4] text-[#fff] accent-[#86d2f4] w-5 h-5 transition-all duration-300' type="checkbox" id={checkbox.value} name={checkbox.value} checked={selectedCheckboxes.includes(checkbox.value)} onChange={handleCheckboxChange} value={checkbox.value} />
                            <label className='cursor-pointer text-sm font-semibold ml-3' htmlFor={checkbox.value}>{checkbox.label}</label>
                        </div>
                    ))}
                </div>
                )}
                </div>
                <div className='flex justify-end my-10'>
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
}else if(authuser?.freelancer?.id != service?.freelancer_id){
    <Error></Error>
}
    }
