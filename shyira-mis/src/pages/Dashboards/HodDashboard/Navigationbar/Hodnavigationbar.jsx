import React, { useState } from 'react';
import axios from 'axios';
import { FaHome, FaPlus, FaFileExcel, FaList, FaBoxOpen, FaClipboardCheck, 
  FaClipboardList, FaChartBar, FaUser, FaSignOutAlt,FaLifeRing ,FaGasPump } from 'react-icons/fa';
import './Hodnavigationbar.css';



const Navbar = ({ setCurrentPage }) => {
  const [dropdownsOpen, setDropdownsOpen] = useState({
    request: false,
    requisitions: false,
    fuelrequisitions:false,
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
        
        <li onClick={() => toggleDropdown('requisitions')} className="dropdown">
        <FaClipboardList /> Request Item
          {dropdownsOpen.requisitions && (
            <ul className="dropdown-menu">
              <li onClick={() => setCurrentPage('requisition')}><FaBoxOpen /> Make requisition</li>
              <li onClick={() => setCurrentPage('requisition-status')}><FaBoxOpen /> Requisition status</li>
            
            </ul>
          )}
        </li>
        <li onClick={() => toggleDropdown('fuelrequisitions')} className="dropdown">
        <FaGasPump /> Request Fuel
          {dropdownsOpen.fuelrequisitions && (
            <ul className="dropdown-menu">
             <li onClick={() => setCurrentPage('fuel-request')}><FaBoxOpen size={24} /> Make Request Fuel</li>
             <li onClick={() => setCurrentPage('repair-request')}><FaBoxOpen size={24} /> Make Request Repair</li>
             <li onClick={() => setCurrentPage('veiw-fuel-status')}><FaGasPump size={24} />View status</li>
            </ul>
          )}
        </li>
        <li onClick={() => toggleDropdown('requisitionsstatus')} className="dropdown">
        <FaGasPump /> Requisition Decision
          {dropdownsOpen.requisitionsstatus && (
            <ul className="dropdown-menu">
          <li onClick={() => setCurrentPage('recieved-request')}><FaClipboardList /> Received Requistion</li> 
             <li onClick={() => setCurrentPage('view-request-jected')}><FaGasPump size={24} />Rejected Requistion</li>
            </ul>
          )}
        </li>
        <li onClick={() => toggleDropdown('fuelrequisitionsstatus')} className="dropdown">
        <FaGasPump /> Fuel Requisition Decision
          {dropdownsOpen.fuelrequisitionsstatus && (
            <ul className="dropdown-menu">
          <li onClick={() => setCurrentPage('recieved-request')}><FaClipboardList /> Received Requistion</li> 
             <li onClick={() => setCurrentPage('view-request-jected')}><FaGasPump size={24} />Rejected Requistion</li>
            </ul>
          )}
        </li>
      </ul>
      <u><h2>Settings</h2></u>
      <ul>
        <li onClick={() => setCurrentPage('logistic-profile')}><FaUser /> Profile</li>
        <li onClick={() => setCurrentPage('logistic-profil')}> <FaLifeRing />Help Center</li>
        <li onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </li>
      </ul>
    </div>
  );
};

export default Navbar;
