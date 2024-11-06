import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye , FaEdit,FaSpinner, FaTimes, FaTimesCircle, FaCheck, FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import MakeRequistFuel from './fuelrequest'; 
import ViewfuelStatus from '../fuelRequestStatus/fuelrequeststatus';
import ReceivedDecision from '../fuelRequest/recievedFuelUserRequest';
import RejectedDecision from '../fuelRequest/rejectedFuelUserRequest';


//import ItemRequisitionStatus from './RequisitionStatus';


const UserFuelRequesition = () => {

  const [activeComponent, setActiveComponent] = useState('form'); // State for switching between components

  return (
    <div className="requistion">
      <div className="links">
      <button className='view-requisition' onClick={() => setActiveComponent('MakeRequisition')} >
          <FaEye /> Make Requisition for fuel
        </button>
        
        <button className='make-fuel-order' onClick={() => setActiveComponent('fuel-request-status')}>
          <FaSpinner color='brown'/> Fuel Requisition Status
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('recieved-requisition')}>
          <FaCheckCircle color='green'/> Recieved Fuel
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('rejected-requisition')}>
          <FaTimesCircle color='red'/>  Rejected Fuel
        </button>
       
      </div>

      {activeComponent === 'MakeRequisition' ? (
        <MakeRequistFuel />
      ) : activeComponent === 'fuel-request-status' ? (
        <ViewfuelStatus />
      )  : activeComponent === 'recieved-requisition' ? (
        <ReceivedDecision />
      )  : activeComponent === 'rejected-requisition' ? (
        <RejectedDecision />
      )  :(
        <div>
    <p>Navigate to what you want to look.</p>
        </div>
      )}

    </div>
  );
};

export default UserFuelRequesition;

