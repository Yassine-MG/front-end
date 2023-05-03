import React from 'react';
import './App.css';
import Navbar from './components/Navbar/navbar';
import { Routes,Route} from 'react-router-dom';
import Home from './pages/home';
import Create from './pages/register';
import Login from './pages/login';
// import ProtectedRoutes from './components/ProtectedRoutes/ProtectedRoute';
function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
 
  return (
    <div className="a">
      <Navbar></Navbar>
      <div className="container mx-auto">
          <Routes>
            <Route path='/' element={<Home/>}/>
            <Route path='/register' element={<Create/>}/>
            <Route path='/login'  element={<Login/>} />
            {/* <Route path='/login'  element={ isAuthenticated ?<Home/> : <Login/>} /> */}
          </Routes>  
      </div>
    </div>
  );
}

export default App;
