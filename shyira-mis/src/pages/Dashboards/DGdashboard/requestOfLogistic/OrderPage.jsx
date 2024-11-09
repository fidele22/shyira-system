import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye , FaEdit,FaSpinner, FaTimes, FaTimesCircle, FaCheck, FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import VerifiedOrder from './viewLogisticRequest'; 
import ApprovedOrder from './approvedLogisticRequest';
import ReceivedOrder from '../../logisticdashboard/OrderSupply/RecievedOrder'
import RejecteditemOrder from '../../dafdashboard/requestOfLogistic/rejecteditemorder'
//import ItemRequisitionStatus from './RequisitionStatus';


const UserFuelRequesition = () => {

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);


  const [activeComponent, setActiveComponent] = useState('form'); // State for switching between components

  return (
    <div className="requistion">
      <div className="links">
      <button className='view-requisition' onClick={() => setActiveComponent('verifiedOrder')} >
          <FaEye /> Verified Order
        </button>
        
        <button className='make-fuel-order' onClick={() => setActiveComponent('approvedOrder')}>
          <FaSpinner color='brown'/> Approved Order
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('recieved-order')}>
          <FaCheckCircle color='green'/> Recieved Order
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('rejected-order')}>
          <FaTimesCircle color='red'/>  Rejected Order
        </button>
       
      </div>

      {activeComponent === 'verifiedOrder' ? (
        <VerifiedOrder />
      ) : activeComponent === 'approvedOrder' ? (
        <ApprovedOrder />
      )  : activeComponent === 'recieved-order' ? (
        <ReceivedOrder />
      )   : activeComponent === 'rejected-order' ? (
        <RejecteditemOrder />
      )  :(
        <div>
    <p>Navigate to what you want to look.</p>
        </div>
      )}

    </div>
  );
};

export default UserFuelRequesition;

