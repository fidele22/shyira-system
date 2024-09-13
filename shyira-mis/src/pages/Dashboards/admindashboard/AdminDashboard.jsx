import React, { useState } from 'react';
import Navbar from './adminNavbar/Navigationbar';
import Navigation from '../navbar/Navbar';
import Footer from '../footer/Footer';
import AdminOverview from './AdminOverview';
import ViewUser from './user/users'
import UserRole from './roles/AddRole'
import ViewS from './service/ViewServices'
import ViewP from './position/viewPosition'
import ViewD from './department/viewDepartment'

import './css/admin.css';

const LogisticDashboard = () => {
  const [currentPage, setCurrentPage] = useState('overview');

  const renderContent = () => {
    switch (currentPage) {


      case 'adminoverview':
        return <AdminOverview />;
      
      case 'view-Users':
        return <ViewUser />;
      case 'user-roles':
        return <UserRole />

      case 'view-service':
        return <ViewS />;
      case 'view-position':
        return <ViewP />;
      case 'view-department':
        return <ViewD />;

      default:
        return <AdminOverview />;
    }
  };

  return (
    <div className="admin-dashboard">
       <Navigation />
      <Navbar setCurrentPage={setCurrentPage} />
      <div className="Admincontent-page">
        <div className="Admincontent" >
        {renderContent()}
        </div>
       
        <Footer />
      </div>
    </div>
  );
};

export default LogisticDashboard;
