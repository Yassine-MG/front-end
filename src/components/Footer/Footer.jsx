import React from 'react'
import { Link } from 'react-router-dom'
export default function Footer() {
  return (
    <div className='bg-[#1b1b1b] max-w-screen min-h-[30vh] '>
      
    <div className='container w-[80%] mx-auto '>
      <div className='lg:flex justify-between py-10'>
        <h1 className='text-[20px] text-white md:mt-0'><i className="bi bi-globe pr-2 text-[#86d2f4]"></i> The Freelance Hub</h1>
          <div className='flex lg:flex-row flex-col text-white '>
            <Link className='px-5 py-2 lg:py-0'>Home</Link>
            <Link className='px-5 py-2 lg:py-0'>Services</Link>
            <Link className='px-5 py-2 lg:py-0'>Home</Link>
            <Link className='px-5 py-2 lg:py-0'>Contact us</Link>
          </div>
      </div>
    </div>   
    <hr className='border-gray-700 md:py-10 py-5 ' />   
    <div className='container w-[80%] text-center py-3 mx-auto'>
      <div className='lg:flex justify-between'>
        <p className=' font-semibold text-white md:mt-0'> ©2023 Made By Yassine Mghazli  </p>
        <div className='text-white text-2xl flex justify-between'>
          <Link><i className="bi bi-linkedin mx-2 md:mx-5"></i></Link>
          <Link><i className="bi bi-github mx-2 md:mx-5"></i></Link>
          <Link><i className="bi bi-instagram mx-2 md:mx-5"></i></Link>
          <Link><i className="bi bi-facebook mx-2 md:mx-5"></i></Link>
        </div>
      </div>
        
    </div>     
  </div>
  )
}
