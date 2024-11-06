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

  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout');
      
      // Clear session storage
      sessionStorage.clear();
      
      // Redirect to login page
      window.location.href = '/'; 
    
      // Clear browser history to prevent back navigation
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
    <div className="navigation">
      <h2>HOD Dashboard</h2>
      <ul>
        <li onClick={() => setCurrentPage('overview')}>  <FaHome /> Overview</li>
        <li onClick={() => setCurrentPage('view-items')}> <FaList /> Available Items</li>
        
        
        <li onClick={() => setCurrentPage('requisition')}><FaBoxOpen /> Request Item</li>

        <li onClick={() => setCurrentPage('fuel-request')}><FaBoxOpen /> Request Fuel</li>
      </ul>
      <u><h2>Settings</h2></u>
      <ul>
        <li onClick={() => setCurrentPage('user-profile')}><FaUser /> Profile</li>
        <li onClick={() => setCurrentPage('logistic-profil')}> <FaLifeRing />Help Center</li>
        <li onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
