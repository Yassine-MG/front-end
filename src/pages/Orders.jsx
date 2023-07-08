import React, { useEffect, useState , useRef} from 'react';
import http from '../http';
import { Link } from 'react-router-dom';
import img1 from "../images/default.jfif";
import Cookies from 'js-cookie';

export default function Orders() {
    const [commands, setCommands] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalCheckOpen, setModalCheckOpen] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [isChecked, setIsChecked] = useState(false);
    
        const token = Cookies.get("access_token");
        useEffect(() => {
        fetchCommands();
        }, []);

            const handleCheck = () => {
                setIsChecked(!isChecked);
                setModalCheckOpen(true);
            };
            const handleCancel = () => {
                setIsChecked(false); // Uncheck the checkbox
                setModalCheckOpen(false); // Close the modal
            };
            const handleOk = (commandId) => {
                const updatedStatus = 'Done';
                console.log(commandId);
            
                if (commandId) {
                    const url = `/put/status/commands/${commandId}`;
                    http
                        .put(url, { status: updatedStatus }, {
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        })
                        .then((response) => {
                            console.log('Status updated:', response.data);
                            setIsChecked(true); // Set isChecked to true
                            setModalCheckOpen(false);
                        })
                        .catch((error) => {
                            console.error('Error updating status:', error);
                        });
                } else {
                    console.error('CommandId not found');
                }
            };
    
        const fetchCommands = async () => {
        try {
            const response = await http.get('/commands/of/freelancer', {
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

            const handleFileUpload = (event,id) => {
                const files = event.target.files;
                
                const formData = new FormData();
                // formData.append('_method', 'put');
                for (let i = 0; i < files.length; i++) {
                formData.append('files[]', files[i]);
                }
            
                const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
                };
            
                // Add the command ID as a query parameter in the URL
                const url = `/commands/${id}/upload-files`;
            
                http.post(url, formData, config)
                .then((response) => {
                    console.log(response);
                    // Handle the response as needed
                })
                .catch((error) => {
                    console.error('Error uploading files:', error);
                    // Handle the error as needed
                });
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

        const currentDate = new Date().toISOString().split('T')[0];

    return (
        <div className="flex mt-20 flex-col h-screen container mx-auto">

            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
                <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                <h1 className='mx-5 text-3xl my-5'>Orders List</h1>
                    <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b font-medium dark:border-neutral-500">
                        <tr>
                        <th scope="col" className="px-6 py-4">Custumer</th>
                        <th scope="col" className="px-6 py-4">Email of the customer</th>
                        <th scope="col" className="px-6 py-4">Picture</th>
                        <th scope="col" className="px-6 py-4">Project Name</th>
                        <th scope="col" className="px-6 py-4">Description</th>
                        <th scope="col" className="px-6 py-4">Created Date</th>
                        <th scope="col" className="px-6 py-4">Deadline</th>
                        </tr>
                    </thead>
                    <tbody>
                    {commands
                      .filter(
                        (command) =>
                          command.status == "Accepte"
                      ).map((command) => (
                    <React.Fragment  key={command.id}>
                        <tr onClick={() => toggleRow(command.id)}
                            data-command-id={command.id}
                        className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                        >
                        <td className="whitespace-nowrap font-semibold px-6 py-4">
                            {command.user.name}
                        </td>
                        <td className="whitespace-nowrap font-semibold px-6 py-4">
                            {command.user.email}
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
                        {modalCheckOpen && (
                            <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
                                <div className="bg-white p-4 rounded-lg">
                                <p className='font-semibold mx-5 mt-5 mb-8'>Are you sure you want to mark this command as done to your customer ?</p>
                                <div className="flex justify-end mt-4">
                                    <button
                                    className="text-red-700 hover:text-white border border-red-700 duration-300 transition-all  hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-3 text-center mx-2 dark:border-red-500 dark:text-red-500 dark:hover:text-white dark:hover:bg-red-600 dark:focus:ring-red-900"
                                    onClick={handleCancel}
                                    >
                                    Cancel
                                    </button>
                                    <button
                                    className="inline-flex items-center px-6 py-3 text-gray-500 font-semibold duration-300 transition-all bg-gray-100 rounded-md hover:bg-gray-200 hover:text-gray-600 "
                                    onClick={() => handleOk(command.id)}
                                    >
                                    Done
                                    </button>

                                </div>
                                </div>
                            </div>
                            )}
                        <td className="whitespace-nowrap font-semibold px-6 py-4">
                            {command.project_name}
                        </td>
                        <td className="whitespace-nowrap font-semibold  px-6 py-4">
                            {truncateDescription(command.description)}
                        </td>
                        <td className="whitespace-nowrap font-semibold px-6 py-4">
                            {formatCreatedDate(command.created_at)}
                        </td>                        
                        <td className="whitespace-nowrap font-semibold px-6 py-4">
                            {formatCreatedDate(command.delivery_date)}
                        </td>
                        <td className="whitespace-nowrap font-semibold px-6 py-4">
                            <button type='button'className={`transform ease-in-out duration-500 transition-transform ${isRowExpanded(command.id) ? 'rotate-180' : ''}`} onClick={() => toggleRow(command.id)}><i className="bi bi-chevron-down"></i></button>
                        
                        </td>
                        </tr>
                        <tr>
                            <td colSpan="8" className="">
                            <div className={`overflow-hidden transition-all ease-in-out duration-500 ${isRowExpanded(command.id) ? 'max-h-96' : 'max-h-0'}`}>
                                <div  className='flex my-5 items-center justify-between'>
                                    <Link to={`/profile/${command.user.id}`} className='flex my-5 items-center'>
                                    {command.user.photo ? (
                                        <img
                                            className="inline-block mr-3 h-12 w-12 object-cover rounded-full ring-2 ring-white"
                                            src={`http://localhost:8000/storage/${command.user.photo}`}
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
                                        <h1 className='font-semibold text-lg'>{command.user.name}</h1>
                                        <h1>{formatCreatedDate(command.created_at)}</h1>
                                        </div>
                                    </Link>
                                    <form className='mt-6 flex items-center justify-between '  action="">

                            
                                    <div className='flex items-center  divinput'>

                                        <input type="file" id='files' webkitdirectory directory onChange={(event) => handleFileUpload(event, command.id)} className=" hidden file-input file-input-bordered file-input-primary w-full max-w-xs" />
                                        <label htmlFor="files" className="cursor-pointer titlei flex border-pink-500 border-y-2  border-l-2 border-r-0 font-semibold h-10 items-center px-2 duration-500 ease-in-out transition-all rounded-l-3xl ">Choose A file </label>
                                        {command.delivery_product ?
                                                <h3 onClick={() => { const fileInput = document.getElementById("files");
                                                                    fileInput.click();
                                                }} className='titlei cursor-pointer border-pink-500 0 border-2 border-l-0 border-y-2 border-r-2 font-semibold flex items-center duration-500 ease-in-out h-10 px-2 transition-all rounded-r-3xl'>{command.delivery_product}</h3>
                                                : 
                                                <h3 onClick={() => { const fileInput = document.getElementById("files");
                                                fileInput.click();}} 
                                                className='titlei cursor-pointer border-pink-500 0 border-2 font-semibold  duration-500 ease-in-out  h-10 transition-all border-l-0  rounded-r-3xl'> Please Insert Your file </h3>}
                                    </div>
                                    <div className='mx-5'>
                                            <input
                                                type="checkbox"
                                                id="status"
                                                checked={isChecked}
                                                onChange={handleCheck}
                                                className="mr-2"
                                                disabled={isChecked || command.delivery_product == null} // Disable the checkbox if it is already checked
                                            />
                                            <label className=' font-semibold' for="status"> Check if it is done </label>
                                    </div>
                                        <div className="h-6"></div> 
                                    </form>
                                    <h5 className='font-semibold'>{command?.service.price ? command?.service.price + "$" :""}</h5>
                                </div>

                                <h1 className='font-semibold text-lg mb-3'>{command.project_name}</h1>
                                <p className=' text-base'>{command.description}</p>
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
            <div className="fixed top-0 left-0 w-full h-full z-50 flex items-center justify-center bg-gray-800 bg-opacity-75">
                <button
                className="absolute top-2 right-4 z-50 text-white text-3xl hover:text-gray-700"
                onClick={closeModal}
                >
                <i className="bi bi-x-lg"></i>
                </button>
            <div className="bg-white relative p-2 rounded-lg">
            {modalImages.length > 1 && (
                <button
                    className="absolute top-[45%] left-2 text-2xl bg-[#ffffff77] font-semibold text-white rounded-full py-3 px-4 mx-2 duration-300 transition-all ease-out cursor-pointer hover:bg-[#ffffffb4] hover:text-[#111827]"
                    onClick={() => handleImageChange('prev')}
                    disabled={currentImage === 0}
                >
                    <i className="bi bi-chevron-left"></i>
                </button>
                )}
                {modalImages.length > 1 && (
                <button
                    className="absolute top-[45%] right-2 text-2xl bg-[#ffffff77] font-semibold text-white rounded-full py-3 px-4 mx-2 duration-300 transition-all ease-out hover:bg-[#ffffffb4] hover:text-[#111827]"
                    onClick={() => handleImageChange('next')}
                    disabled={currentImage === modalImages.length - 1}
                >
                    <i className="bi bi-chevron-right"></i>
                </button>
                )}
                <img
                className="lg:max-w-full lg:max-h-[700px] sm:max-h-[800px] object-cover md:max-w-full"
                src={modalImages[currentImage]}
                alt="Modal"
            />
            </div>
            </div>
        )}
        </div>
    )
    }
