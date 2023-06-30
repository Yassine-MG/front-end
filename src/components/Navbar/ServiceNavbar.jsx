import React from 'react'
import { Link, useNavigate } from 'react-router-dom';

export default function ServiceNavbar({ serviceId ,freelancer_id, authid},overview,describtion,about_me) {

  const navigate = useNavigate();

  const handleModifyService = () => {
    // Logic to navigate to the editing page with the serviceId
    navigate(`/edit/service/overview/${serviceId}`);
  };

  return (
    <nav className=' flex justify-between mx-auto container p-5'>
        <ul className='flex'>
            <li className='text-lg font-semibold ml-5'><a href={overview}>overview</a></li>
            <li className='text-lg font-semibold ml-5'><a href={describtion}>describtion</a></li>
            <li className='text-lg font-semibold ml-5'><a href={about_me}>about me</a></li>
        </ul>

        {freelancer_id === authid ? (
        <button onClick={handleModifyService} className='text-lg font-semibold'>
          <i className='bi bi-pencil'></i> Edit
        </button>
      ) : (
        <></>
      )}
    </nav>
  )
}
