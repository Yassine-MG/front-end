import React , {useState} from 'react'
import { Link, useNavigate } from "react-router-dom";
import {saveUserInSession , postDataWithToken,options} from '../../Helpers/functions';
export default function OverviewForm() {
  const [selectedOption, setSelectedOption] = useState("");
  const [selectedCheckboxes, setSelectedCheckboxes] = useState([]);
  const [errors, setErrors] = useState([]);
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
    }else {
      if (selectedCheckboxes.length < 4) {
        setSelectedCheckboxes([...selectedCheckboxes, value]);
      }
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
          console.log(response.data.user);
          saveUserInSession(response.data.user);
          // sessionStorage.setItem('service', JSON.stringify(data));
          sessionStorage.setItem('service', JSON.stringify(response.data.service));
          navigate('/add/service/priceform')
      })
      .catch(error => {
          console.log(error);
          setErrors(error.response.data.errors)
      });
};
console.log(errors);
  return (
    <div className='container md:w-[70%] mx-auto border my-[100px] border-gray-200'>
      <form method='post'>
      <div className='grid grid-cols-5 p-4 '>
          <div className='xl:col-span-1 lg:col-span-2 col-span-5'>
            <h1 className='text-lg font-semibold my-2'>Title</h1>
            <p className='text-sm'>As your Gig storefront, your title is the most important place to include keywords that buyers would likely use to search for a service like yours</p>
          </div>
          <div className='xl:col-span-4 lg:col-span-3 col-span-5'>
              <textarea className='resize-none w-full p-2 outline-none mt-8 border-1 border-gray-300  focus:border-[#86d2f4]  h-[10vh]' value={inputs.title} onChange={(e) => setInputs({ ...inputs, title: e.target.value })} rows="2" cols="100" maxLength="200" name="title" id="title" ></textarea>
              {
                errors.title ?<h4 className='text-xs font-bold text-red-500'>*{errors.title}</h4> :<></>
              }
          </div>
          
        </div>

        <div className=' p-4 grid grid-cols-5'>
          <div className='xl:col-span-1 lg:col-span-2 col-span-5'>
            <h1 className='text-lg font-semibold my-2'>Description</h1>
            <p className='text-sm'>As your Gig storefront, You must describe what You do on your services </p>
          </div>
          <div className='xl:col-span-4 lg:col-span-3 col-span-5'>
          <textarea className=' resize-none w-full p-2 outline-none border-1 border-gray-300  focus:border-[#86d2f4]  mt-8 h-[10vh]' value={inputs.description} onChange={(e) => setInputs({ ...inputs, description: e.target.value })} rows="2" cols="100" name="description" id="description" ></textarea>
              {
                errors.description ?<h4 className='text-xs font-bold text-red-500'>*{errors.description}</h4> :<></>
              }
          </div>
        </div>
        <div className='p-4 w-[100%] mx-auto'>
          
                  <div className='grid grid-cols-5 items-center'>
                      <h2 className='xl:col-span-1 lg:col-span-2 col-span-5  font-semibold'>Select your Category</h2>
                      <div className='xl:col-span-4 lg:col-span-3 col-span-5'>
                        <select className=' block w-full mt-3 outline-none border-1 border-gray-300  focus:border-[#86d2f4]   py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-500 focus:ring-2 focus:ring-inset sm:text-sm sm:leading-6' value={selectedOption} onChange={handleSelectChange}>
                            <option value="">Select an option</option>
                            {options.map((option) => (
                                <option key={option.value} value={option.value}>
                                {option.label}
                                </option>
                            ))}
                        </select>
                            {
                              errors.category ?<h4 className='text-xs font-bold text-red-500'>*{errors.category}</h4> :<></>
                            }
                      </div>
                  </div>
        </div>
        <div className='mx-auto'>
        {selectedOption && (
          <div>
            {
              errors.skills ?<h4 className='text-xs text-center my-4 font-bold text-red-500'>*{errors.skills}</h4> :<></>
            }
            <div className='grid md:grid-cols-2 grid-cols-1 ml-7 justify-between md:w-[60%] md:mx-auto'>
                {options
                .find((option) => option.value === selectedOption)
                .checkboxes.map((checkbox) => (
                    <div className='py-2' key={checkbox.value}>
                        <input className='cursor-pointer' type="checkbox" id={checkbox.value} name={checkbox.value} checked={selectedCheckboxes.includes(checkbox.value)} onChange={handleCheckboxChange} value={checkbox.value} />
                        <label className='cursor-pointer ml-3' htmlFor={checkbox.value}>{checkbox.label}</label>
                    </div>
                ))}

            </div>
          </div>
        )}
        </div>
        <div className='flex justify-end mb-10'>
          <Link
            to={"/profile"}
            type="button"
            className="text-red-700 hover:text-white border border-red-700 duration-300 transition-all  hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-6 py-2 text-center mx-2 "
          >
            Cancel
          </Link>
          <button
            type="button"
            onClick={handleSubmit}
            className="text-[#86d2f4] hover:text-white border border-[#86d2f4] duration-300 transition-all  hover:bg-[#39a0cf] focus:ring-4 focus:outline-none focus:ring-[#9dd4ee] font-medium rounded-lg text-sm px-6 py-2 text-center mx-2 "
          >
            Next
          </button>
        </div>
      </form>
    </div>
  )
}
