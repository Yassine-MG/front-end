import React from 'react';
import './App.css';
import Navbar from './components/Navbar/navbar';
import { Routes,Route} from 'react-router-dom';
import Home from './pages/home';
import Register from './pages/register';
import Login from './pages/login';
import Profile from './pages/profile';
import EditProfile from './pages/Editprofile';
import FreelancerRegistration from './pages/FreelancerRegistration';
function App() { 
  return (
    <div className="a">
      <Navbar></Navbar>
      <div className="container mx-auto">
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<Register/>}/>
            <Route path='/login'  element={<Login/>} />
            <Route path='/profile' element={<Profile/>}/>
            <Route path='/modif' element={<EditProfile/>}/>
            <Route path='/register/freelancers' element={<FreelancerRegistration/>}/> 
          </Routes>  
      </div>
    </div>
  );
}

export default App;
