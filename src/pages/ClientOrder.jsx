    import React, { useEffect, useState , useRef} from 'react';
    import http from '../http';
    import { Link } from 'react-router-dom';
    import img1 from "../images/default.jfif";
    import Cookies from 'js-cookie';
    export default function ClientOrder() {
        const [commands, setCommands] = useState([]);
        const [expandedRows, setExpandedRows] = useState([]);
        const [modalOpen, setModalOpen] = useState(false);
        const [modalImages, setModalImages] = useState([]);
        const [currentImage, setCurrentImage] = useState(0);
        const [selectedDate, setSelectedDate] = useState('');
        const [selectedStatus, setSelectedStatus] = useState('');
        const [error, setError] = useState('');

        const handleDateChange = (event) => {
        setSelectedDate(event.target.value);
        };

        const token = Cookies.get("access_token");
        useEffect(() => {
        fetchCommands();
        }, []);
    
        const fetchCommands = async () => {
        try {
            const response = await http.get('/commands/of/user', {
                headers: {
                Authorization: `Bearer ${token}`,
                },
            });

            setCommands(response.data);
            
            console.log(response);
        } catch (error) {
            console.error('Error fetching commands:', error);
        }
        };

        const handleStatusChange = (event) => {
        setSelectedStatus(event.target.value);
        };


        const handleFormSubmit = async (event, command) => {
        event.preventDefault();

        if (selectedStatus === 'Accepte' && !selectedDate) {
            setError('Please select a delivery date.');
            return;
        }
    
        try {
            const response = await http.put(`/commands/delevery/date/${command.id}`, {
            delivery_date: selectedDate,
            status: selectedStatus,
            }, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
            });
            
            console.log(response.data);
            // Handle the response as needed
            window.location.reload();
        } catch (error) {
            console.error('Error updating command:', error);
            // Handle the error as needed
        }
        };


        const truncateDescription = (description) => {
        const words = description.split(' ');
        if (words.length > 3) {
            return words.slice(0, 3).join(' ') + '...';
        }
        return description;
        };



        const formatCreatedDate = (dateString) => {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return new Date(dateString).toLocaleDateString(undefined, options);
        };


        const getPictureUrls = (files) => {
        const fileList = JSON.parse(files);
        return fileList.map((file) => `http://localhost:8000${file}`);
        };

        const toggleRow = (commandId) => {
        if (expandedRows.includes(commandId)) {
            setExpandedRows(expandedRows.filter((id) => id !== commandId));
        } else {
            setExpandedRows([...expandedRows, commandId]);
        }
        };
    
        const isRowExpanded = (commandId) => {
        return expandedRows.includes(commandId);
        };
    
        const openModal = (files) => {
        const pictureUrls = getPictureUrls(files);
        setModalImages(pictureUrls);
        setCurrentImage(0);
        setModalOpen(true);
        };
    
        const handleImageChange = (direction) => {
        if (direction === 'prev' && currentImage > 0) {
            setCurrentImage(currentImage - 1);
        } else if (direction === 'next' && currentImage < modalImages.length - 1) {
            setCurrentImage(currentImage + 1);
        }
        };
        const closeModal = () => {
        setModalOpen(false);
        };

        const downloadFile = (fileUrl) => {
            const apiUrl = 'http://localhost:8000/storage/'; // Update with your API URL
            const downloadUrl = `${apiUrl}/${fileUrl}`;
          
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = true;
            link.click();
          };

    return (
        <div className="flex flex-col container mx-auto">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                <h1 className='text-center'>My Orders</h1>
                    <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b font-medium dark:border-neutral-500">
                        <tr>
                        <th scope="col" className="px-6 py-4">Freelancer</th>
                        <th scope="col" className="px-6 py-4">Email of the Freelancer</th>
                        <th scope="col" className="px-6 py-4">Project's Picture</th>
                        <th scope="col" className="px-6 py-4">Project Name</th>
                        <th scope="col" className="px-6 py-4">price</th>
                        <th scope="col" className="px-6 py-4">Created Date</th>
                        <th scope="col" className="px-6 py-4">Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                    {commands.filter(
                            (command) =>
                            command.status === 'Accepte'
                        ).map((command) => (
                    
                    <React.Fragment key={command.id}>
                        <tr
                        onClick={() => toggleRow(command.id)}
                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                        >
                        <td className="whitespace-nowrap font-semibold px-6 py-4">
                            {command.service.freelancer.user.name}
                        </td>
                        <td className="whitespace-nowrap font-semibold px-6 py-4">
                            {command.service.freelancer.user.email}
                        </td>
                        <td className="whitespace-nowrap px-6 py-4">
                            {getPictureUrls(command.files).length > 0 && (
                                <button
                                className="focus:outline-none"
                                onClick={() => openModal(command.files)}
                                >
                                <img
                                    className="h-12 hover:scale-125 transition-all duration-300 border rounded-lg w-12 cursor-pointer"
                                    src={getPictureUrls(command.files)[0]}
                                    alt={command.project_name}
                                />
                                </button>
                            )}
                                {/*  */}
                        </td>

                        <td className="whitespace-nowrap font-semibold px-6 py-4">
                            {command.project_name}
                        </td>
                        <td className="whitespace-nowrap font-semibold  px-6 py-4">
                        {command?.service.price ? command?.service.price + "$" :""}
                        </td>
                        <td className="whitespace-nowrap font-semibold px-6 py-4">
                            {formatCreatedDate(command.created_at)}
                        </td>
                        <td className="whitespace-nowrap font-semibold px-6 py-4">
                            {command.delivery_date ? formatCreatedDate(command.delivery_date) : <>_</>}
                        </td>
                        <td className="whitespace-nowrap font-semibold px-6 py-4">
                            <button type='button'className={`transform ease-in-out duration-500 transition-transform ${isRowExpanded(command.id) ? 'rotate-180' : ''}`} onClick={() => toggleRow(command.id)}><i className="bi bi-chevron-down"></i></button>
                        
                        </td>
                        </tr>
                        <tr>
                            <td colSpan="12" className="">
                            <div className={`overflow-hidden transition-all ease-in-out duration-500 ${isRowExpanded(command.id) ? ' max-h-[600px]' : 'max-h-0'}`}>
                                <div  className='flex my-5 items-center justify-between'>
                                    <Link to={`/profile/${command.user.id}`} className='flex my-5 items-center'>
                                    {command.service.freelancer.user.photo ? (
                                        <img
                                            className="inline-block mr-3 h-12 w-12 object-cover rounded-full ring-2 ring-white"
                                            src={`http://localhost:8000/storage/${command.service.freelancer.user.photo}`}
                                            alt="profile picture"
                                        />
                                        ) : (
                                        <img
                                            src={img1}
                                            className="inline-block mr-3 h-12 w-12 rounded-full ring-2 ring-white"
                                            alt="default"
                                        />
                                        )}
                                        
                                        <div>
                                        <h1 className='font-semibold text-lg'>{command.service.freelancer.first_name}</h1>
                                        <h1>{formatCreatedDate(command.created_at)}</h1>
                                        
                                        </div>
                                        
                                    </Link>
                                    
                                    <td>
                                    
                                    {   command.delivery_product ?
                                        <button
                                        className="titlei hover:bg-pink-500 hover:text-white cursor-pointer border-pink-500 0 border-2 font-semibold  duration-500 ease-in-out transition-all px-5 py-2   rounded-3xl"
                                        onClick={() => downloadFile(command.delivery_product)}
                                        >
                                        Download File
                                        </button>:
                                        <></>
                                        }
                                    
                                    </td>
                                    <h5 className='font-semibold'>{command?.service.price ? command?.service.price + "$" :""}</h5>
                                </div>
                                <h1 className='font-semibold text-lg mb-3'>{command.project_name}</h1>
                                        
                                <p className=' text-base'>{command.description}</p>
                                <ul className='my-5'>
                                {
                                JSON.parse(command.service.dynamic_inputs).map((dynamic_input, index) => (
                                    <li className="text-sm font-semibold text-gray-400" key={index}>
                                    <span className="text-green-600 text-xl">
                                        <i className="bi bi-check-lg"></i>
                                    </span>
                                    {dynamic_input.name} {dynamic_input.value === "true" ? <></> : dynamic_input.value}
                                    </li>
                                ))}
                            </ul>
                            </div>
                            </td>
                        </tr>
                    </React.Fragment>
                    ))}
                </tbody>
                    </table>
                </div>
                </div>
            </div>
            {modalOpen && (
            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                <button
                className="absolute top-2 right-12 text-gray-500 hover:text-gray-700"
                onClick={closeModal}
                >
                <i className="bi bi-x-lg"></i>
                </button>
            <div className="bg-white relative p-2 rounded-lg">
            {modalImages.length > 1 && (
                <button
                    className="absolute top-[50%] left-2 text-2xl bg-white rounded-full p-3 text-gray-500 hover:text-gray-700"
                    onClick={() => handleImageChange('prev')}
                    disabled={currentImage === 0}
                >
                    <i className="bi bi-chevron-left"></i>
                </button>
                )}
                {modalImages.length > 1 && (
                <button
                    className="absolute top-[50%] right-2 text-2xl bg-white rounded-full p-3 text-gray-500 hover:text-gray-700"
                    onClick={() => handleImageChange('next')}
                    disabled={currentImage === modalImages.length - 1}
                >
                    <i className="bi bi-chevron-right"></i>
                </button>
                )}
                <img
                className="max-w-full max-h-[700px]"
                src={modalImages[currentImage]}
                alt="Modal"
            />
            </div>
            </div>
        )}
        </div>
    )
    }


