import React, { useState } from 'react';
import './Navigationbar.css';
import axios from 'axios';
import { FaHome, FaPlus, FaFileExcel, FaList, FaBoxOpen, FaClipboardCheck,
   FaClipboardList, FaChartBar, FaUser, FaSignOutAlt,FaGasPump,FaLifeRing } from 'react-icons/fa';

const Navbar = ({ setCurrentPage }) => {
  const [dropdownsOpen, setDropdownsOpen] = useState({
    supplyOrder:false,
    requisitions: false,
    fuelrequisitions:false,
   
  });

  const toggleDropdown = (dropdownName) => {
    setDropdownsOpen((prevState) => ({
      ...prevState,
      [dropdownName]: !prevState[dropdownName],
    }));
  };

  const handleLogout = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logout`); // Notify the server of the logout
  
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
    <div className="navigation">
      <div className="nav-logo">
      <h1>Lmis</h1>
      </div>
     
      <ul>
        <li onClick={() => setCurrentPage('overview')}>
          <FaHome /> Overview
        </li>
        <li onClick={() => setCurrentPage('view-items')}> <FaList /> Item stock </li>
        <li onClick={() => setCurrentPage('make-order')}>
                <FaClipboardCheck /> Order Supplies
              </li>
       
        
        <li onClick={() => setCurrentPage('view-requisition')}>
          <FaClipboardCheck /> Item Requisition
        </li>
          
          <li onClick={() => setCurrentPage('fuel-requisition')}>
                <FaClipboardCheck /> Fuel Requisition
              </li>
          
       
        <li onClick={() => setCurrentPage('view-cars')}>
          <FaChartBar /> view cars data
        </li>
        <li onClick={() => setCurrentPage('fuel-stock')}>
                <FaPlus /> Fuel stock
              </li>
      
        <li onClick={() => setCurrentPage('report')}>
          <FaChartBar /> Item Report
        </li>
        <li onClick={() => setCurrentPage('fuel-report')}>
          <FaChartBar /> Fuel Report
        </li>
      </ul>

      <u><h2>Settings</h2></u>
      <ul>
        <li onClick={() => setCurrentPage('user-profile')}>
          <FaUser /> Profile
        </li>
        <li onClick={() => setCurrentPage('help-center')}> <FaLifeRing />Help Center</li>
     
      </ul>
    </div>
  );
};

export default Navbar;
