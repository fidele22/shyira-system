import React, { useState } from 'react';
import RequisitionApproved from './approvedRequest';
import RequisitionVerified from './verifiedRequest';
import RequistionsMade from './requestSent'

import './styling.css'

const RequestStatus = () => {


  return (
    <div className='order-status'>
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
