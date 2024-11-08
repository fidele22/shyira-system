// frontend/src/components/FuelRequisitionForm.js
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit,FaTimes, FaTimesCircle, FaCheck,
  FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import axios from 'axios';
//import './viewfuelrequest.css';

const FuelRequisitionForm = () => {
  const [requisitions, setRequisitions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);
  const [logisticUsers, setLogisticUsers] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

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
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/forwardedrequests/user-fuel-verified`, {
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
    const fetchLogisticUsers = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/logistic-users`);
        setLogisticUsers(response.data);
      } catch (error) {
        console.error('Error fetching logistic users:', error);
      }
    };
  
    fetchLogisticUsers();
  }, []);

  const handleRequestClick = async (requestId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/forwardedrequests/fuel/${requestId}`);
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/forwardedrequests/updatefuel/${selectedRequest._id}`, formData);
      setSelectedRequest(response.data);
      alert('Fuel requisition updated successful')
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating requisition:', error);
    }
  };

  const handleCloseClick = () => {
    setSelectedRequest(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="fuel-requisition-form">
      <h4>Fuel Requisition <span>[Verified]</span></h4>
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
                  <h3>Head of department</h3>
                  <label>Prepared By:</label>
                  <span>{selectedRequest.hodName || ''}</span>
                  <img src={`http://localhost:5000/${selectedRequest.hodSignature}`} alt="HOD Signature" />
                </div>
              
                <div className='logistic-signature'>
                  <h3>Logistic Office:</h3>
                  <label htmlFor="">verified By:</label>
                    {logisticUsers.map(user => (
                      <div key={user._id} className="logistic-user">
                        <span>{user.firstName} {user.lastName}</span>
                        {user.signature ? (
                          <img src={`http://localhost:5000/${user.signature}`}  />
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
