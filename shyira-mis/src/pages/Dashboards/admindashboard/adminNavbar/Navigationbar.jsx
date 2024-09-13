import React, { useState } from 'react';
import axios from 'axios';
import { FaHome, FaPlus, FaFileExcel, FaList, FaBoxOpen, FaClipboardCheck,
  FaClipboardList,FaBurn,FaPills, FaChartBar,FaAlignCenter, FaUser, FaSignOutAlt,
  FaGasPump,FaLifeRing,FaAngleDown } from 'react-icons/fa';
import './Navigationbar.css';


const Navbar = ({ setCurrentPage }) => {
  const [dropdownsOpen, setDropdownsOpen] = useState({
    usersAction: false,
 
  });

  const toggleDropdown = (dropdownName) => {
    setDropdownsOpen((prevState) => ({
      ...prevState,
      [dropdownName]: !prevState[dropdownName],
    }));
  };
  //handle logout
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout'); // Notify the server of the logout
  
      // Remove token from local storage or cookies
      localStorage.removeItem('authToken'); // Adjust based on how you store tokens
  
      // Optionally, redirect to login page
      window.location.href = '/'; // Adjust the URL as needed
    } catch (error) {
      console.error('Logout failed:', error);
      // Handle errors (e.g., show a message to the user)
    }
  };

  return (
    <div className="adminavbar">
      <h2>Admin Dashboard</h2>
      <ul>
        <li onClick={() => setCurrentPage('adminoverview')}><FaHome />Overview</li>
        <li onClick={() => setCurrentPage('view-Users')}><FaUser />USERS</li>
    
        <li onClick={() => setCurrentPage('user-roles')}><FaHome />User Roles</li>
        <li onClick={() => setCurrentPage('view-service')}><FaList /> SERVICES</li>
       
          <li onClick={() => setCurrentPage('view-position')}><  FaClipboardList /> POSITIONS</li>
          
          <li onClick={() => setCurrentPage('view-department')}><FaBurn /> DEPARTMENTS </li>
      
      </ul>
      <u><h2>Settings</h2></u>
      <ul>
        <li onClick={() => setCurrentPage('logistic-profile')}><FaUser />Profile</li>
        <li onClick={() => setCurrentPage('logistic-profile')}><FaLifeRing />Help Center</li>
        <li onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
