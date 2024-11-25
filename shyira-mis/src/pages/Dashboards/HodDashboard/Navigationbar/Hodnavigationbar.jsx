import React, { useState } from 'react';
import axios from 'axios';
import { FaHome, FaPlus, FaFileExcel, FaList, FaBoxOpen, FaClipboardCheck, 
  FaClipboardList, FaChartBar, FaUser, FaSignOutAlt,FaLifeRing ,FaGasPump } from 'react-icons/fa';
import './Hodnavigationbar.css';



const Navbar = ({ setCurrentPage }) => {
  const [dropdownsOpen, setDropdownsOpen] = useState({
    request: false,
    requisitions: false,
   
    requisitionsstatus:false,
    fuelrequisitionsstatus:false
  });

  const toggleDropdown = (dropdownName) => {
    setDropdownsOpen((prevState) => ({
      ...prevState,
      [dropdownName]: !prevState[dropdownName],
    }));
  };


  

  return (
    <div className="navigation">
    <div className="nav-logo">
      <h1>Lmis</h1>
      </div>
      <ul>
        <li onClick={() => setCurrentPage('overview')}>  <FaHome /> Overview</li>
        <li onClick={() => setCurrentPage('view-items')}> <FaList /> Available Items</li>
        
        
        <li onClick={() => setCurrentPage('requisition')}><FaBoxOpen /> Request Item</li>

        <li onClick={() => setCurrentPage('fuel-request')}><FaBoxOpen /> Request Fuel</li>
        <li onClick={() => setCurrentPage('fill-cardata')}><FaBoxOpen /> update Car Data</li>
      </ul>
      <u><h2>Settings</h2></u>
      <ul>
        <li onClick={() => setCurrentPage('user-profile')}><FaUser /> Profile</li>
        <li onClick={() => setCurrentPage('help-center')}> <FaLifeRing />Help Center</li>
      
      </ul>
    </div>
  );
};

export default Navbar;
