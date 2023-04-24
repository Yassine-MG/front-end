import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import NavLinks from './navlinks'
const Navbar = () => {
    const [open, setOpen] = useState(false)
  return (
    <nav className='bg-white'>
        <div className='flex items-center font-medium justify-around'>
            <div className='z-50 md:mb-0 mb-5 md:pt-0 pt-5 px-5 md:w-auto flex justify-between w-full'>
                <Link to={"/"}><h1 className=' text-[20px] md:mt-0'>The Freelance Hub</h1></Link>
                <div className='text-3xl md:hidden' onClick={()=>setOpen(!open)}>
                <ion-icon name={`${open ?'close-outline':'menu-outline'}`}></ion-icon>
                </div>
            </div>
            
            <ul className=' md:flex hidden uppercase items-center gap-4'>
                <li>
                    <Link to={"/"} className='py-7 px-3 inline-block'>Home</Link>
                </li>
                <NavLinks></NavLinks>
            </ul>
            <div className='md:block hidden '>
                <Link to={"/register"} className='bg-sky-500/50 mx-4 px-6 py-2 rounded-full '>Register</Link>
                <Link to={"/login"} className='bg-sky-500/50 py-2 px-6 rounded-full'>Log in</Link>
            </div>
            {/* Mobile nav */}
            <ul className={`md:hidden bg-white absolute w-full h-full bottom-0 py-20 pl-4 duration-500 ${open? "left-0":"left-[-100%]"}`}>
                <li>
                        <Link to={"/"} className='py-7 px-3 inline-block'>Home</Link>
                    </li>
                    <NavLinks></NavLinks>
                    <div className='py-5 flex flex-col'>
                        <Link to={"/register"} className='bg-sky-500/50 w-[100px] mb-10 md:mx-4 px-6 py-2 rounded-full '>Register</Link>
                        <Link to={"/login"} className='bg-sky-500/50 py-2 w-[100px] px-6 rounded-full'>Log in</Link>
                    </div>
                </ul>
        </div>
    </nav>
  )
}

export default Navbar