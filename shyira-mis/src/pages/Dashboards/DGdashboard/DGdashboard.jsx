import React, { useState } from 'react';
import Navigation from '../navbar/Navbar'
import Footer from '../footer/Footer'
import Navbar from './Navigationbar/DGnavigationbar';
import Overview from './Overview';
import ViewRequest from './userRequisition/RequestVerified'
import ViewApproved from '../logisticdashboard/UserRequisitions/approvedRequest'
import ViewLogisticRequest from './requestOfLogistic/OrderPage'
import FuelRequisition from './fuelRequisition/fuelRequisitionPages'
import UserRequestpage from './userRequisition/userPage'
import UserRequestRecieved from '../logisticdashboard/receivedRequisitions/itemRequestReceived'
import ViewItems from './StockItem/viewitems'
import Logisticrecieved from '../logisticdashboard/OrderSupply/RecievedOrder'
import FuelLogisticRequest from './LogisticFuelOrders/logisticFuelOrderPages'
import DafProfile from '../UserProfile/profile'
import HelpCenter from '../helpcenter/helpcenter'
import './DafDashboard.css';


const Dashboard = () => {
  const [currentPage, setCurrentPage] = useState('overview');

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
     case 'view-request':
          return <ViewRequest />;
   
      case 'view-stock-items':
          return <ViewItems/>
      case 'user-request':
         return <UserRequestpage />

      case 'user-request-recieved':
         return <UserRequestRecieved />

      case 'logistic-recieved':
         return <Logisticrecieved/>
      case 'view-aproved':
        return <ViewApproved/>    
      case 'view-logistic-request':
          return <ViewLogisticRequest />
      case 'fuel-logistic-request':
          return <FuelLogisticRequest />    
      case 'fuel-requisition':
          return <FuelRequisition />;
      case 'profile':
          return <DafProfile />;  
      case 'help-center':
          return <HelpCenter />;

      default:
        return <Overview />;
    }
  };

  return (
    <div className="dg-dashboard">
      <Navigation />
      <Navbar setCurrentPage={setCurrentPage} />
      <div className="dg-content-page">
      <div className="dgcontent">
        {renderContent()}
      </div>
      <Footer />
      </div>
    </div>
  );
};

export default Dashboard;
