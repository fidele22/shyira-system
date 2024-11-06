import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit,FaTimes, FaTimesCircle, FaCheck,
  FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import axios from 'axios';
//import './viewfuelrequest.css';

const FuelRequisitionForm = () => {
  const [requisitions, setRequisitions] = useState([]); // Initialize as empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [logisticUsers, setLogisticUsers] = useState([]);
  const [dafUsers, setDafUsers] = useState([]);
   


  useEffect(() => {
    const fetchLogisticUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/logistic-users');
        setLogisticUsers(response.data);
      } catch (error) {
        console.error('Error fetching logistic users:', error);
      }
    };
  
    fetchLogisticUsers();
  }, []);

  useEffect(() => {
    const fetchRequisitions = async () => {
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

        const response = await axios.get('http://localhost:5000/api/userfuelrequest', {
          headers: { Authorization: `Bearer ${token}` } // Send token with request
        });
        setRequisitions(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching requisitions:', error);
        setError(err.response ? err.response.data.message : 'Error fetching requests');
        setLoading(false);
      }
    };


    
  
    fetchRequisitions();
  }, []);

  useEffect(() => {
    const fetchDafUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/daf-users');
        setDafUsers(response.data);
      } catch (error) {
        console.error('Error fetching logistic users:', error);
      }
    };
  
    fetchDafUsers();
  }, []);

  const handleRequestClick = async (requestId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/userfuelrequest/${requestId}`);
      setSelectedRequest(response.data);
      setFormData(response.data);
      setIsEditing(false);

      setRequisitions((prevRequests) =>
        prevRequests.map((req) =>
          req._id === requestId ? { ...req, clicked: true } : req
        )
      );
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };
 
  const handleRecievedClick = async () => {
    try {
      const response = await axios.post(`http://localhost:5000/api/approve/fuel-recieved/${selectedRequest._id}`, formData);
      setSelectedRequest(response.data);
      alert('Sign as received done well!!!.');
    } catch (error) {
      console.error('Error verifying requisition:', error);
      alert('Failed to sign requisition.');
    }
  };

  const handleCloseClick = () => {
    setSelectedRequest(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="fuel-requisition-form">
      <h4>List of Fuel Requisition that has been approved</h4>
      <label htmlFor="">you have to review your requisition was approved and sign / mark as you have recieved</label>
      <div className="navigate-request">
        <ul>
          {requisitions.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
                Requisition Form from {request.department} done on {new Date(request.createdAt).toDateString()}
               {/** <span>{!request.clicked ? 'New Request' : ''}</span>*/}
              </p>
            </li>
          ))}
        </ul>
      </div>

      {selectedRequest && (
        <div className="fuel-request-details-overlay">
          <div className="fixed-nav-bar">
            <button type="button" className='verify-btn' onClick={handleRecievedClick}>Mark as Received</button>
            <button type="button" className='close-btn' onClick={handleCloseClick}>Close</button>
          </div>

          <div className="fuel-request-details-content">
            <h3>Fuel Requisition Form</h3>
            <form>
              <div className="view-form-group">
                <label>Requester Name: <span>{selectedRequest.requesterName || ''}</span></label>
              </div>
              <div className="view-form-group">
                <div className="right-side">
                  <label>Car Plaque:</label>
                  <span>{selectedRequest.carPlaque || ''}</span>
                </div>
                <div className="left-side">
                  <label>Remaining (liters):</label>
                  <span>{selectedRequest.remainingLiters || ''}</span>
                </div>
              </div>
              <div className="view-form-group">
                <div className="right-side">
                  <label>Kilometers:</label>
                  <span>{selectedRequest.kilometers || ''}</span>
                </div>
                <div className="right-side">
                  <label>Quantity Requested (liters):</label>
                  <span>{selectedRequest.quantityRequested || ''}</span>
                </div>
              </div>
              <div className="view-form-group">
                <div className="left-side">
                  <label>Average Km/l:</label>
                  <span>{selectedRequest.average || ''}</span>
                </div>
                <div className="left-side">
                  <label>Quantity Received (liters):</label>
                 
                    <span>{selectedRequest.quantityReceived || ''}</span>
                
                </div>
              </div>
              <div className="view-form-group">
            
                <div className="left-side">
                  <label>Reason:</label>
                  <span>{selectedRequest.reason || ''}</span>
                </div>
                <div className="detail-row">
                {selectedRequest && selectedRequest.file ? (
  <div className='file-uploaded'>
    <label>Previous Destination file:</label>
    <a href={`http://localhost:5000/${selectedRequest.file}`} target="_blank" rel="noopener noreferrer">
    <FaEye /> View File
    </a>
  </div>
    ) : (
  <p>No file uploaded</p>
    )}

   </div>
              </div>
              <hr />
              <div className="fuel-signatures">
                <div className="hod">
                <h3>Head Of department:</h3>
                  <label>Prepared By:</label>
                  <span>{selectedRequest.hodName || ''}</span>
                  <img src={`http://localhost:5000/${selectedRequest.hodSignature}`} alt="HOD Signature" />
                </div>
             
              <div className='logistic-signature'>
                  <h3>Logistic Office:</h3>
                  <label htmlFor="">Verified By:</label>
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
                <div className="daf-signature">
                <h3>DAF:</h3>
                <label htmlFor="">Approved By:</label>
                {dafUsers.map(user => (
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
            </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelRequisitionForm;
