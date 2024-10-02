import React, { useState } from 'react';
import { FaHome, FaPlus, FaFileExcel, FaList, FaBoxOpen, FaClipboardCheck, 
  FaClipboardList, FaChartBar, FaUser, FaSignOutAlt,FaLifeRing ,FaGasPump } from 'react-icons/fa';
import '../../logisticdashboard/Navigationbar/Navigationbar.css';
import axios from 'axios';

const Navbar = ({ setCurrentPage }) => {
  const [dropdownsOpen, setDropdownsOpen] = useState({
    request: false,
    requisitions: false,
    fuelrequest:false,
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
      <h2>DAF Dashboard</h2>
      <ul>
        <li onClick={() => setCurrentPage('overview')}><FaHome /> Overview</li>
        <li onClick={() => setCurrentPage('view-stock-items')}> <FaList /> stock Items</li>
        <li onClick={() => setCurrentPage('view-logistic-request')}><FaList /> Logistic Requisition </li>
        <li onClick={() => setCurrentPage('user-item-request')}><FaList /> User Item Requisition</li>  
        <li onClick={() => toggleDropdown('fuelrequest')} className="dropdown">
        <FaGasPump />  Fuel Requisition
          {dropdownsOpen.fuelrequest && (
            <ul className="dropdown-menu">
               <li onClick={() => setCurrentPage('logistic-fuel-request')}><FaList /> View logistic Request</li>
              <li onClick={() => setCurrentPage('view-fuel-request')}><FaList /> View verified Request</li>
              <li onClick={() => setCurrentPage('view-aproved')}><FaClipboardCheck/> Approved Request</li>
            </ul>
          )}
        </li>
      </ul>
      
      <u><h2>Settings</h2></u>
      <ul>
        <li onClick={() => setCurrentPage('logistic-profile')}>< FaUser /> Profile</li>
        <li onClick={() => setCurrentPage('help-center')}> <FaLifeRing />Help Center</li>
        <li onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
