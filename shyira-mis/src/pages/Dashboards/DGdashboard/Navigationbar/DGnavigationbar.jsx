import React, { useState } from 'react';
import { FaHome, FaPlus, FaFileExcel,FaTrash , FaList, FaBoxOpen, FaClipboardCheck, 
  FaClipboardList, FaChartBar, FaUser, FaSignOutAlt,FaLifeRing ,FaGasPump } from 'react-icons/fa';
import '../../logisticdashboard/Navigationbar/Navigationbar.css';
import axios from 'axios';

const Navbar = ({ setCurrentPage }) => {
  const [dropdownsOpen, setDropdownsOpen] = useState({
    request: false,
    requisitions: false,
    fuelrequest:false,
    userRequest:false
  });

  const toggleDropdown = (dropdownName) => {
    setDropdownsOpen((prevState) => ({
      ...prevState,
      [dropdownName]: !prevState[dropdownName],
    }));
  };

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout');
      // Clear any user data from state or context
      // Redirect to login page or home page
      window.location.href = '/'; // Adjust as needed
    } catch (error) {
      alert('error to logout')
    }
  };

  return (
    <div className="navigation">
      <h2>Direct General</h2>
      <ul>
        <li onClick={() => setCurrentPage('overview')}><FaHome /> Overview</li>
        <li onClick={() => setCurrentPage('view-stock-items')}> <FaList /> stock Items</li>
        <li onClick={() => setCurrentPage('view-logistic-request')}><FaClipboardList /> Logistic Item requisition</li>
        <li onClick={() => setCurrentPage('fuel-logistic-request')}><FaGasPump /> Logistic Fuel requisition</li>
        <li onClick={() => setCurrentPage('repair-logistic-request')}><FaGasPump /> Logistic Repair requisition</li>
        <li onClick={() => setCurrentPage('user-request')}><FaBoxOpen /> User itemrequisition</li>

        <li onClick={() => setCurrentPage('fuel-requisition')}>
                <FaClipboardCheck /> User Fuel Requisition </li>
          
      </ul>
      
      <u><h2>Settings</h2></u>
      <ul>
        <li onClick={() => setCurrentPage('profile')}>< FaUser /> Profile</li>
        <li onClick={() => setCurrentPage('help-center')}> <FaLifeRing />Help Center</li>
        <li onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
