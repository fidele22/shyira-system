import React, { useEffect, useState } from 'react';
import { FaEdit, FaTrash, FaTimes,FaEye } from 'react-icons/fa';
import Swal from 'sweetalert2';
import UploadNewItem from './uploadItems';
import AddNewItem from './addingitem';
import axios from 'axios';
import './stock.css';

const DataDisplay = ({ onItemSelect }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddItemForm, setShowAddItemForm] = useState(false); 
  const [showUploadItemForm, setShowUploadItemForm] = useState(false); 
  const [notification, setNotification] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; // Set the number of items per page

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stocks`);
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

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    const handleDelete = async (id) => {

      const { value: isConfirmed } = await Swal.fire({
  
        title: 'Are you sure?',
        text: "You won't be able to recover this item!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!', 
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
  
      });
  
    if (isConfirmed) {
      try {
        await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/stocks/${id}`);
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stocks`);
        setData(response.data);
        setNotification('Item deleted successfully!'); // Set notification message
        // Auto-remove notification after 3 seconds
        setTimeout(() => {
          setNotification('');
        }, 3000);
        Swal.fire(

          'Deleted!',
          'Your item has been deleted.',
          'success'

        );
      } catch (error) {
        console.error('Error deleting item:', error);
      }
    }
  };

  return (
    <div className='view-items'>
       {/* Notification Component */}
       {notification && (
   <div className="notification">
       {notification}
    </div>

)}
      <div className='add-item'>
        <button className='add-item-btn' onClick={() => setShowAddItemForm(true)}>Add new Item</button>
        <button className='upload-item-btn' onClick={() => setShowUploadItemForm(true)}>Upload New Items</button>
      </div>

      <h2>Item list and Stock Management</h2>
      <h3> Here are Items stored in stock with their updated balance</h3>
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
            <th>No</th>
            <th>Name</th>
            <th>Quantity</th>
            <th>Price per Unit</th>
            <th>Total Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {currentItems.map((item, index) => (
            <tr key={item._id}>
              <td>{indexOfFirstItem + index + 1}</td> {/* Display the index + 1 for serial number */}
              <td>{item.name}</td>
              <td>{item.quantity}</td>
              <td>{item.pricePerUnit}</td>
              <td>{item.totalAmount}</td>
              <td>
                <button className='stock-details-btn' onClick={() => onItemSelect(item)}><FaEye /> Item Details</button>
                <button className='delete-btn' onClick={() => handleDelete(item._id)}><FaTrash size={24} color='red'/></button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className=" pagination-controls">
        <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1}>
          Previous
        </button>
        <span>Page {currentPage} of {totalPages}</span>
        <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

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

      {/* Showing upload item form Overlay */}
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