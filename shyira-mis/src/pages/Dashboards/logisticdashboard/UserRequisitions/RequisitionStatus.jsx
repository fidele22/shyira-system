import React, { useState } from 'react';
//import VerifiedRequisition from './verifiedRequest';
import ApprovedRequisition from './approvedRequest'



const ItemRequisitionStatus = () => {


  return (
    <div className='item-stock'>
      {/** <div className="verified-requisition">
        <VerifiedRequisition />
        </div> */}
       
      <div className="approved-requisition">
        <ApprovedRequisition />
      </div>
      
    </div>
    
  );
};

export default ItemRequisitionStatus;
