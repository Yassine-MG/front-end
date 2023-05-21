import React , {useEffect,useState} from 'react';
import http from './http';
import {saveUserInSession,getUserFromSession} from './Helpers/functions';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import './App.css';
import Navbar from './components/Navbar/navbar';
import { Routes,Route} from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/login';
import Profile from './pages/profile';
import EditProfile from './pages/Editprofile';
import FreelancerRegistration from './pages/FreelancerRegistration';
import Error from './components/ProtectedRoutes/Error';
import OverviewForm from './pages/ServiceForm/OverviewForm';
import PriceFrom from './pages/ServiceForm/PriceFrom';
import FileForm from './pages/ServiceForm/FileForm';

function App() { 
  const [role, setRole] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate()
  const token = Cookies.get("access_token");
  const sessionUser = JSON.parse(sessionStorage.getItem("user"));
  
  const handleLogout = async () => {
    const token = Cookies.get('access_token');
        try {        
        await http.post('/logout',{headers: {"Authorization": `Bearer ${token}`}});
        Cookies.remove('access_token');
        navigate('/login');
        } catch (err) {
            console.log(err);
        }
    };
  useEffect(() => {
    if(sessionUser){
          const id = sessionUser.id;
          http.get(`/edit/${id}`,{headers: {"Authorization": `Bearer ${token}`}})
          .then((response) => {
              console.log(sessionUser.role);
              setUser(response.data.user)
              setRole(response.data.user.role)
            if(sessionUser.role){
              if(sessionUser.role != response.data.user.role){
                  saveUserInSession(response.data.user)
              } 
             }
          })
          .catch((error) => {
              console.log(error.message);
          });
    }else{
      const handleStorageChange = (event) => {
        if (event.storageArea === sessionStorage && !sessionStorage.getItem('user')) {
          handleLogout();
        }
      };
    
      const handleEventListener = () => {
        window.addEventListener('storage', handleStorageChange);
      };
    
      const handleRemoveEventListener = () => {
        window.removeEventListener('storage', handleStorageChange);
      };
    
      handleEventListener();
    
      return handleRemoveEventListener;
    }

    }, []);
  
  return (
    <div className="a">
      <Navbar></Navbar>
      <div className="container mx-auto">
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login'  element={<Login/>} />
            {
              document.cookie.match("access_token") && sessionUser && (
                <Route path='/profile' element={<Profile/>}/> 
              )
            } 
            <Route path='/modif' element={<EditProfile/>}/>
            {
            role !== 'freelancer' && (
              <Route path='/register/freelancers' element={<FreelancerRegistration/>}/> 
              )
            }
            <Route path='/error' element={<Error/>}/> 
            <Route path='/add/service/overview' element={<OverviewForm/>}/> 
            <Route path='/add/service/priceform' element={<PriceFrom/>}/> 
            <Route path='/add/service/fileform' element={<FileForm/>}/> 
          </Routes>  
      </div>
    </div>
  );
}

export default App;
