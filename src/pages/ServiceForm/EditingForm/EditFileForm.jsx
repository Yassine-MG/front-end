import React,{useState} from 'react'
import http from '../../../http';
import Cookies from 'js-cookie';
import { useNavigate ,useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';

export default function EditFileForm() {
    const { id } = useParams(); // Access the ID from the route
    const [pictures, setPictures] = useState([
        { id: 1, content: '', index: 0 },
        { id: 2, content: '', index: 1 },
        { id: 3, content: '', index: 2 },
        ]);
        const navigate = useNavigate();
        const [input1Disabled, setInput1Disabled] = useState(false);
        const [input2Disabled, setInput2Disabled] = useState(false);
        const [input3Disabled, setInput3Disabled] = useState(false);
        const [input4Disabled, setInput4Disabled] = useState(false);
        
        const [video, setVideo] = useState(null);
        const token = Cookies.get("access_token");
        const fullofpic = "You have reached maximum capacity"
        
        const onDeletePicture = (id) => {
            setPictures((prevPictures) => {
            const updatedPictures = prevPictures.map((picture) => {
                if (picture.id === id) {
                return { ...picture, content: '' };
                }
                return picture;
            });
            return updatedPictures;
            });
        
            // Enable the corresponding input field
            const pictureToDelete = pictures.find((picture) => picture.id === id);
            if (pictureToDelete) {
            switch (pictureToDelete.index) {
                case 0:
                setInput1Disabled(false);
                break;
                case 1:
                setInput2Disabled(false);
                break;
                case 2:
                setInput3Disabled(false);
                break;
                default:
                break;
            }
            }
        };
        const handlePictureUpload = (event,inputNumber) => {
            const files = Array.from(event.target.files);
            setPictures((prevPictures) => {
            const updatedPictures = prevPictures.map((picture) => {
                if (picture.index === inputNumber - 1) {
                return { ...picture, content: files[0] }; // Update the content of the matching picture
                }
                return picture;
            });
            return updatedPictures;
            });
            switch (inputNumber) {
            case 1:
                setInput1Disabled(true);
                break;
            case 2:
                setInput2Disabled(true);
                break;
            case 3:
                setInput3Disabled(true);
                break;
            default:
                break;
            }
        };
        console.log(pictures);
        const handleVideoUpload = (event) => {
            const file = event.target.files[0];
            if (video == null) {
            setVideo(file);
            setInput4Disabled(true)
            }
        
            console.log(event.target.files[0]);
            
        };
        console.log(video);
        const onDeleteVideo = () => {
            setVideo(null);
            // Enable the corresponding input field
            setInput4Disabled(false);
        };
        const handleSubmit = async (e) => {
            e.preventDefault();
            const formData = new FormData();
            formData.append('_method', 'put');
            pictures.forEach((picture, index) => {
            formData.append(`pictures[${index}]`, picture.content);
            });
        
            if (video) {
            formData.append('video', video);
            }
            console.log(Object.fromEntries(formData))
            try {
            const response = await http.post(`/services/${id}/upload-pictures`, formData, {
                headers: {
                'Content-Type': 'multipart/form-data',
                "Authorization": `Bearer ${token}`
                },
            });
            console.log(response);
            sessionStorage.removeItem("service");
            navigate("/profile")
            // Handle the success response
            } catch (error) {
            console.error(error);
            // Handle the error
            
            }
        };
    return (
            <div className='w-[70%] mx-auto border my-20 border-gray-200'>
            <form encType="multipart/form-data" method='POST' onSubmit={handleSubmit}>
            <div>
                <h1 className='text-center'>Images (up to 3)</h1>
                <div className="flex items-center justify-center w-[100%]">
                
                <div className="w-[25%]">
                    {
                    input1Disabled ?
                    <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <i className="bi bi-check-lg"></i>  
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Image set successfully</span></p>
                                    <p></p>
                                    <button onClick={() => onDeletePicture(pictures[0].id)} type='button' className="text-lg text-gray-500 dark:text-gray-400"><i className="bi bi-trash3"></i> </button> 
                                </div>
                        </div>:
                    <label htmlFor="dropzone-img1" className="flex flex-col cursor-pointer items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <i className="bi bi-image"></i>
                            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG (MAX. 800x400px)</p>
                        </div>
                        <input id="dropzone-img1" name="pictures[]"  type="file" accept="image/*" className="hidden" disabled={input1Disabled}  onChange={(e) => handlePictureUpload(e, 1)}/>
                    </label>
                    }

                </div>
                <div className="w-[25%] m-10">
                    {
                    input2Disabled?
                        <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <i className="bi bi-check-lg"></i>  
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Image set successfully</span></p>
                                    <button onClick={() => onDeletePicture(pictures[1].id)} type='button' className="text-lg text-gray-500 dark:text-gray-400"><i className="bi bi-trash3"></i> </button> 
                                </div>
                        </div>:
                        <label htmlFor="dropzone-img2" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <i className="bi bi-image"></i>
                                <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG (MAX. 800x400px)</p>
                            </div>
                            <input id="dropzone-img2" name="pictures[]"  type="file" accept="image/*" className="hidden" disabled={input2Disabled}  onChange={(e) => handlePictureUpload(e, 2)} />
                        </label>
                    }

                </div>
                <div className="w-[25%]">
                    {
                    input3Disabled?
                    <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <i className="bi bi-check-lg"></i>  
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Image set successfully</span></p>
                                    <button type='button' onClick={() => onDeletePicture(pictures[2].id)} className="text-lg text-gray-500 dark:text-gray-400"><i className="bi bi-trash3"></i> </button> 
                                </div>
                        </div>:

                    
                        <label htmlFor="dropzone-img3" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <i className="bi bi-image"></i>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">SVG, PNG, JPG (MAX. 800x400px)</p>
                                </div>
                            <input id="dropzone-img3" name="pictures[]"  type="file" accept="image/*" className="hidden"  disabled={input3Disabled}  onChange={(e) => handlePictureUpload(e, 3)}/>
                    </label>
                    }
                </div>

                </div>
            </div>
            <div>
                <h1 className='text-center my-10'>Video (one only)</h1>
                <p className='text-center '>Capture buyers' attention with a video that showcases your service.</p>
                <p className='text-center '>Please choose a video shorter than 75 seconds and smaller than 50MB</p>
                <div className='ml-24 '>
                
                <div className="w-[27%]">
                {
                    input4Disabled?
                    <div className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                        <i className="bi bi-check-lg"></i>  
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Image set successfully</span></p>
                        <button onClick={onDeleteVideo} type='button' className="text-lg text-gray-500 dark:text-gray-400"><i className="bi bi-trash3"></i> </button> 
                        </div>
                    </div>:
                        <label htmlFor="dropzone-video" className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600">
                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                    <i className="bi bi-file-earmark-play"></i>
                                    <p className="mb-2 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span></p>
                                    <p className="text-xs text-gray-500 dark:text-gray-400">MP4 (MAX. 800x400px)</p>
                                </div>
                            <input id="dropzone-video" name='video' type="file" accept="video/*" disabled={input4Disabled} onChange={handleVideoUpload} className="hidden" />
                        </label>
                    }
                </div>
                </div>
            </div>
            <div className='flex justify-end my-10'>
                <Link
                to={"/profile"}
                className="justify-center ml-5 rounded-md bg-red-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Cancel
                </Link>
                <button
                type="submit"
                className=" justify-center mx-10 rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                Save
                </button>
            </div>
            </form>
        </div>
    )
    }
