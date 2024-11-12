import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import { FaQuestionCircle, FaEdit, FaTimes, FaTimesCircle, FaCheck, FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import ItemOrderStatus from './orderstatus'; 
import ItemDecision from './RecievedOrder';
import FuelFormOrder from './fuelorder';
import FuelOrderApproved from './fuelOrderApproved';
import MakeRepairRequisition from '../repairRequisition/repairRequisition'
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

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
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
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stocks`);
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
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest/submit`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log(response.data);
    // Show success message using SweetAlert2
    Swal.fire ({
      title: 'Success!',
      text: 'Requisition submitted successfully!',
      icon: 'success',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'custom-swal', // Apply custom class to the popup
      }
    });
     
    } catch (error) {
      Swal.fire ({
        title: 'Error!',
        text: 'Failed submitting item requisition',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
       

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

        <button className='make-requisition' onClick={() => setActiveComponent('repair-requisition')}>
          <i className="fas fa-edit"></i> Make repair Requisition
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
      )  : activeComponent === 'repair-requisition' ? (
        <MakeRepairRequisition />
      ) : (
        <div className="requestion">
          <h3>Make Requisition for Items</h3>
          <label htmlFor="" >You have to make various requisitions for staff and accommodation materials</label>
         
         <div className='hod-request-form'>
          <form onSubmit={handleSubmit}>
            <div className="imag-logo">
              <img src="/image/logo2.png" alt="Logo" className="log" />
            </div>
            <div className="heading-title">
            <div className="date-of-done">
                <label htmlFor="date">Date:</label>
                <input type="date" id="date" value={date} onChange={(e) => setDate(e.target.value)} />
              </div>
              
              <div className="title"><h4>WESTERN PROVINCE</h4></div>
              <div className="title"><h4>DISTRICT NYABIHU</h4></div>
              <div className="title"><h4>SHYIRA DISTRICT HOSPITAL</h4></div>
              <div className="title"><h4>LOGISTIC OFFICE</h4></div>
             
            </div>
            <div className="requisition-title">
              <h4>REQUISITION FORM FROM LOGISTIC DEPARTMENT</h4>
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
            <div className='signature-section'>
              
              <div className='logistic-signature'>
              <label className='signature-title'>Logistic Office:</label>
              <label htmlFor="hodName">Prepared By:</label>
              {user ? (
                <>
                  <p>{user.firstName} {user.lastName}</p>
                  {user.signature ? (
                    <img src={`${process.env.REACT_APP_BACKEND_URL}/${user.signature}`} alt="Signature" 
                    className='signature-img' />
                  ) : (
                    <p>No signature available</p>
                  )}
                </>
              ) : (
                <p>Loading user profile...</p>
              )}
              </div>
            
            </div>

         
          <hr />
          <h4>SHYIRA DISTRICT HOSPITAL, WESTERN PROVINCE, NYABIHU DISTRICT</h4>
          <button className='Log-submit-btn' type="submit">Submit Request</button>
        </form>
      </div>
       </div>  
         )}

    </div>
  );
};

export default LogisticRequestForm;

