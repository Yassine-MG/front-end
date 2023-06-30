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
  const servicesPerPage = 24; // Number of services to display per page
  const [selectedSort, setSelectedSort] = useState('default');
  const [selectedDeliveryTime, setSelectedDeliveryTime] = useState('');
  const location = useLocation();
  const searchResults = location.state?.services;
  const params = new URLSearchParams(location.search);
  let category = params.get('category');
  
  console.log('Category:', category);
 useEffect(() => {
  if (searchResults) {
    setServices(searchResults);
  }
}, [searchResults]);

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
            // console.log(response.data.services);
          })
          .catch(error => {
            console.log(error);
          });
      } else {
        setSuggestedServices([]);
      }
    }, 300); // Debounce time in milliseconds

    return () => clearTimeout(timer);
  }, [searchQuery]);

  useEffect(() => {
    handleSearch(); // Fetch services when selectedCategory changes
  }, [selectedCategory,selectedSort,selectedDeliveryTime , category] );


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
  
        if (selectedSort === 'lowest') {
          sortedServices = sortedServices.sort((a, b) => a.price - b.price);
        } else if (selectedSort === 'highest') {
          sortedServices = sortedServices.sort((a, b) => b.price - a.price);
        } else if (selectedSort === 'newest') {
          sortedServices = sortedServices.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else if (selectedSort === 'oldest') {
          sortedServices = sortedServices.sort((a, b) => new Date(a.created_at) - new Date(b.created_at));
        }
  
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

    // Get current services based on current page
    const indexOfLastService = currentPage * servicesPerPage;
    const indexOfFirstService = indexOfLastService - servicesPerPage;
    const currentServices = services.slice(indexOfFirstService, indexOfLastService);
  
    // Change page
    const paginate = (pageNumber) => {
      setCurrentPage(pageNumber);
    };

  return (
    <div className="bg-white flex justify-end ">
      <div className="mx-auto max-w-2xl px-4 py-16  sm:px-6 sm:py-24 lg:max-w-7xl lg:px-8">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900">Customers also purchased</h2>
        
      <form onSubmit={handleSearch} className='mt-8'> 
          <div className="flex">

          <div className="relative">
                    <button
                      id="dropdown-button"
                      className="flex-shrink-0 text-xs w-[160px] z-10 inline-flex items-center py-3 px-2 justify-center font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-l-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
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
                      <div className=" absolute z-10 mt-1 bg-white divide-y divide-gray-100 rounded-lg shadow w-full">
                        <ul className="py-2 text-sm text-gray-700">
                        <li>
                            <button
                              type="button"
                              className="inline-flex w-full text-xs px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => handleCategoryChange('All categories')}
                            >
                              All categories
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="inline-flex w-full text-xs px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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
                              className="inline-flex w-full text-xs px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => handleCategoryChange('Business')}
                            >
                              Business
                            </button>
                          </li>
                          <li>
                            <button
                              type="button"
                              className="inline-flex w-full text-xs px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => handleCategoryChange('Writing & Translation')}
                            >
                              Writing & Translation
                            </button>
                          </li>                   
                          <li>
                            <button
                              type="button"
                              className="inline-flex text-xs w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                              onClick={() => handleCategoryChange('Developer')}
                            >
                              Developer
                            </button>
                          </li>                    
                          <li>
                            <button
                              type="button"
                              className="inline-flex text-xs  w-full px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
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
                  <input autoComplete="off" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="search" id="search-dropdown" className=" outline-0 block p-2.5 w-full z-20 text-sm text-gray-900 bg-gray-50 rounded-r-lg border-l-gray-50 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-l-gray-700  dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:border-blue-500" placeholder="Search Mockups, Logos, Design Templates..." required></input>
                  <button type="submit" className="absolute top-0 right-0 p-2.5 text-sm font-medium text-white bg-blue-700 rounded-r-lg border border-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                      <svg aria-hidden="true" className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                      <span className="sr-only">Search</span>
                  </button>
              </div>
          </div>
          <div>
          <select
                    className='flex-shrink-0 mt-5 mr-5 text-sm w-[160px] z-10 inline-flex items-center py-3 px-2 justify-center font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600'
                    name="sort"
                    id="sort"
                    value={selectedSort}
                    onChange={e => setSelectedSort(e.target.value)}
                  >
                    <option value="default">Sort By</option>
                    <option value="lowest">Price Low to High</option>
                    <option value="highest">Price High to Low</option>
                    <option value="newest">Newest First</option>
                    <option value="oldest">Oldest First</option>
          </select>
          <select
            className="flex-shrink-0 mt-5 mr-5 text-sm w-[180px] z-10 inline-flex items-center py-3 px-2 justify-center font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600"
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
        <div className="mt-6  grid grid-cols-1  gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                    {/* Conditional rendering for ServicesFromHome */}
        {searchResults && searchResults.length > 0 ? (
          < >
            {searchResults.map(service => (
                <Link key={service.id} to={`/service/${service.id}`}>
                <div key={service.id} className="group md:my-0 border min-h-[420px] rounded-md border-gray-200 relative">
                  {/* Render the service details */}
                  <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
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
                          <img src={`http://localhost:8000/storage/${service?.freelancer?.user?.photo}`} className='inline-block mr-5 h-8 w-8 rounded-full ring-2 ring-white' alt="" />
                          :
                          <img src={img1} className='inline-block mr-5 h-8 w-8 rounded-full ring-2 ring-white' alt="" />
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
                        <p>{service.description.length > 30? service.description.substring(0,100)+"..." :service.description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </>
        ) : 
        
        currentServices.map(service => (
          <Link key={service.id} to={`/service/${service.id}`}>
            <div key={service.id} className="group md:my-0 border min-h-[420px] rounded-md border-gray-200 relative">
              {/* Render the service details */}
              <div className="aspect-h-1 aspect-w-1 w-full overflow-hidden rounded-t-md bg-gray-200 lg:aspect-none group-hover:opacity-75 lg:h-80">
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
                      service.freelancer.user.photo ? 
                      <img src={`http://localhost:8000/storage/${service?.freelancer.user.photo}`} className='inline-block mr-5 h-8 w-8 rounded-full ring-2 ring-white' alt="" />
                      :
                      <img src={img1} className='inline-block mr-5 h-8 w-8 rounded-full ring-2 ring-white' alt="" />
                    }
                    
                    <h3>{service?.freelancer.displayed_name}</h3>
                  </div>
                    
                    <p className="text-sm font-medium text-gray-900 ">{service.price} $</p>
                  
                </div>                 
                <p className="mt-5 text-sm text-gray-500">
                    {service.title.length > 21
                      ?service?.title.substring(0, 80) + "..."
                      :service?.title
                    }  
                    </p>
                    <p>{service.description.length > 30? service.description.substring(0,100)+"..." :service.description}</p>
              </div>
            </div>
          </Link>
        ))
        
        
        }          


          {}
        </div>
          <nav className="isolate flex -space-x-px my-8 rounded-md shadow-sm justify-center" aria-label="Pagination">
          <a
              href="#"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className={`relative inline-flex items-center rounded-l-md px-3 py-2 text-gray-400 ring-1 ring-inset ${
                currentPage === 1 ? 'bg-gray-200 cursor-not-allowed' : 'hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              }`}
              style={{ pointerEvents: currentPage === 1 ? 'none' : 'auto' }}
            >
              <span className=""><i className="bi bi-arrow-left"></i></span>
          </a>
          {Array.from({ length: Math.ceil(services.length / servicesPerPage) }).map((_, index) => (
            <a
              key={index + 1}
              href="#"
              className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold ${
                currentPage === index + 1
                  ? 'bg-indigo-600 text-white focus:z-20 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'
                  : 'text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
              }`}
              onClick={() => paginate(index + 1)}
            >
              {index + 1}
            </a>
          ))}
          <a
            href="#"
            onClick={() => paginate(currentPage + 1)}
            className={`relative inline-flex items-center rounded-r-md px-3 py-2 text-gray-400 ring-1 ring-inset ${
              currentPage === Math.ceil(services.length / servicesPerPage) ? 'bg-gray-200 cursor-not-allowed' : 'ring-gray-300 hover:bg-gray-50 focus:z-20 focus:outline-offset-0'
            }`}
            style={{ pointerEvents: currentPage === Math.ceil(services.length / servicesPerPage) ? 'none' : 'auto' }}
          >
            <span className="sr"><i className="bi bi-arrow-right"></i></span>
          </a>
        </nav>
      </div>
      
    </div>
  );
}
