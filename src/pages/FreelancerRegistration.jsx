import React,{useState} from 'react'
// import http from '../http';
// import Cookies from 'js-cookie';
import {saveUserInSession , postDataWithToken} from '../Helpers/functions';
// import { PhotoIcon, UserCircleIcon } from '@heroicons/react/24/solid'
export default function FreelancerRegistration() {
    const[inputs,setInputs] = useState({
        first_name: '',
        last_name: '',
        displayed_name: '',
        description: '',
        cv: '',
        occupation: '',
        skills: '',
        education: '',
        certification: '',
    });
    const handleSubmit = (e) => {
            e.preventDefault();
            
            postDataWithToken('/freelancers', inputs)
            .then(response => {
                console.log(response.data);
                saveUserInSession(response.data.user);
                // Do something with the response data, such as redirect to a success page
            })
            .catch(error => {
                console.log(error);
                // Handle the error, such as displaying validation errors on the form
            });
    };
    return (
        <div>
            <form method="POST">
                <div className="space-y-12">                
                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Personal Information</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">Tell us a bit about yourself. This information will appear on your public profile, so that potential buyers can get to know you better.</p>

                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            First name
                        </label>
                        <div className="mt-2">
                            <input
                            type="text"
                            name="first_name"
                            value={inputs.first_name}
                            onChange={(e) => setInputs({ ...inputs, first_name: e.target.value })}
                            id="first_name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        </div>

                        <div className="sm:col-span-3">
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Last name
                        </label>
                        <div className="mt-2">
                            <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            value={inputs.last_name}
                            onChange={(e) => setInputs({ ...inputs, last_name: e.target.value })}
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        </div>

                        <div className="sm:col-span-4">
                        <label htmlFor="displayed_Name" className="block text-sm font-medium leading-6 text-gray-900">
                            Displayed Name
                        </label>
                        <div className="mt-2">
                            <input
                            type="text"
                            name="displayed_Name"
                            id="displayed_Name"
                            value={inputs.displayed_name}
                            onChange={(e) => setInputs({ ...inputs, displayed_name: e.target.value })}
                            autoComplete="family-name"
                            className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        </div>

                        <div className="col-span-full">
                            <label htmlFor="description" className="block text-sm font-medium leading-6 text-gray-900">
                                About
                            </label>
                            <div className="mt-2">
                                <textarea
                                id="description"
                                name="description"
                                rows={3}
                                value={inputs.about}
                                onChange={(e) => setInputs({ ...inputs, description: e.target.value })}
                                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                defaultValue={''}
                                />
                            </div>
                            <p className="mt-3 text-sm leading-6 text-gray-600">Write a few sentences about yourself.</p>
                        </div>
                    </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-base font-semibold leading-7 text-gray-900">Profile</h2>
                        <p className="mt-1 text-sm leading-6 text-gray-600">
                            This information will be displayed publicly so be careful what you share.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="cv" className="block text-sm font-medium leading-6 text-gray-900">
                                    CV
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus-within:ring-indigo-600 sm:max-w-md">
                                    {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">www.</span> */}
                                    <input
                                        type="text"
                                        name="cv"
                                        id="cv"
                                        value={inputs.cv}
                                        onChange={(e) => setInputs({ ...inputs, cv: e.target.value })}
                                        autoComplete="username"
                                        className="block flex-1 border-0 bg-transparent py-1.5 pl-1 text-gray-900 placeholder:text-gray-400 focus:ring-0 sm:text-sm sm:leading-6"
                                        placeholder="www.Portfolio.com"
                                    />
                                    </div>
                                </div>
                            </div>
                            <div className="col-span-full">
                                <label htmlFor="skills" className="block text-sm font-medium leading-6 text-gray-900">
                                    Skills <span className='text-red-500'>*</span>
                                </label>
                                <span className='text-xs'>Add any relevant education details that will help customers to get to know you better.</span>
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    name="skills"
                                    id="skills"
                                    value={inputs.skills}
                                    onChange={(e) => setInputs({ ...inputs, skills: e.target.value })}
                                    autoComplete="street-address"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2 sm:col-start-1">
                                <label htmlFor="education" className="block text-sm font-medium leading-6 text-gray-900">
                                    Education
                                </label>
                                <span className='text-xs'>Include any certificates or awards that are relevant to the services you're offering.</span>
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    name="education"
                                    id="education"
                                    value={inputs.education}
                                    onChange={(e) => setInputs({ ...inputs, education: e.target.value })}
                                    autoComplete="address-level2"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="certification" className="block text-sm font-medium leading-6 text-gray-900">
                                    Certification
                                </label>
                                <span className='text-xs'>Include any certificates or awards that are relevant to the services you're offering.</span>
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    name="certification"
                                    id="certification"
                                    value={inputs.certification}
                                    onChange={(e) => setInputs({ ...inputs, certification: e.target.value })}
                                    autoComplete="address-level1"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="occupation" className="block text-sm font-medium leading-6 text-gray-900">
                                    Your Occupation
                                </label>
                                <span className='text-xs'>Include a link to your personal website or portfolio with your work samples.</span>
                                <div className="mt-2">
                                    <input
                                    type="text"
                                    name="occupation"
                                    id="occupation"
                                    value={inputs.occupation}
                                    onChange={(e) => setInputs({ ...inputs, occupation: e.target.value })}
                                    autoComplete="postal-code"
                                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>


                </div>

                <div className="mt-6 flex mb-6 items-center justify-end gap-x-6">
                    <button type="button" className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                    </button>
                    <button
                    onClick={handleSubmit}
                    className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                    Save
                    </button>
                </div>
            </form>
        </div>
    )
}
