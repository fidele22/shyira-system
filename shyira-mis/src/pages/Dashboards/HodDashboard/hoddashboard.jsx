import React, { useState } from 'react';
import Navigation from '../navbar/Navbar'
import Footer from '../footer/Footer'
import Navbar from './Navigationbar/Hodnavigationbar';
import Overview from './Overview';
import UserRequestRecieved from './requestDecision/recievedRequisition'
import RejectedRequest from './requestDecision/rejectedRequisition'
import MakeRequest from './request/requisitionPages'
import FuelRequestPages from './fuelRequest/fuelRequisitionPages'
import RepairRequest from './repairRequest/repairRequest'
import ViewFuelStatus  from './fuelRequest/viewApproved'
import RequestStatus from './requestStatus/requestStatus'

//import ViewFuelRequest from './fuelRequest/viewfuelRequest'
import Items from './items/viewItems'
import UserProfile from '../UserProfile/profile'
import './hodDashboard.css';
import ViewItems from './request/ViewItems';


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
     

      case 'recieved-request':
        return<UserRequestRecieved />

      case 'requisition-status':  
        return <RequestStatus />  
      case 'veiw-fuel-status':
        return <ViewFuelStatus />
      case 'requisition':
          return <MakeRequest />;
      case 'repair-request':
        return <RepairRequest />    
  
      case 'view-request-jected':
        return <RejectedRequest/>  

      case 'user-profile':
          return <UserProfile />;

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
