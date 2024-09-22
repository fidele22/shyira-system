import React, { useState } from 'react';
import Navigation from '../navbar/Navbar'
import Footer from '../footer/Footer'
import Navbar from './Navigationbar/DGnavigationbar';
import Overview from './Overview';
import ViewRequest from './userRequisition/RequestVerified'
import ViewApproved from '../logisticdashboard/UserRequisitions/approvedRequest'
import ViewLogisticRequest from './requestOfLogistic/viewLogisticRequest'
import ViewFuelRequest from './fuelRequest/fuelRequisition'
import UserRequestStatus from './userRequisition/userRequestStatus'
import UserRequestRecieved from '../logisticdashboard/receivedRequisitions/itemRequestReceived'
import ViewItems from './StockItem/viewitems'
import Logisticrecieved from '../logisticdashboard/OrderSupply/RecievedOrder'
import DafProfile from './DafProfile'
//import OrderSupplies from './OrderSupplies';
import './DafDashboard.css';


const LogisticDashboard = () => {
  const [currentPage, setCurrentPage] = useState('overview');

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
     case 'view-request':
          return <ViewRequest />;
      case 'logistic-profile':
          return <DafProfile />;
      case 'view-stock-items':
          return <ViewItems/>
      case 'user-request-status':
         return <UserRequestStatus />

   case 'user-request-recieved':
    return <UserRequestRecieved />

      case 'logistic-recieved':
      return <Logisticrecieved/>
      case 'view-aproved':
        return <ViewApproved/>    
     case 'view-logistic-request':
          return <ViewLogisticRequest />
     case 'view-fuel-request':
          return <ViewFuelRequest />;
          
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
