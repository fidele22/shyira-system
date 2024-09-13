import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash,FaTimes } from 'react-icons/fa';
import UploadNewItem from './uploadItems'
import AddNewItem from './addingitem'
import axios from 'axios';
import './stock.css'

const DataDisplay = ({ onItemSelect }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddItemForm, setShowAddItemForm] = useState(false); 
  const [showUploadItemForm, setShowUploadItemForm] = useState(false);// State to show/hide Add User form

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stocks');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
 // Filter data based on search query
 const filteredData = data.filter(item =>
  item.name.toLowerCase().includes(searchQuery.toLowerCase())
);
const handleDelete = async (id) => {
  const isConfirmed = window.confirm("Are you sure you want to delete this item?");
  if (isConfirmed) {
    try {
      await axios.delete(`http://localhost:5000/api/stocks/${id}`);
      // Fetch updated data
      const response = await axios.get('http://localhost:5000/api/stocks');
      setData(response.data);
    } catch (error) {
      console.error('Error deleting item:', error);
    }
  }
}
return (
  <div className='view-items'>
      <div className='add-item'>
          <button className='add-item-btn' onClick={() => setShowAddItemForm(true)}>Add new Item</button>
          <button  className='upload-item-btn' onClick={() => setShowUploadItemForm(true)}>Upload New Items</button>
        
        </div>

    <h2>Item list and Stock Management</h2>
    <h3> Here are Items in stored in stock with its updated balance</h3>
       {/* Search input field */}
       <div className="search-item-input">
       <input
      type="text"
      placeholder="Search by name..."
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="search-input"
    />
       </div>
    

    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Quantity</th>
          <th>Price per Unit</th>
          <th>Total Amount</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {filteredData.map((item, index) => (
          <tr key={index}>
            <td>{item.name}</td>
            <td>{item.quantity}</td>
            <td>{item.pricePerUnit}</td>
            <td>{item.totalAmount}</td>
            <td>
              <button className='stock-details-btn' onClick={() => onItemSelect(item)}>View Stock Details</button>
              <button className='delete-btn' onClick={() => handleDelete(item._id)}><FaTrash size={24} color='red'/></button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
     {/* Add User Form Overlay */}
  {showAddItemForm && (
          <div className="add-overlay">
            <div className="add-user-form-container">
              <button className="close-form-btn" onClick={() => setShowAddItemForm(false)}>
                <FaTimes size={32} />
              </button>
              <AddNewItem /> {/* Add User Component */}
            </div>
          </div>
        )}
       {/* showing upload item form  Form Overlay */}  
  {showUploadItemForm && (
          <div className="add-overlay">
            <div className="add-user-form-container">
              <button className="close-form-btn" onClick={() => setShowUploadItemForm(false)}>
                <FaTimes size={32} />
              </button>
              <UploadNewItem /> {/* Add User Component */}
            </div>
          </div>
        )}
  </div>
);
};

export default DataDisplay;
