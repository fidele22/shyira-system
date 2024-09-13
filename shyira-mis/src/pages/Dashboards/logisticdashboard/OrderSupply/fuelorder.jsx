import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaQuestionCircle, FaEdit,FaTimes, FaTimesCircle, FaCheck,
  FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import SearchableDropdown from './searchable'
//import './makeRequist.css'; // Import CSS for styling

const LogisticRequestForm = () => {
  const [items, setItems] = useState([]);
  const [department, setDepartment] = useState('');
  const [supplierName, setSupplierName] = useState('');
  const [desitination, setDestination]  =useState ('') 
  const [quantityRequested, setQuantityRequested]  = useState ('') 
  const [pricePerUnit, setPrice]  = useState ('') 
  const [totalPrice, setTotalPrice]  = useState ('') 
  const [date, setDate] = useState('');
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);


  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);


  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the current tab's ID from sessionStorage
        const currentTab = sessionStorage.getItem('currentTab');

        if (!currentTab) {
          setError('No tab ID found in sessionStorage');
          return;
        }

        // Retrieve the token using the current tab ID
        const token = sessionStorage.getItem(`token_${currentTab}`);
        if (!token) {
          setError('Token not found');
          return;
        }

        // Use Axios to fetch user profile
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

    fetchUserProfile();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    const payload = {
      supplierName,
      items,  // Make sure to include items array here
      date,
      hodName: user ? `${user.firstName} ${user.lastName}` : '',
      hodSignature: user && user.signature ? user.signature : ''
    };
  
    try {
      const response = await axios.post('http://localhost:5000/api/logisticFuel/fuel-order', payload, {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      });
  
      console.log(response.data);
      setModalMessage('Submit requisition to logistic successfully');
      setIsSuccess(true);
      setShowModal(true);
   

    } catch (error) {
      console.error('Error submitting requisition:', error);
      setModalMessage('Failed to submit requisition');
      setIsSuccess(false);
      setShowModal(true);
    }
  };
  

  const handleAddItem = () => {
    setItems([
      ...items,
      {
        desitination:'',
        quantityRequested: '',
        pricePerUnit: '',
        totalPrice: '',
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
      // Find the selected item from the options
      const selectedItem = item => item.name === value;
      
      if (selectedItem) {
        updatedItems[index]['itemName'] = selectedItem.name;
        updatedItems[index]['itemId'] = selectedItem._id; // Store the itemId
      }
    } else {
      updatedItems[index][key] = value;
    }
  
    setItems(updatedItems);
  };
  

  
  const handleFileChange = (event, setFile) => {
    const file = event.target.files[0];
    setFile(file);
  };

  return (
    <div className="requistion">

      <div className="hod-request-form">
        <form onSubmit={handleSubmit}>
          <div className="image-logo">
            <img src="/image/logo.png" alt="Logo" className="logo" />
          </div>
          <div className="date-field">
              <label htmlFor="date">Date:</label>
              <input
                type="date"
                id="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>
          <div className="heading-title">
            <div className="title">
              <h3>WESTERN PROVINCE</h3>
            </div>
            <div className="title">
              <h3>DISTRICT: NYABIHU</h3>
            </div>
            <div className="title">
              <h3>SHYIRA DISTRICT HOSPITAL</h3>
            </div>
            <div className="title">
              <h3>LOGISTIC OFFICE</h3>
            </div>
            <div className="title">
              <h3>SUPPLIER NAME :</h3>
              <input
                type="text"
                value={supplierName}
                onChange={(e) => setSupplierName(e.target.value)}
                placeholder="Type here .........."
                required
              />
            </div>
           
          </div>

          <h2>REQUISITION FORM FROM LOGISTIC DEPARTMENT  FOR FUEL</h2>
          <button className='additem-btn' type="button" onClick={handleAddItem}>Add Item</button>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>desitination</th>
                <th>Quantity Requested(liters)</th>
                <th>Price Per Liter</th>
                <th>Price Total</th>
                 <th>Action</th>
              </tr>
            </thead>
            <tbody>
            {items.map((item, index) => (
                <tr key={index}>
                  <td>{index + 1}</td>
                  <td className='itemname-td'>
                  <input
                      type="text"
                      value={item.desitination}
                      onChange={(e) => handleItemChange(index, 'desitination', e.target.value)}
                      required
                    />
                    
                  </td>
                 
                  <td>
                    <input
                      type="number"
                      value={item.quantityRequested}
                      onChange={(e) => handleItemChange(index, 'quantityRequested', e.target.value)}
                      required
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.pricePerUnit}
                      onChange={(e) => handleItemChange(index, 'pricePerUnit', e.target.value)}
                    
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={item.quantityRequested*item.pricePerUnit}
                   
                    />
                  </td>
                  <td>
                    <button className='remove-btn' type="button" onClick={() => handleRemoveItem(index)}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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

         

          <button className='hod-submit-btn' type="submit">Send Request</button>
        </form>
      </div>
    </div>
  );
};

export default LogisticRequestForm;
