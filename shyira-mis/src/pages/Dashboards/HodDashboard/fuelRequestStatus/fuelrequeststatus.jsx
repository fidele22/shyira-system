import React, { useState } from 'react';
import RequisitionApproved from './fuelapprovedrequest';
import RequisitionVerified from './fuelverifiedrequest';
import RequistionsMade from './fuelrequestSent'

import './fuelstyling.css'
const RequestStatus = () => {


  return (
    <div className='user-fuel-status'>
        <div className="sent-requisition">
        <RequistionsMade />
        </div>

      <div className="verified-requisition">
        <RequisitionVerified />
      </div>

      <div className="approved-requisition">
        <RequisitionApproved />
      </div>
    </div>
    
  );
};

export default RequestStatus;
