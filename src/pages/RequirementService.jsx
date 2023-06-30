import React, { useState } from 'react';
import { Link , useParams} from 'react-router-dom';
import http from '../http';
import Cookies from 'js-cookie';

export default function RequirementService() {
    const token = Cookies.get("access_token");
    const { id } = useParams();
    const [formData, setFormData] = useState({
        'project_name': '',
        'description': '',
        'files': []
        });
        
        const handleChange = (event) => {
            if (event.target.name === 'files') {
              // Handle file input separately
              setFormData({
                ...formData,
                files: Array.from(event.target.files),
              });
            } else {
              // Handle other input fields
              setFormData({
                ...formData,
                [event.target.name]: event.target.value,
              });
            }
          };
        
        const handleSubmit = (event) => {
            event.preventDefault();
            const requestData = new FormData();
            requestData.append('project_name', formData.project_name);
            requestData.append('description', formData.description);
            requestData.append('service_id', id);
            
            // Append each file to the FormData object
            if (formData.files.length > 0) {
                for (let i = 0; i < formData.files.length; i++) {
                  requestData.append(`files[${i}]`, formData.files[i]);
                }
              }
            
            http.post('/commands', requestData,{
                'Content-Type': 'multipart/form-data',
                headers: {"Authorization": `Bearer ${token}`
            }})
            .then(response => {
                console.log(response.data);
                // Handle success response
            })
            .catch(error => {
                console.error(error);
                // Handle error response
            });
        };
    return (
        <div className=' container mx-auto border border-gray-200 m-10 p-10 rounded-md'>
            <form form onSubmit={handleSubmit}>
            <div className="sm:col-span-3 ">
                <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                    Project Name
                </label>
                <div className="mt-2">
                    <input
                    type="text"
                    name="project_name"
                    id="project_name"
                    autoComplete="given-name"
                    value={formData.project_name}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                </div>
                </div>
                <div className="col-span-full">
                <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
                    About
                </label>
                <div className="mt-2">
                    <textarea
                    id="description"
                    name="description"
                    rows={3}
                    value={formData.description}
                    onChange={handleChange}
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    defaultValue={''}
                    />
                </div>
                <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about Request.</p>
                </div>
                <div className="col-span-full">
                    <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                        Cover photo
                    </label>
                    <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                        <div className="text-center">
                            <i className="bi bi-images mx-auto h-20 w-20"></i>
                            <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                htmlFor="file-upload"
                                className="relative cursor-pointer rounded-md bg-white font-semibold text-indigo-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                <span>Upload a file</span>
                                <input id="file-upload" onChange={handleChange} name="files" multiple type="file" className="sr-only" />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                            </div>
                            <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                        </div>
                    </div>
                </div>
                <div className='flex justify-end mt-10'>
                    <Link
                    to={"/"}
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
