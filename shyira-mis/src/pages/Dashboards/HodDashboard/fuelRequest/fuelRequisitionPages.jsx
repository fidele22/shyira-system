import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye , FaEdit,FaSpinner, FaTimes, FaTimesCircle, FaCheck, FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import MakeRequistFuel from './fuelrequest'; 
import ViewApproved from './viewApproved';
import ReceivedDecision from '../requestDecision/recievedRequisition'
import RejectedDecision from '../requestDecision/rejectedRequisition'
//import ItemRequisitionStatus from './RequisitionStatus';


const UserFuelRequesition = () => {

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);


  const [activeComponent, setActiveComponent] = useState('form'); // State for switching between components

  return (
    <div className="requistion">
      <div className="links">
      <button className='view-requisition' onClick={() => setActiveComponent('MakeRequisition')} >
          <FaEye /> Make Requisition for fuel
        </button>
        
        <button className='make-fuel-order' onClick={() => setActiveComponent('approved-fuel')}>
          <FaSpinner color='brown'/> view Approved Requisition
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('recieved-requisition')}>
          <FaCheckCircle color='green'/> Recieved
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('rejected-requisition')}>
          <FaTimesCircle color='red'/>  Rejected
        </button>
       
      </div>

      {activeComponent === 'MakeRequisition' ? (
        <MakeRequistFuel />
      ) : activeComponent === 'approved-fuel' ? (
        <ViewApproved />
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

