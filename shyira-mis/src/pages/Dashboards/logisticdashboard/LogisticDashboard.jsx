import React, { useState } from 'react';
import Navigation from '../navbar/Navbar'
import Navbar from './Navigationbar/Navigationbar';
import Footer from '../footer/Footer'
import Overview from './Overview';
import ViewItem from './addItem/parentStock'
import AddItem from './addItem/addingitem';
import MakeRequist from './OrderSupply/MakeRequist'
import FuelOrder from './OrderSupply/fuelorder'
import OrderStatus from './OrderSupply/orderstatus'
import ReceivedOrder from './OrderSupply/RecievedOrder'
import ViewCars from './fuelRequisition/viewcars'
import LogisticProfile from './LogisticProfile'
import StockReport from './StockReport/ItemReport';
import ViewRequisition from './UserRequisitions/RequisitionsPages';
import ViewFuelRequest from './fuelRequisition/fuelRequisitionPages'
import FuelStock from './fuelRequisition/fuelStock'
import FuelReport from './StockReport/FuelReport'
//import ApprovedRequests from './Requests/approvedRequest';
import RequisitionReceive from './receivedRequisitions/itemRequestReceived';
import './contentCss/LogisticDashboard.css';

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
      case 'report':
        return <StockReport />;

      case 'fuel-report':
        return <FuelReport />  
      case 'fuel-stock':
        return <FuelStock />
      case 'make-order':
        return <MakeRequist />;
      case 'order-status':
          return <OrderStatus />;

      case 'received-order':
        return <ReceivedOrder />;
      case 'make-fuel-order':
        return <FuelOrder />   
     
      case 'fuel-requisition':
        return <ViewFuelRequest />;
     
      case 'view-cars':
        return <ViewCars />     
     
     
      case 'logistic-profile':
        return <LogisticProfile />;
      case 'view-requisition':
        return <ViewRequisition />;

      //case 'requisition-receive':
      //  return <RequisitionReceive />;
      //  
      default:
        return <Overview />;
    }
  };

  return (
    <div className="logistic-dashboard">
      <Navigation />
      <Navbar setCurrentPage={setCurrentPage} />
      
      <div className="logisticcontent">
        {renderContent()}
        <Footer />
      </div>
    </div>
  );
};

export default LogisticDashboard;
