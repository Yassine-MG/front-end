import React, {useEffect,useState} from 'react'
import http from '../http';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';

export default function Gigs() {
    const [services, setServices] = useState([]);
    const [selectedServices, setSelectedServices] = useState([]);
    const [modalCheckOpen, setModalCheckOpen] = useState(false);
    const token = Cookies.get("access_token");

    const fetchServices = async () => {
        try {
        const response = await http.get('/profile/services', {
            headers: {
            Authorization: `Bearer ${token}`,
            },
        });
        console.log(response);
        setServices(response.data.services);
        console.log(response);
        } catch (error) {
        console.log(error);
        }
    };
useEffect(()=>{
    fetchServices()
},[])

const handleCheckboxChange = (serviceId) => {
    setSelectedServices((prevSelectedServices) => {
        if (prevSelectedServices.includes(serviceId)) {
            // If the service ID is already selected, remove it
            console.log( prevSelectedServices.filter((id) => id !== serviceId));
            return prevSelectedServices.filter((id) => id !== serviceId);
        } else {
            // If the service ID is not selected, add it
            return [...prevSelectedServices, serviceId];
        }
        });
    };
    const handleCancel = () => {

        setModalCheckOpen(false); // Close the modal
    };

    const handleDeleteSelected = async () => {
        try {
            const response = await http({
                method: 'delete',
                url: '/profile/services/delete',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                data: { data: selectedServices }, // Wrap the selectedServices array in an object with the key 'data'
            });
            console.log(selectedServices);
            // Update the services state or fetch the updated list of services again
            fetchServices();
            setModalCheckOpen(false);
        } catch (error) {
            console.log(error);
        }
    };
const truncateText = (text, wordLimit) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) {
      return text;
    }
    const truncatedText = words.slice(0, wordLimit).join(' ');
    return truncatedText + '...';
  };
  return (
    <div className="flex h-screen my-20 flex-col container mx-auto">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
            <h1 className=' text-3xl my-5 mx-4'>Gigs</h1>
            <hr />
                <form>

                
                    <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b font-medium dark:border-neutral-500">
                        <tr>
                        <th scope="col" className="px-6 py-4"><input type="checkbox" onChange={(e) => setSelectedServices(e.target.checked ? services.map(service => service.id) : [])}/></th>
                        <th scope="col" className="px-6 py-4">image</th>
                        <th scope="col" className="px-6 py-4">Title</th>
                        <th scope="col" className="px-6 py-4">Description</th>
                        <th scope="col" className="px-6 py-4">Price</th>
                        <th scope="col" className="px-6 py-4">Delevery Time</th>
                        <th scope="col" className="px-6 py-4 text-red-600 text-2xl font-semibold"> <button type='button' onClick={()=>setModalCheckOpen(true)}><i className="bi bi-trash"></i></button></th>
                        </tr>
                    </thead>
                    {modalCheckOpen && (
                            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                                <div className="bg-white p-4 rounded-lg">
                                <p className='font-semibold mx-5 mt-5 mb-8'>Are you sure you to delete these services ?</p>
                                <div className="flex justify-end mt-4">
                                    <button
                                    type='button'
                                    className="text-red-700 hover:text-white border border-red-700 duration-300 transition-all  hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-3 text-center mx-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                                    onClick={handleCancel}
                                    >
                                    Cancel
                                    </button>
                                    <button
                                    type='button'
                                    className="inline-flex items-center px-6 py-3 text-gray-500 font-semibold duration-300 transition-all bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-600 "
                                    onClick={handleDeleteSelected}
                                    >
                                    Yes
                                    </button>

                                </div>
                                </div>
                            </div>
                            )}
                    <tbody>
                        {services.map((service) => (
                        <tr
                            key={service.id}
                            className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                        >
                            <td className="whitespace-nowrap px-6 py-4">
                            <input type="checkbox" checked={selectedServices.includes(service.id)} onChange={() => handleCheckboxChange(service.id)}/>
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-medium">
                            <img className=" h-12 w-12" src={`http://localhost:8000${service.image3}`} alt={service.title} />
                            </td>
                            <td className="whitespace-nowrap underline px-6 py-4 font-semibold">
                                <Link to={`/service/${service.id}`}>{truncateText(service.title, 6)}</Link>
                        
                        </td>
                        <td className="whitespace-nowrap px-6 py-4 font-semibold">
                        {truncateText(service.description, 5)}
                        </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold">
                            {service.price} $
                            </td>
                            <td className="whitespace-nowrap px-6 py-4 font-semibold">
                            {service.delevery}
                            </td>
                            <td>
                            <Link to={`/edit/service/overview/${service.id}`} className="block font-semibold w-full text-left text-lg px-4 py-2 text-gray-700">
                                <i className="bi bi-pencil "></i> Edit
                            </Link>
                            </td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </form>
            </div>
            </div>
        </div>
    </div>
  )
}
