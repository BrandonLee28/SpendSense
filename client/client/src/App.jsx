import React from 'react'
import {BrowserRouter as Router,Routes,Route} from 'react-router-dom'
import Signup from './pages/Signup'
import Home from './pages/Home'
import axios from 'axios' 
import Logout from './pages/Logout'
import Login from './pages/Login'
const App = () => {
  axios.defaults.baseURL = 'http://localhost:3000';
  axios.defaults.withCredentials = true


  return (
    <Router>
      <Routes>
        <Route path="/" element={<Signup/>}></Route>
        <Route path="/home" element={<Home/>}></Route> 
        <Route path="/logout" element={<Logout/>}></Route> 
        <Route path="/login" element={<Login/>}></Route> 
      </Routes>
    </Router>
  )
}

export default App