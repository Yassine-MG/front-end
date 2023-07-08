import React,{useState} from 'react'
import { useNavigate } from "react-router-dom";
import {saveUserInSession , postDataWithToken, options} from '../Helpers/functions';
import { Link } from 'react-router-dom';
export default function FreelancerRegistration() {
    const [selectedOption, setSelectedOption] = useState("");
    const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
    const navigate = useNavigate();
    const [errors, setErrors] = useState([]);
    const [focusedInput, setFocusedInput] = useState('');
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
                setErrors(responseErrors)
                console.log(errors);
                if (typeof responseErrors === 'object' && responseErrors !== null) {
                    window.scrollTo({
                        top: 0, 
                        behavior: 'smooth'
                      });
                    
                  }
            });
    };

    const handleFocus = (inputId) => {
        setFocusedInput(inputId);
      };
    
      const handleBlur = () => {
        setFocusedInput('');
      };
    return (
        <div className='my-20 container min-h-screen mx-auto mx-50'>
            <form method="POST" className='lg:w-[80%] px-5 py-10 mx-auto'>
                <div className="space-y-12">                
                    <div className="border-b outline-none border-gray-900/10 pb-12">
 
                        <h2 className="text-2xl text-[#6199b3] font-semibold leading-7 mb-5">Personal Information :</h2>
                        <p className="mt-1 text-xs font-semibold leading-6 text-gray-600">Tell us a bit about yourself. This information will appear on your public profile, so that potential buyers can get to know you better.</p>



                    <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                        <div className="sm:col-span-3 lg:col-span-2 ">
                        <label htmlFor="first-name" className="block text-sm font-medium leading-6 text-gray-900">
                            First name
                        </label>
                        <div className="mt-2 relative ">
                            <input
                            type="text"
                            name="first_name"
                            value={inputs.first_name}
                            onFocus={() => handleFocus('first_name')}
                            onBlur={handleBlur}
                            onChange={(e) => setInputs({ ...inputs, first_name: e.target.value })}
                            id="first_name"
                            className="block w-full pl-9 outline-none rounded-md border-1 border-gray-300 focus:border-[#86d2f4] py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400  sm:text-sm sm:leading-6"
                            />
                            <span className={`absolute transition-all ease-in-out duration-300 ${focusedInput === 'first_name' ? "text-[#73caf3]" : "text-gray-400"} left-3 top-2`}>
                                <i className="bi bi-person"></i>
                            </span>
                            <span className='text-red-500 font-bold text-xs'>{errors?.first_name ?"*"+ errors?.first_name  :<></>}</span>
                        </div>
                        </div>

                        <div className="sm:col-span-3 lg:col-span-2" >
                        <label htmlFor="last-name" className="block text-sm font-medium leading-6 text-gray-900">
                            Last name
                        </label>
                        <div className="mt-2 relative">
                            <input
                            type="text"
                            name="last_name"
                            id="last_name"
                            value={inputs.last_name}
                            onChange={(e) => setInputs({ ...inputs, last_name: e.target.value })}
                            onFocus={() => handleFocus('last_name')}
                            onBlur={handleBlur}
                            autoComplete="family-name"
                            className="block w-full outline-none pl-9 rounded-md border-1 border-gray-300 focus:border-[#86d2f4] py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            />
                            <span className={`absolute transition-all ease-in-out duration-300 ${focusedInput === 'last_name' ? "text-[#73caf3]" : "text-gray-400"} left-3 top-2`}>
                                <i className="bi bi-person"></i>
                            </span>
                            <span className='text-red-500 font-bold text-xs'>{errors?.last_name ?"*"+ errors?.last_name  :<></>}</span>
                        </div>
                        </div>

                        <div className="sm:col-span-4 lg:col-span-2">
                        <label htmlFor="displayed_Name" className="block text-sm font-medium leading-6 text-gray-900">
                            Displayed Name
                        </label>
                        <div className="mt-2 relative">
                            <input
                            type="text"
                            name="displayed_Name"
                            id="displayed_Name"
                            value={inputs.displayed_name}
                            onChange={(e) => setInputs({ ...inputs, displayed_name: e.target.value })}
                            onFocus={() => handleFocus('displayed_Name')}
                            onBlur={handleBlur}
                            autoComplete="family-name"
                            className="block w-full pl-9 outline-none rounded-md   py-1.5 text-gray-900 shadow-sm border-1 border-gray-300 focus:border-[#86d2f4] placeholder:text-gray-400 sm:text-sm sm:leading-6"
                            />
                            <span className={`absolute transition-all ease-in-out duration-300 ${focusedInput === 'displayed_Name' ? "text-[#73caf3]" : "text-gray-400"} left-3 top-2`}>
                                <i className="bi bi-person"></i>
                            </span>

                            <span className='text-red-500 font-bold text-xs'>{errors?.displayed_name ?"*"+ errors?.displayed_name  :<></>}</span>
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
                                className="block w-full outline-none rounded-md border-1 border-gray-300 focus:border-[#86d2f4] px-2 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                defaultValue={''}
                                />
                            </div>
                            <span className='text-red-500 font-bold text-xs'>{errors?.description ?"*"+ errors?.description  :<></>}</span>
                            <p className="mt-3 text-xs font-semibold leading-6 text-gray-600">Write a few sentences about yourself.</p>
                            
                        </div>
                    </div>
                    </div>

                    <div className="border-b border-gray-900/10 pb-12">
                        <h2 className="text-2xl text-[#6199b3] font-semibold leading-7 mb-5">Profile</h2>
                        <p className="mt-1 text-xs font-semibold leading-6 text-gray-600">
                            This information will be displayed publicly so be careful what you share.
                        </p>

                        <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
                            <div className="sm:col-span-4">
                                <label htmlFor="cv" className="block text-sm font-medium leading-6 text-gray-900">
                                    CV
                                </label>
                                <div className="mt-2">
                                    <div className="flex rounded-md relative shadow-sm ring-1 ring-inset ring-gray-300 focus-within:ring-2 focus-within:ring-inset focus:ring-[#86d2f4] sm:max-w-md">
                                    {/* <span className="flex select-none items-center pl-3 text-gray-500 sm:text-sm">www.</span> */}
                                    <input
                                        type="text"
                                        name="cv"
                                        id="cv"
                                        value={inputs.cv}
                                        onChange={(e) => setInputs({ ...inputs, cv: e.target.value })}
                                        autoComplete="username"
                                        onFocus={() => handleFocus('cv')}
                                        onBlur={handleBlur}
                                        className="block flex-1 outline-none border-1 border-gray-300  focus:border-[#86d2f4] rounded-md bg-transparent  py-1.5 pl-9 text-gray-900 placeholder:text-gray-400  sm:text-sm sm:leading-6"
                                        placeholder="www.Portfolio.com"
                                    />
                                    
                                    <span className={`absolute transition-all ease-in-out duration-300 ${focusedInput === 'cv' ? "text-[#73caf3]" : "text-gray-400"}  left-3 top-2`}>
                                        <i className="bi bi-file-person"></i>
                                    </span>
                                    
                                    </div>
                                    <span className='text-red-500 font-bold text-xs'>{errors?.cv ?"*"+ errors?.cv  :<></>}</span>
                                </div>
                            </div>
                            <div className="sm:col-span-2 sm:col-start-1">
                                <label htmlFor="education" className="block text-sm font-medium leading-6 text-gray-900">
                                    Education
                                </label>
                                <span className='text-xs font-semibold'>Include any certificates or awards that are relevant to the services you're offering.</span>
                                <div className="mt-2 relative">
                                    <input
                                    type="text"
                                    name="education"
                                    id="education"
                                    value={inputs.education}
                                    onChange={(e) => setInputs({ ...inputs, education: e.target.value })}
                                    autoComplete="address-level2"
                                    onFocus={() => handleFocus('education')}
                                    onBlur={handleBlur}
                                    className="block w-full pl-9 outline-none rounded-md  border-1 border-gray-300  focus:border-[#86d2f4] py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    />
                                    <span className={`absolute transition-all ease-in-out duration-300 ${focusedInput === 'education' ? "text-[#73caf3]" : "text-gray-400"}  left-3 top-2`}>
                                    <i className="bi bi-mortarboard "></i>
                                    </span>
                                    <span className='text-red-500 font-bold text-xs'>{errors?.education ?"*"+ errors?.education  :<></>}</span>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="certification" className="block text-sm font-medium leading-6 text-gray-900">
                                    Certification
                                </label>
                                <span className='text-xs font-semibold'>Include any certificates or awards that are relevant to the services you're offering.</span>
                                <div className="mt-2 relative">
                                    <input
                                    type="text"
                                    name="certification"
                                    id="certification"
                                    value={inputs.certification}
                                    onChange={(e) => setInputs({ ...inputs, certification: e.target.value })}
                                    autoComplete="address-level1"
                                    onFocus={() => handleFocus('certification')}
                                    onBlur={handleBlur}
                                    className="block w-full outline-none rounded-md border-1 border-gray-300  focus:border-[#86d2f4] pl-9  py-1.5 text-gray-900 shadow-sm  placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    />
                                    <span className={`absolute transition-all ease-in-out duration-300 ${focusedInput === 'certification' ? "text-[#73caf3]" : "text-gray-400"}  left-3 top-2`}>
                                    <i className="bi bi-award"></i>
                                    </span>
                                    <span className='text-red-500 font-bold text-xs'>{errors?.certification ?"*"+ errors?.certification  :<></>}</span>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label htmlFor="occupation" className="block font-semibold text-sm  leading-6 text-gray-900">
                                    Your Occupation
                                </label>
                                <span className='text-xs font-semibold'>Include a link to your personal website or portfolio with your work samples.</span>
                                <div className="mt-2 relative">
                                    <input
                                    type="text"
                                    name="occupation"
                                    id="occupation"
                                    value={inputs.occupation}
                                    onChange={(e) => setInputs({ ...inputs, occupation: e.target.value })}
                                    autoComplete="postal-code"
                                    onFocus={() => handleFocus('occupation')}
                                    onBlur={handleBlur}
                                    className="block w-full outline-none pl-9 rounded-md border-1 border-gray-300  focus:border-[#86d2f4]  py-1.5 text-gray-900 shadow-sm placeholder:text-gray-400 sm:text-sm sm:leading-6"
                                    />
                                    <span className={`absolute transition-all ease-in-out duration-300 ${focusedInput === 'occupation' ? "text-[#73caf3]" : "text-gray-400"}  left-3 top-2`}>
                                        <i className="bi bi-pass"></i>
                                    </span>
                                    <span className='text-red-500 font-bold text-xs'>{errors?.occupation ?"*"+ errors?.occupation  :<></>}</span>
                                </div>
                            </div>
                        </div>
                        <hr className='mt-10' />
                        <div className='my-10'>
                            <h2 className=' font-semibold'>Select Category</h2>
                            <select className='block my-5 w-full rounded-md border-1 border-gray-300  focus:border-[#86d2f4] outline-none  py-1.5 text-gray-900 shadow-sm placeholder:text-gray-500 sm:text-sm sm:leading-6' value={selectedOption} onChange={handleSelectChange}>
                                <option value="">Select an option</option>
                                {options.map((option) => (
                                    <option key={option.value} value={option.value}>
                                    {option.label}
                                    </option>
                                ))}
                            </select>
                            <span className='text-red-500 font-bold text-xs'>{errors?.category ?"*"+ errors?.category  :<></>}</span>
                            {selectedOption && (
                            <div className='grid font-semibold text-xs xs:grid-cols-2 lg:w-[40%] grid-cols-1'>
                                {options
                                .find((option) => option.value === selectedOption)
                                .checkboxes.map((checkbox) => (
                                    <div className='py-2' key={checkbox.value}>
                                        <input className='cursor-pointer px-2 outline-none focus:ring-[#86d2f4] text-[#fff] accent-[#86d2f4] w-5 h-5 transition-all duration-300 ' type="checkbox" id={checkbox.value} name={checkbox.value} checked={selectedCheckboxes.includes(checkbox.value)} onChange={handleCheckboxChange} value={checkbox.value} />
                                        <label className='cursor-pointer ml-3' htmlFor={checkbox.value}>{checkbox.label}</label>
                                    </div>
                                ))}
                            </div>
                            )}
                        </div>
                    </div>


                </div>

                <div className="mt-6 flex mb-6 items-center justify-end gap-x-6">
                    <Link to={'/profile'} className="text-red-700 hover:text-white border border-red-700 duration-300 transition-all  hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-2 text-center mx-2 ">
                    Cancel
                    </Link>
                    <button
                    onClick={handleSubmit}
                    className="text-[#86d2f4] hover:text-white border border-[#86d2f4] duration-300 transition-all  hover:bg-[#39a0cf] focus:ring-4 focus:outline-none focus:ring-[#9dd4ee] font-medium rounded-lg text-sm px-6 py-2 text-center mx-2 "
                    >
                    Join
                    </button>
                </div>
            </form>
        </div>
    )
}
