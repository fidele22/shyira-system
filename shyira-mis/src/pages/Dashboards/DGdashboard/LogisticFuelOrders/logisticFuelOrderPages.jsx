import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye , FaEdit,FaSpinner, FaTimes, FaTimesCircle, FaCheck, FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import ViewFuelOrder from './fuelOrder'; 
import VerifiedFuelOrder from './verifiedFuelOrder';
import ApprovedFuelOrder from './approvedFuelOrder';
import RecievedFuelOrder from './recievedfuelorder';
import RejectedFuelOrder from './rejectedfuelorder';



const LogisticFuelOrder = () => {

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);


  const [activeComponent, setActiveComponent] = useState('form'); // State for switching between components

  return (
    <div className="requistion">
      <div className="links">
      <button className='view-requisition' onClick={() => setActiveComponent('viewFuelOrder')} >
          <FaEye /> View fuel Orders
        </button>
        
      <button className='view-requisition' onClick={() => setActiveComponent('verifiedFuelOrder')} >
          <FaEye /> Verified fuel Order
        </button>
        
        <button className='make-fuel-order' onClick={() => setActiveComponent('approvedFuelOrder')}>
          <FaSpinner color='brown'/> Approved fuel Order
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('recievedFuelorder')}>
          <FaCheckCircle color='green'/> Recieved fuel Order
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('rejectedFuelorder')}>
          <FaTimesCircle color='red'/>  Rejected fuel Order
        </button>
       
      </div>

      {activeComponent === 'viewFuelOrder' ? (
        <ViewFuelOrder />
      )  : activeComponent === 'verifiedFuelOrder' ? (
        <VerifiedFuelOrder />
      )  : activeComponent === 'approvedFuelOrder' ? (
        <ApprovedFuelOrder />

      )  : activeComponent === 'recievedFuelorder' ? (
        <RecievedFuelOrder />

      )  : activeComponent === 'rejectedFuelorder' ? (
        <RejectedFuelOrder />

      )   :(
        <div>
    <p>Navigate to what you want to look.</p>
        </div>
      )}

    </div>
  );
};

export default LogisticFuelOrder;

