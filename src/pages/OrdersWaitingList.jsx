import React, { useEffect, useState , useRef} from 'react';
import http from '../http';
import { Link } from 'react-router-dom';
import img1 from "../images/default.jfif";
import Cookies from 'js-cookie';
export default function OrdersWaitingList() {
    const [commands, setCommands] = useState([]);
    const [expandedRows, setExpandedRows] = useState([]);
    const [modalOpen, setModalOpen] = useState(false);
    const [modalImages, setModalImages] = useState([]);
    const [currentImage, setCurrentImage] = useState(0);
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedStatus, setSelectedStatus] = useState('');
    const [error, setError] = useState('');
    const token = Cookies.get("access_token");

    const handleDateChange = (event) => {
      setSelectedDate(event.target.value);
    };

    
    useEffect(() => {
      fetchCommands();
    }, []);
  
    const fetchCommands = async () => {
      try {
        const response = await http.get('/commands/of/freelancer', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });

        setCommands(response.data);
          
        console.log(response);
      } catch (error) {
        console.error('Error fetching commands:', error);
      }
    };

    const handleStatusChange = (event) => {
      setSelectedStatus(event.target.value);
    };


    const handleFormSubmit = async (event, command) => {
      event.preventDefault();

      if (selectedStatus === 'Accepte' && !selectedDate) {
        setError('Please select a delivery date.');
        return;
      }
  
      try {
        const response = await http.put(`/commands/delevery/date/${command.id}`, {
          delivery_date: selectedDate,
          status: selectedStatus,
        }, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        console.log(response.data);
        // Handle the response as needed
        window.location.reload();
      } catch (error) {
        console.error('Error updating command:', error);
        // Handle the error as needed
      }
    };


    const truncateDescription = (description) => {
      const words = description.split(' ');
      if (words.length > 3) {
        return words.slice(0, 3).join(' ') + '...';
      }
      return description;
    };



    const formatCreatedDate = (dateString) => {
      const options = { year: 'numeric', month: 'long', day: 'numeric' };
      return new Date(dateString).toLocaleDateString(undefined, options);
    };


    const getPictureUrls = (files) => {
      const fileList = JSON.parse(files);
      return fileList.map((file) => `http://localhost:8000${file}`);
    };

    const toggleRow = (commandId) => {
      if (expandedRows.includes(commandId)) {
        setExpandedRows(expandedRows.filter((id) => id !== commandId));
      } else {
        setExpandedRows([...expandedRows, commandId]);
      }
    };
  
    const isRowExpanded = (commandId) => {
      return expandedRows.includes(commandId);
    };
  
    const openModal = (files) => {
      const pictureUrls = getPictureUrls(files);
      setModalImages(pictureUrls);
      setCurrentImage(0);
      setModalOpen(true);
    };
  
    const handleImageChange = (direction) => {
      if (direction === 'prev' && currentImage > 0) {
        setCurrentImage(currentImage - 1);
      } else if (direction === 'next' && currentImage < modalImages.length - 1) {
        setCurrentImage(currentImage + 1);
      }
    };
  
    const closeModal = () => {
      setModalOpen(false);
    };

    const currentDate = new Date().toISOString().split('T')[0];

  return (
    <div className="flex mt-20 flex-col container mx-auto">
        <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
            <div className="overflow-hidden">
              <h1 className='text-center'>Waiting List</h1>
                <table className="min-w-full text-left text-sm font-light">
                <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                    <th scope="col" className="px-6 py-4">Custumer</th>
                    <th scope="col" className="px-6 py-4">Email of the customer</th>
                    <th scope="col" className="px-6 py-4">Picture</th>
                    <th scope="col" className="px-6 py-4">Project Name</th>
                    <th scope="col" className="px-6 py-4">Description</th>
                    <th scope="col" className="px-6 py-4">Created Date</th>
                    </tr>
                </thead>
                <tbody>
                {commands
                      .filter(
                        (command) =>
                          command.status !== 'Accepte' &&
                          command.status !== 'Refuse' &&
                          command.status !== 'Done'
                      ).map((command) => (
                  
                  <React.Fragment key={command.id}>
                    <tr
                      className="border-b transition duration-300 ease-in-out hover:bg-neutral-100 dark:border-neutral-500 dark:hover:bg-neutral-600"
                    >
                      <td className="whitespace-nowrap font-semibold px-6 py-4">
                        {command.user.name}
                      </td>
                      <td className="whitespace-nowrap font-semibold px-6 py-4">
                        {command.user.email}
                      </td>
                      <td className="whitespace-nowrap px-6 py-4">
                        {getPictureUrls(command.files).length > 0 && (
                            <button
                              className="focus:outline-none"
                              onClick={() => openModal(command.files)}
                            >
                              <img
                                className="h-12 hover:scale-125 transition-all duration-300 border rounded-lg w-12 cursor-pointer"
                                src={getPictureUrls(command.files)[0]}
                                alt={command.project_name}
                              />
                            </button>
                          )}
                            {/*  */}
                      </td>

                      <td className="whitespace-nowrap font-semibold px-6 py-4">
                        {command.project_name}
                      </td>
                      <td className="whitespace-nowrap font-semibold  px-6 py-4">
                        {truncateDescription(command.description)}
                      </td>
                      <td className="whitespace-nowrap font-semibold px-6 py-4">
                        {formatCreatedDate(command.created_at)}
                      </td>
                      <td className="whitespace-nowrap font-semibold px-6 py-4">
                        <button type='button'className={`transform ease-in-out duration-500 transition-transform ${isRowExpanded(command.id) ? 'rotate-180' : ''}`} onClick={() => toggleRow(command.id)}><i className="bi bi-chevron-down"></i></button>
                      
                      </td>
                    </tr>
                      <tr>
                        <td colSpan="6" className="">
                          <div className={`overflow-hidden transition-all ease-in-out duration-500 ${isRowExpanded(command.id) ? 'max-h-96' : 'max-h-0'}`}>
                            <div  className='flex my-5 items-center justify-between'>
                                <Link to={`/profile/${command.user.id}`} className='flex my-5 items-center'>
                                  {command.user.photo ? (
                                    <img
                                        className="inline-block mr-3 h-12 w-12 object-cover rounded-full ring-2 ring-white"
                                        src={`http://localhost:8000/storage/${command.user.photo}`}
                                        alt="profile picture"
                                    />
                                    ) : (
                                    <img
                                        src={img1}
                                        className="inline-block mr-3 h-12 w-12 rounded-full ring-2 ring-white"
                                        alt="default"
                                    />
                                    )}
                                    <div>
                                      <h1 className='font-semibold text-lg'>{command.user.name}</h1>
                                      <h1>{formatCreatedDate(command.created_at)}</h1>
                                    </div>
                                </Link>
                                <form className='flex justify-between ' onSubmit={(event) => handleFormSubmit(event, command)}>
                                  <input
                                      type="date"
                                      value={selectedDate}
                                      onChange={handleDateChange}
                                      min={currentDate}
                                      className={`px-4 py-2 border rounded-lg focus:outline-none focus:border-blue-500 ${selectedStatus !== 'Accepte' ? "hidden" : ""}`}
                                      disabled={selectedStatus !== 'Accepte'}
                                    />
                                  <select
                                        className='flex-shrink-0 mx-5 text-sm w-[160px]  inline-flex items-center py-3 px-2 justify-center font-medium text-center text-gray-900 bg-gray-100 border border-gray-300 rounded-lg hover:bg-gray-200 focus:ring-4 focus:outline-none focus:ring-gray-100 dark:bg-gray-700 dark:hover:bg-gray-600 dark:focus:ring-gray-700 dark:text-white dark:border-gray-600'
                                        name="status"
                                        id="sort"
                                        value={selectedStatus}
                                        onChange={handleStatusChange}
                                      >
                                        <option value="default">Statut</option>
                                        <option value="Accepte">Accepte</option>
                                        <option value="Refuse">Refuse</option>
                                </select>
                                <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                  Confirm
                                </button>
                              </form>
                            </div>
                            {selectedStatus === 'Accepte' && selectedDate === '' && (
                            <p className="text-red-500 font-semibold">Please select a delivery date.</p>
                          )}
                            <h1 className='font-semibold text-lg mb-3'>{command.project_name}</h1>
                            <p className=' text-base'>{command.description}</p>
                          </div>
                        </td>
                      </tr>
                  </React.Fragment>
                ))}
              </tbody>
                </table>
            </div>
            </div>
        </div>
        {modalOpen && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-gray-800 bg-opacity-75">
            <button
              className="absolute top-2 right-12 text-gray-500 hover:text-gray-700"
              onClick={closeModal}
            >
              <i className="bi bi-x-lg"></i>
            </button>
          <div className="bg-white relative p-2 rounded-lg">
          {modalImages.length > 1 && (
              <button
                className="absolute top-[50%] left-2 text-2xl bg-white rounded-full p-3 text-gray-500 hover:text-gray-700"
                onClick={() => handleImageChange('prev')}
                disabled={currentImage === 0}
              >
                <i className="bi bi-chevron-left"></i>
              </button>
            )}
            {modalImages.length > 1 && (
              <button
                className="absolute top-[50%] right-2 text-2xl bg-white rounded-full p-3 text-gray-500 hover:text-gray-700"
                onClick={() => handleImageChange('next')}
                disabled={currentImage === modalImages.length - 1}
              >
                <i className="bi bi-chevron-right"></i>
              </button>
            )}
            <img
            className="max-w-full max-h-[700px]"
            src={modalImages[currentImage]}
            alt="Modal"
          />
          </div>
        </div>
      )}
    </div>
  )
}
