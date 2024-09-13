import React, { useState } from 'react';
import OrderApproved from './approvedOrder';
import OrderVerified from './Orderverified';
//import OrderMade from './'
import './orderstatus.css'

const ItemStockManager = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className='order-status'>
        <div className="verified-requisition">
        
        </div>

      <div className="approved-requisition">
        <OrderVerified />
      </div>

      <div className="approved-order">
        <OrderApproved />
      </div>
    </div>
    
  );
};

export default ItemStockManager;
