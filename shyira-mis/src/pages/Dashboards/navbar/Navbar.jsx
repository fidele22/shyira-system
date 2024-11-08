import React, { useState, useEffect } from 'react';
import { FaUser } from 'react-icons/fa';
import './Navbar.css';

function Navbar() {
  const [userName, setUserName] = useState('');

  useEffect(() => {
    const fetchUserData = async () => {
      // Get the current tab's ID from sessionStorage
      const currentTab = sessionStorage.getItem('currentTab');

      if (!currentTab) {
        console.error('No tab ID found in sessionStorage');
        return;
      }

      // Retrieve the token using the current tab ID
      const token = sessionStorage.getItem(`token_${currentTab}`);

      console.log('Token:', token); // Debug log to check if the token is correctly retrieved

      if (!token) {
        console.error('No token found for the current tab');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status); // Debug log

        if (response.ok) {
          const data = await response.json();
          console.log('User data:', data); // Debug log
          const fullName = `${data.firstName} ${data.lastName}`;
          setUserName(fullName);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    fetchUserData();
  }, []);

  return (
    <div className='Navbar'>
      <ul className='navbar-menu'>
        <h1> <FaUser /> {userName}</h1>
      </ul>
    </div>
  );
}

export default Navbar;
