import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaQuestionCircle, FaEdit, FaTimes, FaTimesCircle, FaCheck, FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import ItemOrderStatus from './orderstatus'; 
import ItemDecision from './RecievedOrder';
import FuelFormOrder from './fuelorder';
import FuelOrderApproved from './fuelOrderApproved';
import SearchableDropdown from './searchable'; // Import the custom dropdown component
import './makeRequist.css'; // Import CSS for styling

const LogisticRequestForm = () => {
  const [items, setItems] = useState([]);
  const [itemOptions, setItemOptions] = useState([]);
  const [date, setDate] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);

  const [activeComponent, setActiveComponent] = useState('form'); // State for switching between components

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentTab = sessionStorage.getItem('currentTab');

        if (!currentTab) {
          setError('No tab ID found in sessionStorage');
          return;
        }

        const token = sessionStorage.getItem(`token_${currentTab}`);
        if (!token) {
          setError('Token not found');
          return;
        }

        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Invalid token or unable to fetch profile data');
      }
    };

    const fetchItems = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/stocks');
        setItemOptions(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchUserProfile();
    fetchItems();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append('items', JSON.stringify(items));
    formData.append('date', date);
    formData.append('supplierName', supplierName);

    try {
      const response = await axios.post('http://localhost:5000/api/LogisticRequest/submit', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);

      setModalMessage('Requisition submitted successfully!');
      setIsSuccess(true); // Set the success state
      setShowModal(true); // Show the modal
    } catch (error) {
      setModalMessage('Failed submitting requisition');
      setIsSuccess(false); // Set the error state
      setShowModal(true); // Show the modal
    }
  };

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        itemId: '',
        itemName: '',
        quantityRequested: '',
        price: '',
        totalAmount: '',
      },
    ]);
  };

  const handleRemoveItem = (index) => {
    const updatedItems = [...items];
    updatedItems.splice(index, 1);
    setItems(updatedItems);
  };

  const handleItemChange = (index, key, value) => {
    const updatedItems = [...items];

    if (key === 'itemName') {
      const selectedItem = itemOptions.find(item => item.name === value);
      if (selectedItem) {
        updatedItems[index]['itemName'] = selectedItem.name;
        updatedItems[index]['itemId'] = selectedItem._id;
      }
    } else {
      updatedItems[index][key] = value;
    }

    if (key === 'quantityRequested' || key === 'price') {
      const quantityRequested = updatedItems[index].quantityRequested || 0;
      const price = updatedItems[index].price || 0;
      updatedItems[index].totalAmount = quantityRequested * price;
    }

    setItems(updatedItems);
  };

  // Handle component switching
  const handleFuelFormClick = () => setActiveComponent('form');
  const handleFuelOrderApprovedClick = () => setActiveComponent('approved');

  return (
    <div className="requistion">
      <div className="links">
      <button className='make-requisition' onClick={() => setActiveComponent('requisition')}>
          <i className="fas fa-edit"></i> Make Item Requisition
        </button>
        
        <button className='make-fuel-order' onClick={() => setActiveComponent('status')}>
          <i className="fas fa-edit"></i> Item Order Status
        </button>

        <button className='recieved-item' onClick={() => setActiveComponent('decision')}>
          <i className="fas fa-edit"></i> Item Order Decision
        </button>

        <button className='recieved-item' onClick={handleFuelFormClick}>
          <i className="fas fa-edit"></i> Make Fuel Order
        </button>

        <button className='recieved-item' onClick={handleFuelOrderApprovedClick}>
          <i className="fas fa-edit"></i> Fuel Order Status
        </button>
       
      </div>

      {activeComponent === 'status' ? (
        <ItemOrderStatus />
      ) : activeComponent === 'decision' ? (
        <ItemDecision />
      ) : activeComponent === 'form' ? (
        <FuelFormOrder />
      ) : activeComponent === 'approved' ? (
        <FuelOrderApproved />
      ) : (
        <div className="hod-request-form">
          <h2>Make Items Requisition</h2>
          <form onSubmit={handleSubmit}>
            <div className="imag-logo">
              <img src="/image/logo2.png" alt="Logo" className="log" />
            </div>
            <div className="heading-title">
              <div className="title"><h3>WESTERN PROVINCE</h3></div>
              <div className="title"><h3>DISTRICT NYABIHU</h3></div>
              <div className="title"><h3>SHYIRA DISTRICT HOSPITAL</h3></div>
              <div className="title"><h3>LOGISTIC OFFICE</h3></div>
              <div className="date-of-done">
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
            </div>
            <div className="requisition-title">
              <h2>REQUISITION FORM FROM LOGISTIC DEPARTMENT</h2>
              <p>Supplier Name:
                <input type="text" placeholder="Type names here..." value={supplierName} onChange={(e) => setSupplierName(e.target.value)} />
              </p>
            </div>
            <button type="button" className="Add-item-btn" onClick={handleAddItem}>Add Item</button>
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Item Name</th>
                  <th>Quantity Requested</th>
                  <th>Price</th>
                  <th>Total Amount</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>
                      <SearchableDropdown
                        options={itemOptions}
                        selectedValue={item.itemName}
                        onSelect={(value) => handleItemChange(index, 'itemName', value)}
                      />
                    </td>
                    <td>
                      <input type="number" value={item.quantityRequested} onChange={(e) => handleItemChange(index, 'quantityRequested', e.target.value)} required />
                    </td>
                    <td>
                      <input type="number" value={item.price} onChange={(e) => handleItemChange(index, 'price', e.target.value)} required />
                    </td>
                    <td>
                      <input type="number" value={item.totalAmount} readOnly />
                    </td>
                    <td>
                      <button type="button" className="remove-btn" onClick={() => handleRemoveItem(index)}>Remove</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className='sign'>
              <label htmlFor="hodName">Prepared By:</label>
              {user ? (
                <>
                  <p>{user.firstName} {user.lastName}</p>
                  {user.signature ? (
                    <img src={`http://localhost:5000/${user.signature}`} alt="Signature" />
                  ) : (
                    <p>No signature available</p>
                  )}
                </>
              ) : (
                <p>Loading user profile...</p>
              )}
            </div>

         
          <hr />
          <h4>SHYIRA DISTRICT HOSPITAL, WESTERN PROVINCE, NYABIHU DISTRICT</h4>
          <button className='Log-submit-btn' type="submit">Submit Request</button>
        </form>
      </div>
         
         )}

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

export default LogisticRequestForm;

