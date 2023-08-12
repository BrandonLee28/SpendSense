import React, { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import axios from 'axios'; // Import axios
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const navgiate = useNavigate();
    const [responseData, setResponseData] = useState({});
  useEffect(() => {
    const token = Cookies.get('token');
    
    axios({
      method: 'get',
      url: 'http://localhost:3000/home',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(response => {
        // Handle the response
        setResponseData(response.data)
        console.log('Response:', response.data);
      })
      .catch(error => {
        // Handle errors
        console.error('Error:', error);
        navgiate('/')
      });
  }, []); // Empty dependency array to ensure this effect runs only once

  return (
    <nav class="bg-white border-gray-200 dark:bg-gray-900">
        <div class="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl p-4">
            <a class="flex items-center">
                <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">Spend Sense</span>
            </a>
            <div class="flex items-center">
                <a class="mr-6 text-sm  text-gray-500 dark:text-white hover:underline">{responseData.email}</a>
                <a href="/logout" class="text-sm  text-blue-600 dark:text-blue-500 hover:underline">Logout</a>
            </div>
        </div>
    </nav>

  );
}

export default Home;
