import React, { useState } from 'react';
import VerifiedRequisition from './';
import StockDetails from './stockDetails';
import './stock.css'

const ItemStockManager = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  return (
    <div className='item-stock'>
        <div className="verified-requisition">
        <VerifiedRequisition />
        </div>
      <div className="approved-requisition">
        <ApprovedRequisition />
      </div>
      
    </div>
    
  );
};

export default ItemStockManager;
