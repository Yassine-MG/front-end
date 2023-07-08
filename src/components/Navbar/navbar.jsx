import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import http from '../../http';
import Cookies from 'js-cookie';
import { Fragment } from 'react';
import { Menu, Transition } from '@headlessui/react';
function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const Navbar = ({ prop }) => {
    const [open, setOpen] = useState(false);
    const [sellerMode, setSellerMode] = useState(false); // Track seller mode
    const [user, setUser] = useState(null);
    const token = Cookies.get("access_token");
    const navigate = useNavigate();
    const sessionUser = JSON.parse(sessionStorage.getItem("user"));
    const [mode, setMode] = useState();
    useEffect(()=>{
        const id = sessionUser?.id;
        http.get(`/edit/${id}`,{headers: {"Authorization": `Bearer ${token}`}})
        .then((response) => {
            setUser(response.data.user)
        }).catch((error) => {
            // console.log(error.message);
        });
    },[])

    

    useEffect(() => {
        if (document.cookie.match('access_token')) {
        const checkAuth = async () => {
            try {
            const instance = http.create({
                withCredentials: true,
            });
            await instance.get('/checkauth');
            } catch (err) {
            navigate('/login');
            }
        };
        checkAuth();
        }
    }, []);
    
    const handleLogout = async () => {
        const token = Cookies.get('access_token');
        try {
        await http.post('/logout', {
            headers: { Authorization: `Bearer ${token}` },
        });
        Cookies.remove('access_token');
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('id');
        navigate('/login');
        } catch (err) {
        console.log(err);
        }
    };
    
    const handleSwitchMode = () => {
        setSellerMode(!sellerMode); // Toggle seller mode
        sessionStorage.setItem("sellerMode",sellerMode);
        // setMode(JSON.parse( sessionStorage.getItem("sellerMode")));
        setMode(!mode); // Update the value of mode
        if(mode == false ){
            navigate("/profile")
        }else if( mode == true){
            navigate("/")
        }
    };

    return (
        <nav className=' z-50 bg-[white] fixed top-0 w-screen border border-gray-200 border-t-0 border-l-0 border-r-0 border-b-1'>
        <div className='flex items-center font-medium justify-around'>
            <div className='z-50 md:mb-0  md:pt-0 py-3 my-2 md:px-5 px-3 md:w-auto flex justify-between w-full'>
            <Link to={'/'}>
                <h1 className='md:text-[20px] text-[18px] md:mt-0'><i className="bi bi-globe pr-2 text-[#86d2f4]"></i> The Freelance Hub</h1>
            </Link>
            <div className='text-3xl md:hidden' onClick={() => setOpen(!open)}>
                <ion-icon name={`${open ? 'close-outline' : 'menu-outline'}`}></ion-icon>
            </div>
            </div>

            <ul className='md:flex hidden uppercase items-center gap-4'>
            {sellerMode && user?.role == "Freelancer" ? ( // Render seller links
                <Fragment>
                <li>
                    <Link to={'/profile/orders'} className='py-7 px-3 inline-block'>
                    Orders
                    </Link>
                </li>
                <li>
                    <Link to={'/profile/gigs'} className='py-7 px-3 inline-block'>
                    Gigs
                    </Link>
                </li>
                <li>
                    <Link to={'/profile'} className='py-7 px-3 inline-block'>
                    Profile
                    </Link>
                </li>
                </Fragment>
            ) : ( // Render buyer links
                <Fragment>
                <li>
                    <Link to={'/'} className='py-7 px-3 inline-block'>
                    Home
                    </Link>
                </li>
                <li>
                    <Link to={'/service/list'} className='py-7 px-3 inline-block'>
                    Services
                    </Link>
                </li>
                
                </Fragment>
            )}
            </ul>
            <div className='md:flex items-center hidden'>
  
            {document.cookie.match('access_token') ? (
                <>
                <div className='mx-2'>
                    <Link to={"/list/messages"}><i className="bi bi-chat-dots font-semibold text-2xl"></i></Link>
                </div>
                <Menu as='div' className='relative inline-block text-left'>
                <div>
                    <Menu.Button className='inline-flex w-full justify-center gap-x-1.5 rounded-md px-3 py-2 text-sm font-semibold'>
                    <img className='w-10 h-10 rounded-full object-cover hover:' src={prop} alt='Rounded avatar'></img>
                    </Menu.Button>
                </div>

                <Transition
                    as={Fragment}
                    enter='transition ease-out duration-100'
                    enterFrom='transform opacity-0 scale-95'
                    enterTo='transform opacity-100 scale-100'
                    leave='transition ease-in duration-75'
                    leaveFrom='transform opacity-100 scale-100'
                    leaveTo='transform opacity-0 scale-95'
                >

                    <Menu.Items className='absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none'>
                    <div className='py-1'>
                        {
                            user?.role == "Freelancer" ?
                        
                        
                        <Menu.Item>
                        {({ active }) => (
                            
                            <button
                            className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-left'
                            )}
                            onClick={handleSwitchMode}
                            >
                            {sellerMode ? 'Switch to buying' : 'Switch to selling'}
                            </button>
                        )}
                        </Menu.Item>:
                        <></>
                        }
                        {sellerMode && user?.role == "Freelancer"  ?
                          <Menu.Item>
                        {({ active }) => (
                            <Link
                            to={'/profile/orders/waiting/list'}
                            className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                            )}
                            >
                            Waiting List Orders  
                            </Link>
                        )}
                        </Menu.Item>:
                        <></>
                        }
                        {!sellerMode ?
                        <Menu.Item>
                        {({ active }) => (
                            <Link
                            to={'/profile/clientorder'}
                            className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                            )}
                            >
                            My Orders
                            </Link>
                        )}
                        </Menu.Item>:
                        <></>
                        }
                        <Menu.Item>
                        {({ active }) => (
                            <Link
                            to={'/profile'}
                            className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm'
                            )}
                            >
                            Profile
                            </Link>
                        )}
                        </Menu.Item>
                      
                        <Menu.Item>
                        {({ active }) => (
                            <button
                            className={classNames(
                                active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                                'block px-4 py-2 text-sm w-full text-left'
                            )}
                            onClick={handleLogout}
                            >
                            Log Out
                            </button>
                        )}
                        </Menu.Item>
                    </div>
                    </Menu.Items>
                </Transition>
                </Menu></>
            ) : (
                <>
                <Link to={'/register'} className='bg-sky-500/50 mx-4 px-6 py-2 rounded-full '>
                    Register
                </Link>
                <Link to={'/login'} className='bg-sky-500/50 py-2 px-6 rounded-full'>
                    Log in
                </Link>
                </>
            )}
        </div>
        {/* Mobile nav */}
        <ul
        className={`md:hidden bg-white z-0 fixed w-full h-full bottom-0 py-20 pl-4 duration-500 ${
            open ? 'left-0' : 'left-[-100%]'
        }`}
        >
        <div className='py-5 flex flex-col'>
            {document.cookie.match('access_token') ? (
            <Fragment>
                {sellerMode && user?.role == "Freelancer"  ? (
                <Fragment>
                    <li>
                    <Link to={'/profile/orders'} onClick={() => setOpen(!open)} className='py-7 px-3 inline-block'>
                        Orders
                    </Link>
                    </li>
                    <li>
                    <Link to={'/profile/gigs'} onClick={() => setOpen(!open)} className='py-7 px-3 inline-block'>
                        Gigs
                    </Link>
                    </li>
                    <li>
                    <Link to={'/profile'} onClick={() => setOpen(!open)} className='py-7 px-3 inline-block'>
                        Profile
                    </Link>
                    </li>
                </Fragment>
                ) : (
                <Fragment>
                    <li>
                    <Link to={'/'} onClick={() => setOpen(!open)} className='py-7 px-3 inline-block'>
                        Home
                    </Link>
                    </li>
                    <li>
                    <Link to={'/service/list'} onClick={() => setOpen(!open)} className=' px-3 inline-block'>
                        Services
                    </Link>
                    </li>
                    <li>
                    <Link to={'/profile'} onClick={() => setOpen(!open)} className='py-7 px-3 inline-block'>
                        Profile
                    </Link>
                    </li>
                </Fragment>
                )}
                <button className='w-[90px]' onClick={handleLogout}>
                Log Out
                </button>
            </Fragment>
             ) : ( 
            <>
                 <li>
                    <Link to={'/'} onClick={() => setOpen(!open)} className='py-7 px-3 inline-block'>
                        Home
                    </Link>
                    </li>
                    <li>
                    <Link to={'/service/list'} onClick={() => setOpen(!open)} className='py-7 px-3 inline-block'>
                        Services
                    </Link>
                    </li>
                <Link
                to={'/register'}
                onClick={() => setOpen(!open)}
                className=' py-7 px-3 inline-block '
                >
                Register
                </Link>
                <Link
                to={'/login'}
                onClick={() => setOpen(!open)}
                className=' py-7 px-3 inline-block'
                >
                Log in
                </Link>
            </>
             )} 
        </div>
        {/* Switch Mode */}
        <div className="mt-5 px-4">
            {
               document.cookie.match('access_token') && user?.role == "Freelancer" ?
            <button
            className="bg-blue-500 text-white py-2 px-4 rounded-full w-full"
            onClick={handleSwitchMode}
            >
            {sellerMode ? 'Switch to buyer' : 'Switch to seller'}
            </button>
            :
            <></>    
        }
        </div>
        </ul>

      </div>
    </nav>
  );
};

export default Navbar;
