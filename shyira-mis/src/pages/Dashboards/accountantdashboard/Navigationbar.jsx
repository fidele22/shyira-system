import React, { useState } from 'react';
import './contentCss/Navigationbar.css';
import axios from 'axios';

const Navbar = ({ setCurrentPage }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout');
      // Clear any user data from state or context
      // Redirect to login page or home page
      window.location.href = '/'; // Adjust as needed
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  return (
    <div className="navbar">
      <h2>Accountant Dashboard</h2>
      <ul>
        <li onClick={() => setCurrentPage('overview')}>Overview</li>
        <li onClick={toggleDropdown} className="dropdown">
          
         Requisitions
          {dropdownOpen && (
            <ul className="dropdown-menu">
              <li onClick={() => setCurrentPage('add-i')}>Make requisitions</li>
              <li onClick={() => setCurrentPage('view-items')}>Requisitions Made</li>
              <li onClick={() => setCurrentPage('view-items')}>Requisitions recieved</li>
            </ul>
          )}
        </li>
        <li onClick={() => setCurrentPage('order-supplies')}>Order Supplies</li>
        
      </ul>
      <u><h2>Settings</h2></u>
      <ul>
        <li onClick={() => setCurrentPage('accountant-profile')}>Profile</li>
        <li onClick={handleLogout}>Logout</li>
      </ul>
    </div>
  );
};

export default Navbar;
