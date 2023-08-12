import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function performLogout() {
      try {
        await axios.get('/logout');
        navigate('/');
      } catch (error) {
        console.error('Logout failed:', error);
        // Handle logout error here if needed
      }
    }

    performLogout();
  }, [navigate]);

  return <div></div>;
};

export default Logout;
