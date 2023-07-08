import React, { useEffect, useState } from 'react';
import http from "../http";
import img1 from "../images/default.jfif";
import { deleverytimes } from '../Helpers/functions';
import { useLocation, Link } from 'react-router-dom';

export default function ServiceList() {
  const [services, setServices] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestedServices, setSuggestedServices] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState('All categories'); // Add selectedCategory state
  const [currentPage, setCurrentPage] = useState(1); // Add currentPage state
  const servicesPerPage = 20; // Number of services to display per page
  const [selectedSort, setSelectedSort] = useState('default');
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const location = useLocation();

  let Results = location.state?.services;
  let categorifromaccuille = location.state?.category
  useEffect(()=>{
    setSearchResults(Results)
  },[])
  const params = new URLSearchParams(location.search);
  let category = params.get('category');
  console.log('Category:', searchResults);
  
useEffect(()=>{
  if(category){
    setSelectedCategory(category);
  }
},[])
  
  useEffect(() => {
    // Fetch suggested services based on search query
    const timer = setTimeout(() => {
      if (searchQuery) {
        http.get('/search/services', { params: { search: searchQuery } })
          .then(response => {
            setSuggestedServices(response.data.services.slice(0, 4));
            // console.log(response.data);
            setSearchResults([])
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        setSuggestedServices([]);
      }
    }, 3000); // Debounce time in milliseconds

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    handleSearch(); // Fetch services when selectedCategory changes
  }, [selectedCategory,selectedSort,selectedDeliveryTime ] );


  const handleSearch = (event = null) => {
    if (event) {
      event.preventDefault();
    }
    const params = {
      search: searchQuery,
      category: selectedCategory,
      sort: selectedSort,
      delevery: selectedDeliveryTime // Include the selected delivery time
    };
  
    
    http.get('/search/services', { params })
      .then(response => {
        // Sort the services based on the selected sort and date options
        let sortedServices = response.data.services;

        console.log(sortedServices.length);
        if (selectedSort === 'lowest') {
          sortedServices = sortedServices.sort((a, b) => Number(a.price) - Number(b.price));
        } else if (selectedSort === 'highest') {
          sortedServices = sortedServices.sort((a, b) => Number(b.price) - Number(a.price));
        } else if (selectedSort === 'newest') {
          sortedServices = sortedServices.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (selectedSort === 'oldest') {
          sortedServices = sortedServices.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
        console.log(sortedServices);
        setServices(sortedServices);
       
        setSuggestedServices([]);
      })
      .catch(error => {
        console.log(error);
      });
  };
  const handleSuggestedServiceClick = (service) => {
    setServices([service]);
    setSuggestedServices([]);
    setSearchQuery(service.title);
  };

  
  const toggleDropdown = () => {
    setShowDropdown(prevState => !prevState); // Toggle dropdown visibility
    
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category); // Update selected category
    toggleDropdown(); // Close the dropdown after category selection
  };
  const clearFilters = () => {
    setSelectedCategory('All categories');
    setSelectedSort('default');
    setSelectedDeliveryTime('');
    setSearchQuery('');
    setCurrentPage(1);
    setSearchResults([])
  };
    // Get current services based on current page
    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = services.slice(indexOfFirstService, indexOfLastService);


  
    // Change page
    const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

  return (
    <div className='overflow-hidden py-7'>
    <div className=" w-screen container mx-auto my-20">
      <div className=" mx-0 md:mx-5">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Services</h2>
        {
          searchResults && searchResults.length > 0 ? 
          <p className='font-semibold text-2xl mt-5 text-[#135d80]'>{  categorifromaccuille ? categorifromaccuille : <></>}</p> :
          <p className='font-semibold text-2xl mt-5 text-[#135d80]'>{selectedCategory != "All categories" && selectedCategory ? selectedCategory : <></>}</p>
        }
        
      <form onSubmit={handleSearch} className='mt-8'> 
          <div className="flex ">

          <div className="relative">
                    <button
                      id="dropdown-button"
                      className="flex-shrink-0 text-xs md:w-[180px] h-[42px] z-10 inline-flex items-center py-3 px-2 justify-evenly font-medium text-center text-gray-900 transition-all duration-300 ease-in border border-gray-300 hover:bg-gray-100 focus:outline-none "
                      onClick={toggleDropdown}
                    >
                      {selectedCategory || "All categories"}                 
                      <svg
                        aria-hidden="true"
                        className="w-4 h-4 ml-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          fillRule="evenodd"
                          d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </button>
                    {showDropdown && (
                      <div className=" absolute z-10 mt-1 bg-white divide-y transition-all duration-300 ease-in divide-gray-100 rounded-lg shadow w-full">
                        <ul className="py-2 text-sm text-gray-700">
                        <li>
                            <button
                              type="button"
                              className="inline-flex w-full text-xs px-4 py-2  hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => handleCategoryChange('All categories')}
                            >
                              All categories
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="inline-flex w-full text-xs px-4 py-2  hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => handleCategoryChange('Data')}
                            >
                              Data
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="inline-flex w-full text-xs px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => handleCategoryChange('Video & Animation')}
                            >
                              Video & Animation
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="inline-flex w-full text-xs px-4 py-2  hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => handleCategoryChange('Business')}
                            >
                              Business
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="inline-flex w-full text-xs px-4 py-2  hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => handleCategoryChange('Writing & Translation')}
                            >
                              Writing & Translation
                            </button>
                          </li>                   
                          <li>
                            <button
                              type="button"
                              className="inline-flex text-xs w-full px-4 py-2  hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => handleCategoryChange('Developer')}
                            >
                              Developer
                            </button>
                          </li>                    
                          <li>
                            <button
                              type="button"
                              className="inline-flex text-xs  w-full px-4 py-2  hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => handleCategoryChange('Designer')}
                            >
                              Designer
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
              <div className="relative w-full">
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="search" id="search-dropdown" className=" outline-0 block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300  focus:border-[#86d2f4] dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search Mockups, Logos, Design Templates..." required></input>
                  <button type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium transition-all duration-300 ease-in text-white bg-[#86d2f4] hover:bg-[#135d80] rounded-r-lg border ">
                      <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      <span className="sr-only">Search</span>
                  </button>
              </div>
          </div>
          <div className='grid md:grid-cols-3 grid-cols-1 gap-2 lg:gap-[200px] my-4'>
          <select
                    className={`flex-shrink-0 bg-[#1f2937b4] w-full rounded-lg py-2  text-[white] text-sm  transition-all duration-300 ease-in border outline-none  px-2 font-semibold cursor-pointer`}
                    name="sort"
                    id="sort"
                    value={selectedSort}
                    onChange={e => setSelectedSort(e.target.value)}
                  >
                    <option className='h-6' value="default">Sort By</option>
                    <option value="lowest">Price Low to High</option>
                    <option value="highest">Price High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
          </select>
          
          <select
            className={`flex-shrink-0  bg-[#1f2937b4] py-2 px-3 w-full rounded-lg text-white text-sm  transition-all duration-300 ease-in border outline-none font-semibold  cursor-pointer`}
            value={selectedDeliveryTime}
            onChange={(e) => setSelectedDeliveryTime(e.target.value)}
          >
            <option value="">Select Delivery Time</option>
            {deleverytimes.map((time) => (
              <option key={time.value} value={time.value}>
                {time.label}
              </option>
            ))}
        </select>
        <button onClick={clearFilters} type='button' className=' w-full h-full   py-2 px-3 text-sm font-medium transition-all duration-300 ease-in text-white bg-[#86d2f4] hover:bg-[#135d80]  border'>Clear Filters</button>
            </div>
            
      <div className='relative mb-10'>
      {suggestedServices.length > 0 && (
                <div className=" absolute top-[-75px] w-full z-10  mt-2 bg-white  rounded-lg shadow">
                  <ul className="py-2 text-sm text-gray-700">
                    {suggestedServices.map((service, index) => (
                      <li key={index}>
                        <button
                          className="w-full px-4 py-2 hover:bg-gray-100"
                          onClick={() => handleSuggestedServiceClick(service)}
                        >
                          {service.title}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
      </div>
      </form>
                    {/* Conditional rendering for ServicesFromHome */}
          {/* {searchResults ? :} */}
         {searchResults && searchResults.length > 0 ? (
          <>
          <p className=' flex justify-end'> {searchResults.length} available Services</p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {searchResults.slice((currentPage - 1) * servicesPerPage, currentPage * servicesPerPage).map(service => (
                <Link key={service.id}  to={`/service/${service.id}`}>
                <div key={service.id} className="md:my-0 border min-h-[420px] rounded-md border-gray-200 relative">
                  {/* Render the service details */}
                  <div className=" containerdiv w-full overflow-hidden rounded-t-md bg-gray-200  md:h-80 ">
                    <img
                      src={`http://localhost:8000${service?.image1}`}
                      alt={service.image1}
                      className="h-full w-full object-cover object-center lg:h-full lg:w-full"
                    />
                  </div>
                  <div className='m-4'>
                    <div className=" flex justify-between">
                      <div className='flex'>
                        {
                          service?.freelancer?.user.photo ? 
                          <img src={`http://localhost:8000/storage/${service?.freelancer?.user?.photo}`} className='object-cover inline-block mr-5 h-8 w-8 rounded-full ring-2 ring-white' alt="" />
                          :
                          <img src={img1} className='inline-block object-cover mr-5 h-8 w-8 rounded-full ring-2 ring-white' alt="" />
                        }
                        
                        <h3>{service?.freelancer?.displayed_name}</h3>
                      </div>
                        
                        <p className="text-sm font-medium text-gray-900 ">{service?.price} $</p>
                      
                    </div>                 
                    <p className="mt-5 text-sm text-gray-500">
                        {service.title.length > 21
                          ?service?.title.substring(0, 80) + "..."
                          :service?.title
                        }  
                        </p>
                        <p>{service.description.length > 30? service.description.substring(0,40)+"..." :service.description}</p>
                  </div>
                </div>
              </Link>
            ))}
            </div>
           <nav className="mx-5 md:mx-0 flex my-8 rounded-md justify-center" aria-label="Pagination">
              <a
                href="#"
                onClick={() => paginate(currentPage - 1)}
                disabled={currentPage === 1}
                className={`relative inline-flex items-center rounded-full px-3 py-2 text-gray-400 ring-gray-300 ring-1 ring-inset mx-1 ${
                  currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-50'
                }`}
                style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
              >
                <span className=""><i className="bi bi-arrow-left"></i></span>
              </a>
              {Array.from({ length: Math.ceil(searchResults.length / servicesPerPage) }).map((_, index) => (
                <a
                  key={index + 1}
                  href="#"
                  className={`relative inline-flex items-center md:px-3 px-2 text-sm font-semibold ${
                    currentPage === index + 1
                      ? 'border-b-2 border-black text-black focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                      : 'text-gray-900 ring-gray-300 hover:bg-gray-50'
                  }`}
                  onClick={() => paginate(index + 1)}
                >
                  {index + 1}
                </a>
              ))}
              <a
                href="#"
                onClick={() => paginate(currentPage + 1)}
                className={`relative inline-flex items-center mx-1 rounded-full px-3 py-2 text-gray-400 ring-1 ring-inset ${
                  currentPage === Math.ceil(searchResults.length / servicesPerPage)
                    ? 'bg-gray-200 cursor-not-allowed'
                    : 'ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
                }`}
                style={{ pointerEvents: currentPage === Math.ceil(searchResults.length / servicesPerPage) ? 'none' : 'auto' }}
              >
                <span className=""><i className="bi bi-arrow-right"></i></span>
              </a>
            </nav>
          </>
        ) : (
          <>
          <p className=' flex justify-end'>{services.length} available Services</p>
          <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          
        {currentServices.map(service => (
          <Link key={service.id} className='bg-white rounded-lg ' to={`/service/${service.id}`}>
            <div key={service.id} className=" md:my-0 border sm:min-h-[300px] md:min-h-[300px] rounded-md border-gray-200 ">
              {/* Render the service details */}
              <div className="containerdiv w-full  overflow-hidden rounded-t-md bg-gray-200  h-56">
                <img
                  src={`http://localhost:8000${service?.image1}`}
                  alt={service.image1}
                  className="h-full w-full object-cover object-center md:h-full md:w-full"
                />
              </div>
              
              <div className='m-4 relative'>
                <p className='bg-[#86d2f4] absolute py-1 px-5 rounded-full font-semibold text-white text-xs top-[-35px]  z-10'> {service.category}</p>
                <div className=" flex justify-between">
                  
                  <div className='flex items-center'>
                    {
                      service.freelancer.user.photo ? 
                      <img src={`http://localhost:8000/storage/${service?.freelancer.user.photo}`} className='inline-block object-cover mr-5 h-8 w-8 rounded-full ring-2 ring-white' alt="" />
                      :
                      <img src={img1} className='inline-block mr-5 h-8 object-cover w-8 rounded-full ring-2 ring-white' alt="" />
                    }
                    
                    <h3 className='font-semibold text-sm'>{service?.freelancer.displayed_name}</h3>
                  </div>
                    
                    <p className="text-sm font-medium text-gray-900 ">{service.price} $</p>
                  
                </div>                 
                <p className="md:mt-5 mt-2 font-semibold text-sm text-gray-500">
                    {service.title.length > 21
                      ?service?.title.substring(0, 20) + "..."
                      :service?.title
                    }  
                    </p>
                    <p className='font-semibold mt-2'> {service.description.length > 30? service.description.substring(0,30)+"..." :service.description}</p>
              </div>
            </div>
          </Link>
        ))}
        </div>
          <nav className="mx-5 md:mx-0 flex my-8 rounded-md justify-center" aria-label="Pagination">
            <a
              href="#"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-full px-2.5 py-2 text-gray-400 ring-gray-300 ring-1 ring-inset mx-1 ${
                currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-50'
              }`}
              style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
            >
              <span className=""><i className="bi bi-arrow-left"></i></span>
            </a>
            {Array.from({ length: Math.ceil(services.length / servicesPerPage) }).map((_, index) => (
            <a
              key={index + 1}
              href="#"
              className={`relative inline-flex duration-300 transition-all items-center pb-1   text-sm font-semibold ${
                currentPage === index + 1
                  ? 'border-b-2 border-black text-black hover-underline-transparant focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  : 'text-gray-900 ring-gray-300 hover-underline-pagination hover:bg-gray-50'
              } lg:px-3 px-2`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </a>
          ))}
            <a
              href="#"
              onClick={() => paginate(currentPage + 1)}
              className={`relative inline-flex items-center mx-1  rounded-full px-2.5 py-2 text-gray-400 ring-1 ring-inset ${
                currentPage === Math.ceil(services.length / servicesPerPage)
                  ? 'bg-gray-200 cursor-not-allowed'
                  : 'ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              }`}
              style={{ pointerEvents: currentPage === Math.ceil(services.length / servicesPerPage) ? 'none' : 'auto' }}
            >
              <span className=""><i className="bi bi-arrow-right"></i></span>
            </a>
          </nav>
        </>
        )}
      </div>
    </div>
    </div>
  );
}
