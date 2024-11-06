import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye , FaEdit,FaSpinner, FaTimes, FaTimesCircle, FaCheck, FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import ViewUserRequistFuel from './fuelRequisitionverified'; 
import ApprovedUserFuelRequest from './approvedUserFuelRequest';
import RejectedUserFuelRequest from './rejecteduserfuelrequest'
import RecievedUserFuelRequest from './recieveduserfuelRequest'


const UserFuelRequesition = () => {

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [activeComponent, setActiveComponent] = useState('form'); // State for switching between components

  return (
    <div className="requistion">
      <div className="links">
      <button className='view-requisition' onClick={() => setActiveComponent('MakeRequisition')} >
          <FaEye /> View user fuel request
        </button>
        
        <button className='make-fuel-order' onClick={() => setActiveComponent('fuel-request-status')}>
          <FaSpinner color='brown'/> Approved user fuel request
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('received-fuel-requisition')}>
          <FaCheckCircle color='green'/> Recieved Fuel Request
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('rejected-fuel-requisition')}>
          <FaTimesCircle color='red'/>  Rejected Fuel request
        </button>
      </div>

      {activeComponent === 'MakeRequisition' ? (
        <ViewUserRequistFuel />
      ) : activeComponent === 'fuel-request-status' ? (
        <ApprovedUserFuelRequest />
      ) : activeComponent === 'received-fuel-requisition' ? (
        <RecievedUserFuelRequest />
      ) : activeComponent === 'rejected-fuel-requisition' ? (
        <RejectedUserFuelRequest />
      )     
       :(
        <div>
    <p>Navigate to what you want to look.</p>
        </div>
      )}

    </div>
  );
};

export default UserFuelRequesition;

