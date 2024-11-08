import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaEye , FaEdit,FaSpinner, FaTimes, FaTimesCircle, FaCheck, FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import MakeRequisition from './MakeRequist'; 
import ViewStatus from '../requestStatus/requestStatus';
import ReceivedDecision from '../ItemrequestDecision/recievedRequisition';
import RejectedDecision from '../ItemrequestDecision/rejectedRequisition';
//import ItemRequisitionStatus from './RequisitionStatus';


const UserFuelRequesition = () => {

  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);


  const [activeComponent, setActiveComponent] = useState('form'); // State for switching between components

  return (
    <div className="requistion">
      <div className="links">
      <button className='view-requisition' onClick={() => setActiveComponent('MakeRequisition')} >
          <FaEye /> Make Requisition
        </button>
        
        <button className='make-fuel-order' onClick={() => setActiveComponent('status')}>
          <FaSpinner color='brown'/> view Requisition Status
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('recieved-requisition')}>
          <FaCheckCircle color='green'/> Recieved
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('rejected-requisition')}>
          <FaTimesCircle color='red'/>  Rejected
        </button>
       
      </div>

      {activeComponent === 'MakeRequisition' ? (
        <MakeRequisition />
      ) : activeComponent === 'status' ? (
        <ViewStatus />
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

