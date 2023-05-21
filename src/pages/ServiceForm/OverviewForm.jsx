import React , {useState} from 'react'
import { useNavigate } from "react-router-dom";
import {saveUserInSession , postDataWithToken,options} from '../../Helpers/functions';
export default function OverviewForm() {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const navigate = useNavigate();
  const[inputs,setInputs] = useState({
    title: '',
    description: '',
    category: '',
    skills: '',
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
      postDataWithToken('/create/service', data)
      .then(response => {
          console.log(response);
          saveUserInSession(response.data.user);
          // sessionStorage.setItem('service', JSON.stringify(data));
          sessionStorage.setItem('service', JSON.stringify(response.data.service));
          navigate('/add/service/priceform')
      })
      .catch(error => {
          console.log(error);
          // const responseErrors = error.response.data.errors;
          
          // if (typeof responseErrors === 'object' && responseErrors !== null) {
          //     const errorsArray = Object.values(responseErrors).flat();
          //     setErrors(errorsArray);
          //     window.scrollTo({
          //         top: 0, 
          //         behavior: 'smooth'
          //       });
              
          //   }
      });
};
  return (
    <div className='w-[70%] mx-auto border my-20 border-gray-200'>
      <form method='post'>
      <div className='flex p-5 '>
          <div className='w-[30%] m-5 pr-5'>
            <h1 className='text-lg font-semibold my-2'>Title</h1>
            <p className='text-sm'>As your Gig storefront, your title is the most important place to include keywords that buyers would likely use to search for a service like yours</p>
          </div>
          <textarea className='resize-none p-2 outline-none border mt-8 border-gray-200 h-[10vh]' value={inputs.title} onChange={(e) => setInputs({ ...inputs, title: e.target.value })} rows="2" cols="100" maxLength="200" name="title" id="title" ></textarea>
        </div>
        <div className='flex p-5 '>
          <div className='w-[30%] m-5 pr-5'>
            <h1 className='text-lg font-semibold my-2'>Description</h1>
            <p className='text-sm'>As your Gig storefront, You must describe what You do on your services </p>
          </div>
          <textarea className='resize-none p-2 outline-none border mt-8 border-gray-200 h-[10vh]' value={inputs.description} onChange={(e) => setInputs({ ...inputs, description: e.target.value })} rows="2" cols="100" name="description" id="description" ></textarea>
        </div>
        <div className='p-5 w-[100%] mx-auto'>
          
                  <div className='flex'>
                      <h2 className='w-[30%] my-5 mx-5'>Select your Category</h2>
                      <select className='block my-5 w-full border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6' value={selectedOption} onChange={handleSelectChange}>
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
          <div className='grid w-[100%] grid-cols-2 ml-[28%]'>
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
        <div className='flex justify-end my-10'>
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
