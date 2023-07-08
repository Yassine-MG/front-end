import React, { useState, useEffect } from 'react';
import { options } from '../Helpers/functions';
import http from '../http';
import img2 from "../images/defaultpic.jpg";
import accuille1 from "../images/accuille1.jpg";
import accuille2 from "../images/accuille2.jpg";
import accuille3 from "../images/accuille3.jpg";
import accuille4 from "../images/accuille4.jpg";
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const backgroundImages = [accuille1, accuille2, accuille3, accuille4];
export default function Home() {
  const [selectedSubCategory, setSelectedSubCategory] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  // const [category , setCategory] = useState("");
  const [bestServices, setBestServices] = useState([]);
  const navigate = useNavigate();
  const [counts,setCounts] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);
  const token = Cookies.get("access_token");
  console.log(token);
  const fetchServiceCounts = async () => {
    try {
      const response = await http.get('/count/services/category'); // Replace with your API endpoint URL
      setCounts(response.data);
      // Handle the counts data, e.g., set it in the state
    } catch (error) {
      console.error('Error occurred while fetching service counts:', error);
    }
  };
  const fetchBestServices = async () => {
    try {
      const response = await http.get('/services/best');
      setBestServices(response.data);
    } catch (error) {
      console.error('Error occurred while fetching best services:', error);
    }
  };
  useEffect(() => {
    fetchBestServices();
  }, []);
  useEffect(() => {
    fetchServiceCounts();
  }, []);
  useEffect(() => {
    const fetchSearchResults = async () => {
      try {
        if (searchQuery.trim() !== '') {
          const encodedCategory = encodeURIComponent(selectedCategory);
          const encodedSubcategory = encodeURIComponent(selectedSubCategory);
          const url = `/search?query=${searchQuery}&category=${encodedCategory}&subcategory=${encodedSubcategory}`;
          const response = await http.get(url);
          setSearchResults(response.data.results);
          console.log(response.data.results.slice(0, 5));
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error('Error occurred during search:', error);
      }
    };
    

    fetchSearchResults();
  }, [searchQuery, selectedCategory, selectedSubCategory]);


    useEffect(() => {
    if (selectedCategory === '') {
      setSelectedSubCategory('');
    }
  }, [selectedCategory]);

  const handleSearchQueryChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
  
    if (query.trim() === '') {
      setSelectedCategory('');
      setSelectedSubCategory('');
    }
  };

  const handleSearch = async () => {
    try {
      const encodedCategory = encodeURIComponent(selectedCategory);
      const encodedSubcategory = encodeURIComponent(selectedSubCategory);
      const url = `/search?query=${searchQuery}&category=${encodedCategory}&subcategory=${encodedSubcategory}`;
      const response = await http.get(url);
      setSearchResults(response.data.results);
      console.log(response.data);
  
      // Navigate to ServiceList component with the filtered services
      navigate('/service/list', { state: { services: searchResults , category:  encodedCategory}});
    } catch (error) {
      console.error('Error occurred during search:', error);
    }
    
  };
  
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prevImage) => (prevImage + 1) % backgroundImages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className='mt-20 cat max-w-screen '>
      {/* accuille */}
      <div className='bg-[#f3f5f7] absolute top-0 left-0 w-full h-full z-0'>
            {backgroundImages.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Background ${index}`}
                className={`absolute top-0 image1 object-cover left-0 w-full h-full duration-800 transition-all ease-out ${
                  index === currentImage ? 'opacity-100' : 'opacity-0'
                }`}
              />
            ))}
          </div>
      <div className='flex justify-center  items-center min-h-screen '>
        
        <div className='mx-2 relative'>
          <div className=' relative z-10 '>
          <h1 className='md:text-5xl text-white text-4xl text-center font-semibold'>
          Empower <span className='text-[#86d2f4]'> Your Business:  </span>
            <br /> <span className='text-[#86d2f4]'>Freelance</span> Excellence
          </h1>
          <div className='md:w-[60%] mx-auto my-10'>
            <p className='text-[#dadce2] font-semibold text-center'>
            Unleash the Full Potential of Your Business with Unmatched Freelance Excellence, Empowering You with Expert Solutions and Limitless Opportunities for Growth.
            </p>
          </div>
          <div className='bg-white  sm:grid-cols-2 rounded-md grid grid-cols-1 gap-6 justify-items-center lg:flex justify-between p-4 items-center'>
            <div className='w-[100%] lg:w-auto'>
              <input
                name='title'
                onChange={handleSearchQueryChange}
                type='text'
                id='job-keyword'
                className='py-3 px-5 w-[100%] lg:w-auto bg-gray-100 outline-none dark:bg-slate-800 border-0'
                placeholder='Search your Keywords'
              />
            </div>
            <div className='bg-gray-200 h-5 w-[1px]  lg:inline-block hidden'></div>
            <div className='w-[100%] lg:w-auto'>
              <select
                name='category'
                id='category-select'
                className='py-3 px-5 w-[100%] font-semibold lg:w-auto outline-none bg-gray-100 dark:bg-slate-800 border-0'
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value=''>Select Category</option>
                {options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className='bg-gray-200 h-5 w-[1px] lg:block hidden'></div>
            <div className='w-[100%] lg:w-auto'>
              <select
                name='skills'
                id='sub-category-select'
                className='py-3 px-5 w-[100%] font-semibold lg:w-auto outline-none bg-gray-100 dark:bg-slate-800 border-0'
                value={selectedSubCategory}
                onChange={(e) => setSelectedSubCategory(e.target.value)}
                disabled={!selectedCategory} // Disable the select if no category is selected
              >
                <option value=''>Select Subcategory</option>
                {options
                  .find((option) => option.value === selectedCategory)
                  ?.checkboxes.map((checkbox) => (
                    <option  key={checkbox.value} value={checkbox.value}>
                      {checkbox.label}
                    </option>
                  ))}
              </select>
            </div>
            <div className='bg-gray-200 h-5 w-[1px] lg:block hidden'></div>
            <div className='w-[100%] lg:w-auto'>
              <button
                type='button'
                id='search'
                name='search'
                className='bg-[#86d2f4] w-[100%] lg:w-auto hover:bg-[#135d80] transition-all duration-500 py-2 px-8 font-semibold text-lg text-white'
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
            
          </div>

          </div>
          
          {/* {searchResults.length > 0 && ( */}
                <ul className={` mt-[5px] ${searchResults.length > 0 ? "xs:top-[508px] sm:top-[365px] md:top-[380px] lg:top-[310px] " : "top-[-3px] "} min-h-[80px] absolute min-w-full z-0 transition-all ease-in-out duration-300 `}>
                  {searchResults.slice(0, 5).map((result) => (
                    <Link to={`/service/${result.id}`}>
                      <li key={result.id} className='list py-3 px-2 bg-white hover:bg-gray-100  transition-all duration-300 border-y-1 border'>
                        <div className='flex items-center'>
                            {
                              result.image1 ?<img src={`http://localhost:8000${result.image1}`} className='image-list rounded-md w-12 h-12' alt="" />
                              :
                              <img src={img2} className='w-12 h-12 image-list rounded-md' alt="" />
                            }
                          <div className='ml-2'>
                          <h1 className='font-semibold'>
                            {result.title.length > 15
                              ? result.title.slice(0, 15) + '...'
                              : result.title}
                          </h1>
                          <p className=' text-sm text-gray-400'>{result.delevery}</p>
                          </div>
                        </div>
                        </li>
                      </Link>
                  ))}
                </ul>
              {/* )} */}
        </div>
      </div>
      {/* Top Rated Services */}
      <div  className='mx-auto my-16 container'>
        <div className='text-center cat'>
          <h1 className='font-semibold text-2xl text-[#1f2937] my-10'>Popular Categories</h1>
          <p className='text-gray-400 lg:w-[70%] w-[95%] text-justify sm:text-center my-5 mx-auto'>Discover in-demand freelance categories. Connect with skilled professionals across various fields, collaborate globally, and achieve your project goals with confidence. Join a community of successful clients who have leveraged freelancers in popular domains.</p>
          <div>
              <div className='grid  w-full sm:grid-cols-2 lg:grid-cols-3 my-8 mx-auto gap-2 justify-items-center '>
                {counts.map((count,index)=>
                <Link key={index} to={`/service/list?category=${encodeURIComponent(count.category)}`} className='count bg-white hover:bg-[#a8cbee] sm:inline-block outline-none my-4 p-10 shadow-inner  cursor-pointer transition-all duration-300 ease-in-out border rounded-md lg:mx-10 h-64 w-56'>
                  <div className=' p-8 mb-4 rounded-lg  shadow-sm bg-[#f3f5f7] text-[#86d2f4]'>
                    <i className={`${count.icon} font-semibold text-3xl`}></i>                    
                  </div>
                  <h2 className=' font-semibold'>{count.category}</h2>
                  <h4 className='text-gray-400 text-sm'>{count.count} services</h4>
                </Link>
                )}
              </div>
          </div>
          <hr className='w-[25%] mx-auto my-20'/>
        </div>
        </div>
        <div className='bg-[#ffffff] py-5'>
          <div className='text-center  container mx-auto'>
            <h1 className='font-semibold text-2xl text-[#1f2937] my-10'>Top-Rated Services</h1>
            <p className='text-gray-400 lg:w-[70%] w-[95%] mb-12 text-justify sm:text-center my-5 mx-auto'>Discover exceptional freelance services on our platform, where talented professionals deliver outstanding results. Experience the expertise and quality that sets our freelancers apart, and achieve your project goals with confidence.</p>
            <div className='grid grid-cols-1 lg:w-[100%] xl:w-[85%] mx-auto p-3 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 justify-items-center text-justify'>

            {bestServices.map((service) => (
              
              <div className=" bg-white rounded h-[40vh] w-full lg:w-[85%] shadow-lg">
                <div className='containerdiv w-full h-[60%] rounded-t-lg'>
                  <img className="w-full h-[100%] rounded-t-lg" src={`http://localhost:8000${service?.image1}`} alt="Sunset in the mountains"/>
                </div>
                <div className="px-3 flex flex-col justify-items-center py-3 relative mx-2 my-1">
                  <h5 className='absolute text-xs text-white rounded-full top-[-15px] left-[3px] z-20 bg-[#86d2f4] px-2 py-1 font-semibold '>{service.category}</h5>
                  <div className='flex justify-between '>
                    <h3 className='text-sm text-gray-400'><i className="bi bi-calendar-check"></i> {service.delevery}</h3>
                    <Link to={`/service/${service.id}`} className='font-semibold hover-underline-animation hover:text-[#86d2f4] duration-300 transition-all'>Read More</Link>
                  </div>
                  
                  <h4 className="font-bold text-xl py-2">{service.title}</h4>
                  <p className="text-gray-700 text-xs mb-3 lg:text-sm">
                  {console.log(service)}
                  {service.description.length > 40
                    ? service.description.slice(0, 40) + '...'
                    : service.description}
                  </p>
                  
                </div>

              </div>

            ))}
            </div>
          </div>
          {
            !token ? 
            <div className='container mx-auto my-10'>
              <div className='xl:w-[80%] mx-auto lg:my-0 my-2 w-[95%] xl:flex rounded-lg shadow-lg items-center justify-between bg-white p-5'>
                <div className=' xl:w-[60%] my-6 '>
                  <h1 className='text-lg font-semibold my-2'>Join Our Thriving Freelancer Community: Connect, Collaborate, and Create!</h1>
                  <p className=' text-sm text-gray-400 my-2 text-justify'>Discover exceptional freelance services, connect with skilled professionals, and experience seamless collaborations that bring your projects to life. Join our thriving community today!</p>
                </div>
                <div className='flex'>
                  <Link to={'/register'} className='py-2 px-5 rounded-lg text-white font-semibold  bg-[#86d2f4] hover:bg-[#135d80] duration-300 mr-2' > Register </Link>
                  <Link to={"/login"} className='py-2 px-5 rounded-lg border border-[#86d2f4] text-[#86d2f4] hover:text-white duration-300 hover:bg-[#86d2f4] font-semibold bg-transparant'> Log in </Link>
                </div>
              </div>
                
            </div>
            :
            <></>
          }


      </div>
    </div>
  );
}