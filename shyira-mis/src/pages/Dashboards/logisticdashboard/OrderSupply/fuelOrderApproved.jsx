import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaEdit, FaTimes, FaCheckCircle, FaTimesCircle, FaTrash, FaCheck } from 'react-icons/fa';
import axios from 'axios';

// Import CSS for styling
// import './ViewRequest.css';

const ForwardedRequests = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [logisticUsers, setLogisticUsers] = useState([]);
  const [dafUsers, setDafUsers] = useState([]);
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    fetchApprovedRequests();
    fetchLogisticUsers();
    fetchDafUsers(); 
    fetchUserProfile(); // Fetch user profile on component mount
  }, []);

  const fetchLogisticUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/logistic-users`);
      setLogisticUsers(response.data);
    } catch (error) {
      console.error('Error fetching logistic users:', error);
    }
  };

  const fetchDafUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/daf-users`);
      setDafUsers(response.data);
    } catch (error) {
      console.error('Error fetching daf users:', error);
    }
  };

  const fetchApprovedRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/logisticFuel/fuel-order`);
      console.log('Fetched approved requests:', response.data); // Log response data
      setApprovedRequests(response.data);
    } catch (error) {
      console.error('Error fetching forwarded requests:', error);
    }
  };

  const handleRequestClick = (requestId) => {
    const request = approvedRequests.find(req => req._id === requestId);
    setSelectedRequest(request);
  };

  const handleReceivedClick = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logisticFuel/recieved-fuel/${selectedRequest._id}`);
      setModalMessage('Sign reception of Fuel order and update fuel stock successful');
      setIsSuccess(true);
      setShowModal(true);
      // Refresh the list
      fetchApprovedRequests();
    } catch (error) {
      console.error('Error for approving request:', error);
      setModalMessage('Failed to sign reception order');
      setIsSuccess(false);
      setShowModal(true);
    }
  };

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

  if (!user) return <p>Loading...</p>;

  return (
    <div className={`verified-requist ${selectedRequest ? 'dim-background' : ''}`}>
      <div className="request-navigation">
        <h2>Your requisition for fuel order</h2>
        <ul>
          {approvedRequests && approvedRequests.length > 0 ? (
            approvedRequests.slice().reverse().map((request, index) => (
              <li key={index}>
                <p onClick={() => handleRequestClick(request._id)}>
                  Requisition Form from <b>logistic office</b> order of FUEL done on {new Date(request.createdAt).toDateString()}
                </p>
                <label htmlFor=""><FaCheckCircle /> Approved</label>
              </li>
            ))
          ) : (
            <p>No approved requests available.</p>
          )}
        </ul>
      </div>
      {selectedRequest && (
        <div className="request-details-overlay">
          <div className="request-details">
            <div className="form-navigation">
              <button className='mark-received-btn' onClick={handleReceivedClick}>Mark as Received</button>
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
              <h1>SUPPLIER NAME: {selectedRequest.supplierName}</h1>
            </div>

            <h2>REQUISITION FORM OF LOGISTIC FOR FUEL</h2>

            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Destination</th>
                  <th>Quantity Requested (liters)</th>
                  <th>Price Per Liter</th>
                  <th>Price Total</th>
                </tr>
              </thead>
              <tbody>
                {selectedRequest.items.map((item, idx) => (
                  <tr key={idx}>
                    <td>{idx + 1}</td>
                    <td>{item.destination}</td>
                    <td>{item.quantityRequested}</td>
                    <td>{item.pricePerUnit}</td>
                    <td>{item.totalPrice}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="signature-section">
              <div className="hod">
                <h4>Logistic Office</h4>
                <label>Prepared By:</label>
                <span>{selectedRequest.hodName || ''}</span><br />
                <img src={`${process.env.REACT_APP_BACKEND_URL}/${selectedRequest.hodSignature}`} alt="HOD Signature" />
              </div>


              <div className='daf-signature'>
                  <h4>DAF Office:</h4>
                  <label htmlFor="">Verified By:</label>
                  {dafUsers.map(user => (
                    <div key={user._id} className="daf-user">
                      <p>{user.firstName} {user.lastName}</p>
                      {user.signature ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${user.signature}`} alt={`${user.firstName} ${user.lastName} Signature`} />
                      ) : (
                        <p>No signature available</p>
                      )}
                    </div>
                  ))}
                </div>

            </div>
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
