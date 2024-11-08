import React, { useState } from 'react';
import Navigation from '../navbar/Navbar'
import Footer from '../footer/Footer'
import Navbar from './Navigationbar/Dafnavigationbar';
import Overview from './Overview';
import ViewUserRequest from './UserRequisitions/parentPage'
import RecieveduserRequest from '../logisticdashboard/receivedRequisitions/itemRequestReceived'
import ViewLogisticRequest from './requestOfLogistic/orderpages'
import RecievedLogisticOrder from '../logisticdashboard/OrderSupply/RecievedOrder'
import UserFuelRequest from './UserfuelRequest/userfuelrequestpage'
import LogisticFuelOrder from './LogisticFuelOrders/logisticFuelOrderPages'
import ViewItems from '../DGdashboard/StockItem/viewitems'
import DafProfile from '../UserProfile/profile'
import './DafDashboard.css';


const LogisticDashboard = () => {
  const [currentPage, setCurrentPage] = useState('overview');

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
     case 'user-item-request':
          return <ViewUserRequest />;
      case 'logistic-profile':
          return <DafProfile />;
      case 'recieved-requisition':
         return <RecieveduserRequest />
          case 'view-stock-items':
            return <ViewItems/>
      case 'recieved-logistic-order':
         return <RecievedLogisticOrder />
     case 'view-logistic-request':
          return <ViewLogisticRequest />
     case 'Fuel-logistic-Order':
          return <LogisticFuelOrder />     
     case 'user-fuel-request':
          return <UserFuelRequest />;
          
      default:
        return <Overview />;
    }
  };

  return (
    <div className="daf-dashboard">
      <Navigation />
      <Navbar setCurrentPage={setCurrentPage} />

      <div className="dafcontent">
        {renderContent()}
        <Footer />
      </div>
    </div>
  );
};

export default LogisticDashboard;
