import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { FaQuestionCircle, FaFileExcel,FaEdit,FaTimes, FaTimesCircle, FaCheck,
  FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import axios from 'axios';
import './additem.css'
const AddItem = () => {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pricePerUnit, setPricePerUnit] = useState('');
  const [totalAmount, setTotalAmount] = useState('');

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/stocks/add', {
        name,
        quantity,
        pricePerUnit,
        totalAmount,
      });
      console.log('Item added:', response.data);
    
      setModalMessage('Add new item in stock successful');
      setIsSuccess(true); // Set the success state
      setShowModal(true); // Show the modal
      // Clear form
      setName('');
      setQuantity('');
      setPricePerUnit('');
      setTotalAmount('');
    } catch (error) {
      console.error('Error adding item:', error);
      setModalMessage('Failed to Add new item in stock ');
      setIsSuccess(false); // Set the error state
      setShowModal(true); // Show the modal
    }


}; 
  return (
    <div className='add-new-item'>
      <div className="additem">
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Quantity:</label>
          <input
            type="number"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Price Per Unit:</label>
          <input
            type="number"
            value={pricePerUnit}
            onChange={(e) => setPricePerUnit(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Total Amount:</label>
          <input
            type="number"
            value={quantity*pricePerUnit}
           
          />
        </div>
        <button type="submit">Add Item</button>
      </form>
      </div>
    

            {/* Modal pop message on success or error message */}
            {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            {isSuccess ? (
              <div className="modal-success">
                <FaCheckCircle size={54} color="green" />
                <p>{modalMessage}</p>
              </div>
            ) : (
              <div className="modal-error">
                <FaTimesCircle size={54} color="red" />
                <p>{modalMessage}</p>
              </div>
            )}
            <button onClick={() => setShowModal(false)}>Close</button>
          </div>
        </div>
      )}

    </div>
  );
};

export default AddItem;
