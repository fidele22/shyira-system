import React, { useState, useEffect } from 'react';
import { FaUser, FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import './Navbar.css';
import axios from 'axios';

function Navbar({ setCurrentPage }) {
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      const currentTab = sessionStorage.getItem('currentTab');
      if (!currentTab) {
        console.error('No tab ID found in sessionStorage');
        return;
      }

      const token = sessionStorage.getItem(`token_${currentTab}`);
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

        if (response.ok) {
          const data = await response.json();
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

    // Add event listener to close dropdown when clicked outside
    const handleOutsideClick = (event) => {
      if (!event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

    // Cleanup event listener on component unmount
    return () => {
      document.removeEventListener('click', handleOutsideClick);
    };
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`);
      localStorage.removeItem('authToken');
      window.location.href = '/'; // Redirect to login page
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className='Navbar'>
      <ul className='navbar-menu'>
        <li className="user-dropdown" onClick={toggleDropdown}>
          <FaUser /> {userName} <FaChevronDown />
          {dropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                <li onClick={() => setCurrentPage('user-profile')}>
                <FaUser />  Profile
                </li>
                <li onClick={handleLogout}>
                  <FaSignOutAlt /> Logout
                </li>
              </ul>
            </div>
          )}
        </li>
      </ul>
    </div>
  );
}

export default Navbar;
