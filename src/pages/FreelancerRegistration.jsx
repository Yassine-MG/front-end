import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";
import {saveUserInSession , postDataWithToken, options} from '../Helpers/functions';
import { Link } from 'react-router-dom';
export default function FreelancerRegistration() {
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const[inputs,setInputs] = useState({
        first_name: '',
        last_name: '',
        displayed_name: '',
        description: '',
        cv: '',
        occupation: '',
        education: '',
        certification: '',
    });
    
        const handleCheckboxChange = (event) => {
            const { value } = event.target;
            if (selectedCheckboxes.includes(value)) {
                setSelectedCheckboxes(selectedCheckboxes.filter((item) => item !== value));
                //   console.log(selectedCheckboxes);
                } else {
                    console.log(selectedCheckboxes);
                    setSelectedCheckboxes([...selectedCheckboxes, value]);
                // setInputs({ ...inputs, skills: selectedCheckboxes })

                }
            };
    const handleSelectChange = (event) => {
        setSelectedOption(event.target.value);
        console.log(event.target.value);
        setInputs({ ...inputs, category: event.target.value })
        };
    const handleSubmit = (e) => {
            e.preventDefault();
            const data = {
                ...inputs,
                category: selectedOption,
                skills: [...selectedCheckboxes],
                };
            postDataWithToken('/freelancers', data)
            .then(response => {
                console.log(response.data);
                saveUserInSession(response.data.user);
                navigate('/profile')
            })
            .catch(error => {
                const responseErrors = error.response.data.errors;
                
                if (typeof responseErrors === 'object' && responseErrors !== null) {
                    const errorsArray = Object.values(responseErrors).flat();
                    setErrors(errorsArray);
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                      });
                    
                  }
            });
    };
    return (
        <div className='my-10'>
            <form method="POST">
                <div className="space-y-12">                
                    <div className="border-b border-gray-900/10 pb-12">
                        {
                           ( errors.length > 0 )?
                        
                        <div className="block border p-5 w-[70%] mx-auto border-gray-200 mt-10 bg-white ">
                            <h5
                                className="mb-2 text-xl text-center font-medium leading-tight text-neutral-800 dark:text-neutral-50">
                                Errors
                            </h5>
                            <ul className='grid grid-cols-2 my-4 gap-4'>
                                {errors.map((error, index) => (
                                    <li className='text-red-500 col-span-1' key={index}>- {error}</li>
                                ))}
                            </ul>
                        </div>
                        : <></>
                        }
                        <h2 className="text-base font-semibold leading-7 mb-5 text-gray-900">Personal Information :</h2>
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
                        <hr className='mt-10' />
                        <div className='my-10'>
                            <h2 className=''>Select your Category</h2>
                            <select className='block my-5 w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6' value={selectedOption} onChange={handleSelectChange}>
                                <option value="">Select an option</option>
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                    {option.label}
                                    </option>
                                ))}
                            </select>
                            {selectedOption && (
                            <div className='grid w-[40%] grid-cols-2'>
                                {options
                                .find((option) => option.value === selectedOption)
                                .checkboxes.map((checkbox) => (
                                    <div className='py-2' key={checkbox.value}>
                                        <input className='cursor-pointer' type="checkbox" id={checkbox.value} name={checkbox.value} checked={selectedCheckboxes.includes(checkbox.value)} onChange={handleCheckboxChange} value={checkbox.value} />
                                        <label className='cursor-pointer ml-3' htmlFor={checkbox.value}>{checkbox.label}</label>
                                    </div>
                                ))}
                            </div>
                            )}
                        </div>
                    </div>


                </div>

                <div className="mt-6 flex mb-6 items-center justify-end gap-x-6">
                    <Link to={'/profile'} className="text-sm font-semibold leading-6 text-gray-900">
                    Cancel
                    </Link>
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
