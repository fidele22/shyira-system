import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaEdit, FaTimes,FaCheckCircle, FaTimesCircle,FaTrash,FaCheck } from 'react-icons/fa';
import axios from 'axios';

//import './ViewRequest.css'; // Import CSS for styling


const ForwardedRequests = () => {
  const [forwardedRequests, setForwardedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [logisticUsers, setLogisticUsers] = useState([]);

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);


  useEffect(() => {
    fetchForwardedRequests();
    fetchLogisticUsers(); // Fetch logistic users on component mount
  }, []);

  const fetchLogisticUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/logistic-users');
      setLogisticUsers(response.data);
    } catch (error) {
      console.error('Error fetching logistic users:', error);
    }
  };

  const fetchForwardedRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/LogisticRequest');
      setForwardedRequests(response.data);
    } catch (error) {
      console.error('Error fetching forwarded requests:', error);
    }
  };

  const handleRequestClick = (requestId) => {
    const request = forwardedRequests.find(req => req._id === requestId);
    setSelectedRequest(request);
    setFormData(request);
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(selectedRequest);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = [...formData.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [name]: value,
    };
    setFormData(prevState => ({
      ...prevState,
      items: updatedItems,
    }));
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/LogisticRequest/${selectedRequest._id}`, formData);
      setSelectedRequest(response.data);
      setIsEditing(false);
      setForwardedRequests(prevRequests =>
        prevRequests.map(req => (req._id === response.data._id ? response.data : req))
      );
    alert('requisition updated successful')
   
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

 //
 const handleVerifySubmit = async (e) => {
  e.preventDefault();
  try {
       // Forward the updated request to the approved collection
       const response = await axios.post(`http://localhost:5000/api/LogisticRequest/verified/${selectedRequest._id}`);
       setSelectedRequest(response.data);
    
       setModalMessage('logistic requestion verified successfully');
       setIsSuccess(true); // Set the success state
       setShowModal(true); // Show the modal
  } catch (error) {
    console.error('Error for approving request:', error);  
    setModalMessage('Failed to verify requisition');
    setIsSuccess(false); // Set the success state
    setShowModal(true); // Show the modal
  }
} 
  //fetching signature
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);


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



  if (!user) return <p>Loading...</p>;

  return (
    <div className={`verified-requist ${selectedRequest ? 'dim-background' : ''}`}>

      <div className="verified-request-navigation">
      <h2>Requisition from logistic office </h2>
        <ul>
          {forwardedRequests.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
          Requisition Form from <b>logistic</b> done on {new Date(request.date).toDateString()}
          {/*    <span>{!request.clicked ? 'New Request' : ''}</span> 
        */}
      </p>
            </li>
          ))}
        </ul>
      </div>
      {selectedRequest && (
        <div className="request-details-overlay">
          <div className="request-details">
            {isEditing ? (
              <form >
                <h2>Edit Request</h2>
                <div className="request-recieved-heading">
            <h1>WESTERN PROVINCE</h1>
            <h1>DISTRIC: NYABIHU</h1>
            <h1>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h1>
            <h1>DEPARTMENT:  LOGISTIC OFFICE</h1>

          </div>
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Item Name</th>
                      <th>Quantity Requested</th>
                      <th>Price</th> 
                      
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {formData.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>
                          <input
                            type="text"
                            name="itemName"
                            value={item.itemName}
                            onChange={(e) => handleItemChange(idx, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="quantityRequested"
                            value={item.quantityRequested}
                            onChange={(e) => handleItemChange(idx, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="price"
                            value={item.price}
                            onChange={(e) => handleItemChange(idx, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="totalAmount"
                            value={item.totalAmount}
                            onChange={(e) => handleItemChange(idx, e)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <button className='approve-request-btn' onClick={handleUpdateSubmit}>Update Request</button>
                <button type="button" className='cancel-btn' onClick={handleCancelClick}>Cancel</button>
              </form>
            ) : (
              <>
               <div className="form-navigation">
               <button className='verify-requisition' onClick={handleVerifySubmit}>Verify Request</button>
               <button className='edit-btn' onClick={handleEditClick}>Edit</button>
               <button></button>
             <label className='request-close-btn' onClick={() => setSelectedRequest(null)}><FaTimes /></label>
          </div>
            <div className="image-request-recieved">
          <img src="/image/logo2.png" alt="Logo" className="logo" />
          </div>
          <div className='date-done'>
            <label htmlFor="">{new Date(selectedRequest.date).toDateString()}</label>
            </div>
          <div className="request-recieved-heading">
            <h1>WESTERN PROVINCE</h1>
            <h1>DISTRIC: NYABIHU</h1>
            <h1>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h1>
            <h1>DEPARTMENT: LOGISTIC OFFICE </h1>

          </div>

            <h2>REQUISITON FORM OF LOGISTIC</h2>
              
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Item Name</th>
                      <th>Quantity Requested</th>
                      <th>Price</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{item.itemName}</td>
                        <td>{item.quantityRequested}</td>
                        <td>{item.price}</td>
                        <td>{item.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="daf-signature-section">
                  <div className='logistic-signature'>
                  <h3>Logistic Office:</h3>
                  <label htmlFor="">Prepared By:</label>
                    {logisticUsers.map(user => (
                      <div key={user._id} className="logistic-user">
                        <p>{user.firstName} {user.lastName}</p>
                        {user.signature ? (
                          <img src={`http://localhost:5000/${user.signature}`} alt={`${user.firstName} ${user.lastName} Signature`} />
                        ) : (
                          <p>No signature available</p>
                        )}
                      </div>
                    ))}
                  </div>
                 {/*<div className="daf-signature">
                    <h3>Daf signature:</h3>
                  <p>{us er.firstName} {user.lastName}</p>
                  {user.signature && <img src={`http://localhost:5000/${user.signature}`} alt="Signature" />}
                  </div>*/}
                  
                </div>
               
                


              </>
            )}
          </div>
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

export default ForwardedRequests;
