import React, { useState } from 'react';
import Navbar from './Navigationbar';
import Overview from './Overview';
import ViewItem from './Viewitem'
import AddItem from './AddItem';
import AccountantProfile from './AccountantProfile'
import OrderSupplies from './OrderSupplies';


const LogisticDashboard = () => {
  const [currentPage, setCurrentPage] = useState('overview');

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
      case 'add-item':
        return <AddItem />;
      case 'view-items':
        return <ViewItem />;
      case 'order-supplies':
        return <OrderSupplies />;
      case 'logistic-profile':
          return <AccountantProfile />;
      default:
        return <Overview />;
    }
  };

  return (
    <div className="logistic-dashboard">
      <Navbar setCurrentPage={setCurrentPage} />
      <div className="content">
        {renderContent()}
      </div>
    </div>
  );
};

export default LogisticDashboard;
