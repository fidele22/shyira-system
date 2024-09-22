import React from 'react';
import axios from 'axios';
import { FaHome, FaUser, FaList, FaClipboardList, FaBurn, FaSignOutAlt } from 'react-icons/fa';
import './Navigationbar.css';

const Navbar = ({ setCurrentPage, isMenuOpen }) => {
  const handleLogout = async () => {
    try {
      await axios.post('http://localhost:5000/api/logout');
      localStorage.removeItem('authToken');
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  return (
    <div className={`adminavbar ${isMenuOpen ? 'open' : ''}`}>
      <h2>Admin Dashboard</h2>
      <ul>
        <li onClick={() => setCurrentPage('adminoverview')}><FaHome /> Overview</li>
        <li onClick={() => setCurrentPage('view-Users')}><FaUser /> Users</li>
        <li onClick={() => setCurrentPage('user-roles')}><FaHome /> User Roles</li>
        <li onClick={() => setCurrentPage('view-service')}><FaList /> Services</li>
        <li onClick={() => setCurrentPage('view-position')}><FaClipboardList /> Positions</li>
        <li onClick={() => setCurrentPage('view-department')}><FaBurn /> Departments</li>
      </ul>
      <h2>Settings</h2>
      <ul>
        <li onClick={() => setCurrentPage('logistic-profile')}><FaUser /> Profile</li>
        <li onClick={() => setCurrentPage('logistic-profile')}><FaBurn /> Help Center</li>
        <li onClick={handleLogout}><FaSignOutAlt /> Logout</li>
      </ul>
    </div>
  );
};

export default Navbar;
