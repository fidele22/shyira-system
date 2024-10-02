import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye , FaEdit,FaSpinner, FaTimes, FaTimesCircle, FaCheck, FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import ViewVerifiedRequisition from './ViewRequisition'; 
import ApprovedRequisition from './ApproveRequisition';
import RecievedRequisition from '../../logisticdashboard/receivedRequisitions/itemRequestReceived';
import ReceivedOrder from '../../logisticdashboard/OrderSupply/RecievedOrder';
//import RejectedOrder from '../requestDecision/rejectedRequisition'
//import ItemRequisitionStatus from './RequisitionStatus';


const UserRequisitionItem = () => {

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);


  const [activeComponent, setActiveComponent] = useState('form'); // State for switching between components

  return (
    <div className="requistion">
      <div className="links">
      <button className='view-requisition' onClick={() => setActiveComponent('VerifiedItemRequisition')} >
          <FaEye /> Verified requisition
        </button>
        
        <button className='make-fuel-order' onClick={() => setActiveComponent('approvedItemRequisition')}>
          <FaSpinner color='brown'/> Approved requisition
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('recieved-Requisition')}>
          <FaCheckCircle color='green'/> Recieved requisition
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('rejected-order')}>
          <FaTimesCircle color='red'/>  Rejected requisition
        </button>
       
      </div>

      {activeComponent === 'VerifiedItemRequisition' ? (
        <ViewVerifiedRequisition />
      )  : activeComponent === 'approvedItemRequisition' ? (
        <ApprovedRequisition />
      )  : activeComponent === 'recieved-Requisition' ? (
        <RecievedRequisition />
      )  : activeComponent === 'recieved-order' ? (
        <ReceivedOrder />
      )  :(
        <div>
      <p>Navigate to what you want to look.</p>
        </div>
      )}

    </div>
  );
};

export default UserRequisitionItem;

