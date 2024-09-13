import React, { useState } from 'react';
import DataDisplay from './ViewItems';
import StockDetails from './stockDetails';
import './stock.css'

const ItemStockManager = () => {
  const [selectedItem, setSelectedItem] = useState(null);

  const handleItemSelect = (item) => {
    setSelectedItem(item);
  };


  return (
    <div className='item-stock'>
      <DataDisplay onItemSelect={handleItemSelect} />
      {selectedItem && (
        <StockDetails item={selectedItem} onClose={() => setSelectedItem(null)} />
      )}
    </div>
    
  );
};

export default ItemStockManager;
