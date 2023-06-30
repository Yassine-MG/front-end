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
    <hr className='border-gray-700 py-10 ' />   
    <div className='container w-[80%] mx-auto'>
      <div className='lg:flex justify-between'>
        <p className=' font-semibold text-white md:mt-0'> ©2023 Made By Yassine Mghazli  </p>
        <div className='text-white text-2xl'>
          <Link><i className="bi bi-linkedin mx-5"></i></Link>
          <Link><i className="bi bi-github mx-5"></i></Link>
          <Link><i className="bi bi-instagram mx-5"></i></Link>
          <Link><i className="bi bi-facebook mx-5"></i></Link>
        </div>
      </div>
        
    </div>     
  </div>
  )
}
