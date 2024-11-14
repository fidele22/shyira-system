// frontend/src/components/FuelRequisitionForm.js
import React, { useEffect, useState } from 'react';
import { FaEye, FaEdit,FaTimes, FaTimesCircle, FaCheck,
  FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2'; 


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
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/forwardedrequests/fuel`);
        setRequisitions(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching requisitions:', error);
        setError('Failed to fetch requisitions');
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


    // Validate quantityReceived if editing

    if (name === "quantityReceived" && parseInt(value) > parseInt(selectedRequest.quantityRequested)) {

      Swal.fire({

        title: 'Error!',
        text: 'Quantity received cannot be greater than quantity requested.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal',
        }

      });

      return; // Prevent state update if validation fails

    }


    // Update FormData directly

    setFormData((prevData) => ({

      ...prevData,

      [name]: value, // Update the specific field

    }));

  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveClick = async () => {
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/forwardedrequests/updatefuel/${selectedRequest._id}`, formData);
      setSelectedRequest(response.data);
      
      // Show error message using SweetAlert2
      Swal.fire({
        title: 'Success',
        text: 'Fuel requisition updated successful!!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
      setIsEditing(false);
      
    } catch (error) {
      console.error('Error updating requisition:', error);
       
      // Show error message using SweetAlert2
      Swal.fire({
        title: 'Error!',
        text: 'Failed to update fuel requisition',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
    }
  };
  const handleApproveClick = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this fuel requisition with signing?,',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Approve it!',
      customClass: {
        popup: 'custom-swal', // Apply custom class to the popup
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/forwardedrequests/approvefuel/${selectedRequest._id}`, formData);
      setSelectedRequest(response.data);
       
      // Show error message using SweetAlert2
      Swal.fire({
        title: 'Success',
        text: 'Fuel requisition approved successful!!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
    } catch (error) {
      console.error('Error verifying requisition:', error);
       
      // Show error message using SweetAlert2
      Swal.fire({
        title: 'Error!',
        text: 'Failed to approve fuel requisition',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
    }
  }
});
  };
  const handleRejectRequest = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to reject this fuel requisition with signing?,',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Reject it!',
      customClass: {
        popup: 'custom-swal', // Apply custom class to the popup
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/forwardedrequests/reject/${selectedRequest._id}`);
      setRequisitions(requisitions.filter(req => req._id !== selectedRequest._id));
      setSelectedRequest(null);
  // Show error message using SweetAlert2
      Swal.fire({
        title: 'Success',
        text: 'Fuel Requisition rejected successfully!!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
    

   
    } catch (error) {
      console.error('Error rejecting requisition:', error);

       // Show error message using SweetAlert2
       Swal.fire({
        title: 'Error',
        text: 'Failed to reject requisition.',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', 
        }
      });
     
    }
  }
});
  };
  const handleCloseClick = () => {
    setSelectedRequest(null);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="fuel-requisition-form">
      <div className="order-navigation">
      <div className="navigation-title">
          <h2>Requisition form of fuel from different users that was verified </h2>
        </div>
        <ul>
          {requisitions.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
                Requisition Form from {request.department} done on {new Date(request.createdAt).toDateString()}
                <span className='status-verified'>Verified</span>
              </p>
            </li>
          ))}
        </ul>
      </div>

      {selectedRequest && (
        <div className="fuel-request-details-overlay">
          <div className="fixed-nav-bar">
          <button type="button" className='verify-btn' onClick={handleApproveClick}>Aprrove</button>
            <button  type="button" className='edit-btn' onClick={handleEditClick}>Edit</button>
            {isEditing && <button type="button"  onClick={handleSaveClick}>Save</button>}
           
            <button type="button" className='reject-request-btn' onClick={handleRejectRequest}>Reject</button>
            <button type="button" className='close-btn' onClick={handleCloseClick}><FaTimes /></button>
          </div>

          <div className="fuel-request-details-content">
          <div className="imag-logo">
          <img src="/image/logo2.png" alt="Logo" className="log"  />
          </div>
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
                <label>Quantity Received (liters):</label>
                  {isEditing ? (
                    <input
                      type="number"
                      name="quantityReceived"
                      value={formData.quantityReceived || ''}
                      onChange={handleInputChange}
                    />
                  ) : (
                    <span>{selectedRequest.quantityReceived || ''}</span>
                  )}
                 
                </div>
                <div className="left-side">
                <div className="quantity-recieved-field">
                  <label>Average Km/l:</label>
                  <span>{selectedRequest.average || ''}</span>
                  </div>
                </div>
              </div>
              <div className="view-form-group">
               
               
                <div className="detail-row">
                {selectedRequest && selectedRequest.file ? (
               <div className='file-uploaded'>
               <label>Previous Destination file:</label>
               <a href={`${process.env.REACT_APP_BACKEND_URL}/${selectedRequest.file}`} target="_blank" rel="noopener noreferrer">
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
                <div className="hod-fuel-signature">
                  <h5>Head of department</h5>
                  <label>Prepared By:</label>
                  <span>{selectedRequest.hodName || ''}</span>
                  <img src={`${process.env.REACT_APP_BACKEND_URL}/${selectedRequest.hodSignature}`} alt="HOD Signature" 
                    className='image-signature' />
                </div>
                <div className='logistic-signature'>
                 
                    {logisticUsers.map(user => (
                      <div key={user._id} className="logistic-fuel-signature">
                         <h5>Logistic Office:</h5>
                         <label htmlFor="">verified By:</label>
                        <span>{user.firstName} {user.lastName}</span>
                        {user.signature ? (
                          <img src={`${process.env.REACT_APP_BACKEND_URL}/${user.signature}`}  
                          className='image-signature' />
                        ) : (
                          <p>No signature available</p>
                        )}
                      </div>
                    ))}
                  </div>
                 
              </div>
              <div className='footer-img'>
         <img src="/image/footerimg.png" alt="Logo" className="logo" />
         </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default FuelRequisitionForm;
