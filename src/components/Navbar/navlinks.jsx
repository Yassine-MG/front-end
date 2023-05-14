import React from 'react'
import { Link } from 'react-router-dom';
import { links } from './mylinks';
const NavLinks = () => {
    return (
        <>
            {
                links.map((link,index)=>(
                    <div key={index}>
                        <div className='px-3 text-left md:cursor-pointer group'>
                            <h1 className='py-7'>{link.name}</h1>
                            {link.submenu &&
                            <div>
                                <div className='absolute top-20 hidden group-hover:md:block hover:block'>
                                    <div className='py-3'>
                                        <div className='w-4 h-4 left-3 absolute mt-1 bg-slate-300 rotate-45'></div>
                                    </div>
                                    <div className='bg-slate-300 p-3.5 grid grid-cols-3 gap-10'>
                                        {link.sublinks.map((mysublinks , index)=>(
                                            <div key={index}>
                                                <h1 className='text-lg font-semibold'>{mysublinks.Head}</h1>
                                                {mysublinks.sublink.map(slink=>(
                                                    <li className='text-sm text-gray-600 my-2.5'>
                                                        <Link to={slink.link} className=' hover:text-blue-500'>{slink.name}</Link>
                                                    </li>
                                                ))}
                                            </div>
                                        ))
                                        }
                                    </div>
                                </div>
                            </div>}
                            
                        </div>
                        {/* Mobile version */}
                        {/* <div className=''>
                            {link.sublinks.map((slinks,index)=>(
                                    <div key={index}>
                                        <div>
                                            <h1>{slinks.Head}</h1>
                                        </div>
                                    </div>
                                ))
                            }
                        </div> */}
                    </div>

                ))
            }
        </>
    )
}

export default NavLinks