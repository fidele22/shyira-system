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

 

  return (
    <div className="navigation">
      <div className="nav-logo">
      <h1>Lmis</h1>
      </div>
      <ul>
        <li onClick={() => setCurrentPage('overview')}><FaHome /> Overview</li>
        <li onClick={() => setCurrentPage('view-stock-items')}> <FaList /> stock Items</li>
        <li onClick={() => setCurrentPage('view-logistic-request')}><FaBoxOpen /> Logistic Item Requisition </li>
        <li onClick={() => setCurrentPage('Fuel-logistic-Order')}><FaGasPump /> Logistic Fuel Requisition </li>
        <li onClick={() => setCurrentPage('Repair-logistic-Order')}><FaGasPump /> Logistic Repair Requisition </li>
        <li onClick={() => setCurrentPage('user-item-request')}><FaClipboardList /> User Item Requisition</li>  
        <li onClick={() => setCurrentPage('user-fuel-request')}><FaGasPump />  User Fuel Requisition</li>
     
      </ul>
      
      <u><h2>Settings</h2></u>
      <ul>
        <li onClick={() => setCurrentPage('user-profile')}>< FaUser /> Profile</li>
        <li onClick={() => setCurrentPage('help-center')}> <FaLifeRing />Help Center</li>
      
      </ul>
    </div>
  );
};

export default Navbar;
