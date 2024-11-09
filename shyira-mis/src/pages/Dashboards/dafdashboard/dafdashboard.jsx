import React, { useState } from 'react';
import { FaHome, FaUser , FaList, FaClipboardList, FaBurn, FaSignOutAlt, FaBars, FaTimes } from 'react-icons/fa';
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
import HelpCenter from '../helpcenter/helpcenter';


const LogisticDashboard = () => {
  const [currentPage, setCurrentPage] = useState('overview');

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

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
      case 'help-center':
        return <HelpCenter />    
      default:
        return <Overview />;
    }
  };

  return (
    <div className={`admin-dashboard ${isMenuOpen ? 'open' : ''}`}>
    <div>
      <Navigation />
      <div className="menu-toggle" onClick={handleMenuToggle}>
        {isMenuOpen ? <FaTimes /> : <FaBars />}
      </div>
    </div>

    <Navbar setCurrentPage={setCurrentPage} isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
    
    <div className="Admincontent-page">
      <div className="Admincontent">
        {renderContent()}
     
      </div>
      <Footer />
    </div>
  
  </div>
  );
};

export default LogisticDashboard;
