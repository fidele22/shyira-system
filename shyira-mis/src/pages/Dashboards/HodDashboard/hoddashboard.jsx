import React, { useState } from 'react';
import Navigation from '../navbar/Navbar'
import Footer from '../footer/Footer'
import Navbar from './Navigationbar/Hodnavigationbar';
import Overview from './Overview';
import MakeRequest from './request/requisitionPages'
import FuelRequestPages from './fuelRequest/fuelRequisitionPages'
//import ViewFuelStatus  from './fuelRequest/viewApproved'
import RequestStatus from './requestStatus/requestStatus'
import Items from './items/viewItems'
import UserProfile from '../UserProfile/profile'
import './hodDashboard.css';
import Cardata from './cardata/cardata'
import HelpCenter from '../helpcenter/helpcenter';


const LogisticDashboard = () => {
  const [currentPage, setCurrentPage] = useState('overview');

  const renderContent = () => {
    switch (currentPage) {
      case 'overview':
        return <Overview />;
      case 'view-items':
        return<Items /> 
      case 'fuel-request':
        return<FuelRequestPages /> 
      case 'requisition-status':  
        return <RequestStatus />  
    
      case 'requisition':
          return <MakeRequest />;

      case 'fill-cardata':
         return <Cardata />    
      case 'user-profile':
          return <UserProfile />;
      case 'help-center':
          return <HelpCenter />
      default:
        return <Overview />;
    }
  };

  return (
    <div className="daf-dashboards">
      <Navigation />
      <div className="content-navbar">
      <Navbar setCurrentPage={setCurrentPage} />
      </div>
    

      <div className="dafcontent-page">
        <div className='dafcontents'>
        {renderContent()}
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default LogisticDashboard;
