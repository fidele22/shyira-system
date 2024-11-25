import React, { useState, useEffect } from 'react';
import { FaUser , FaSignOutAlt, FaChevronDown } from 'react-icons/fa';
import './Navbar.css';
import axios from 'axios';

function Navbar({ setCurrentPage }) {
  const [user, setUser ] = useState({}); // Initialize user as an empty object
  const [userName, setUserName] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
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
          setUser (data); // Set the user state
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

    const handleOutsideClick = (event ) => {
      if (!event.target.closest('.user-dropdown')) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener('click', handleOutsideClick);

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
      sessionStorage.clear();
      window.location.href = '/';
      window.history.pushState(null, null, '/');
      window.onpopstate = () => {
        window.location.href = '/';
      };
    } catch (error) {
      console.error('Error during logout:', error);
      alert('Error while logging out');
    }
  };

  return (
    <div className='Navbar'>
      <ul className='navbar-menu'>
        <li className="user-dropdown" onClick={toggleDropdown}>
          {user ? (
            <>
              <img
                src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.firstName}&backgroundColor=E3F2FD`}
                alt={`${user.firstName} ${user.lastName}`}
                className="profile-avatar"
              />
              {userName} <FaChevronDown />
            </>
          ) : (
            <span>Loading...</span>
          )}
          {dropdownOpen && (
            <div className="dropdown-menu">
              <ul>
                <li onClick={() => setCurrentPage('user-profile')}>
                  <FaUser  /> Profile
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