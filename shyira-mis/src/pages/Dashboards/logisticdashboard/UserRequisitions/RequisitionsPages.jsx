import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye , FaEdit,FaSpinner, FaTimes, FaTimesCircle, FaCheck, FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import VeiwUserRequisition from './ViewRequisition'; 
import ItemRequisitionRecieved from '../receivedRequisitions/itemRequestReceived';
import ItemRequisitionStatus from './RequisitionStatus';


const UserRequesition = () => {

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);


  const [activeComponent, setActiveComponent] = useState('form'); // State for switching between components

  return (
    <div className="requistion">
      <div className="links">
      <button className='view-requisition' onClick={() => setActiveComponent('view')}>
          <FaEye /> View Requisition
        </button>
        
        <button className='make-fuel-order' onClick={() => setActiveComponent('status')}>
          <FaSpinner color='brown'/> Item Requisition Status
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('recieved')}>
          <FaCheckCircle color='green'/> Item requisition Recieved
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('rejected')}>
          <FaTimesCircle color='red'/> Item requisition Rejected
        </button>
       
      </div>

      {activeComponent === 'view' ? (
        <VeiwUserRequisition />
      ) : activeComponent === 'recieved' ? (
        <ItemRequisitionRecieved />
      ) : activeComponent === 'status' ? (
        <ItemRequisitionStatus />
      ) :(
        <div>
    <p>Navigate to what you want to look.</p>
        </div>
      )}

    </div>
  );
};

export default UserRequesition;

