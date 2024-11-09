import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaEdit, FaTimes, FaCheckCircle, FaTimesCircle, FaTrash, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2'; 

const ForwardedRequests = () => {
  const [forwardedRequests, setForwardedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [logisticUsers, setLogisticUsers] = useState([]);

  useEffect(() => {
    fetchForwardedRequests();
    fetchLogisticUsers();
  }, []);

  const fetchLogisticUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/logistic-users`);
      setLogisticUsers(response.data);
    } catch (error) {
      console.error('Error fetching logistic users:', error);
    }
  };

  const fetchForwardedRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest`);
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

  const handleRejectRequest = async () => {
    const confirmReject = await Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, reject it!',
      customClass: {
        popup: 'custom-swal', // Apply custom class to the popup
      }
    });

    if (confirmReject.isConfirmed) {
      try {
        await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest/rejectItemOrder/${selectedRequest._id}`, {
          // You can send additional data if needed
        });
        setForwardedRequests(prevRequests => prevRequests.filter(req => req._id !== selectedRequest._id));
        setSelectedRequest(null);
        Swal.fire({
          title: 'Success',
          text: 'Rejecting logistic item order successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'custom-swal',
          }
        });
      } catch (error) {
        console.error('Error rejecting request:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to rejected item order',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'custom-swal',
          }
        });
      }
    }
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
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest/${selectedRequest._id}`, formData);
      setSelectedRequest(response.data);
      setIsEditing(false);
      setForwardedRequests(prevRequests =>
        prevRequests.map(req => (req._id === response.data._id ? response.data : req))
      );
      alert('Re quisition updated successfully');
    } catch (error) {
      console.error('Error updating request:', error);
    }
  };

  const handleVerifySubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest/verified/${selectedRequest._id}`);
      setSelectedRequest(response.data);
      Swal.fire({
        title: 'Success',
        text: 'Verifying logistic item order successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal',
        }
      });
    } catch (error) {
      console.error('Error approving request:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to verify item order',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal',
        }
      });
    }
  };

  return (
    <div className={`verified-requist ${selectedRequest ? 'dim-background' : ''}`}>
      <div className="order-navigation">
        <div className="navigation-title">
          <h2>Requisition from logistic office for item</h2>
        </div>
        <ul>
          {forwardedRequests.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
                Requisition Form from <b>logistic</b> done on {new Date(request.date).toDateString()}
              </p>
            </li>
          ))}
        </ul>
      </div>
      {selectedRequest && (
        <div className="request-details-overlay">
          <div className="request-details">
            {isEditing ? (
              <form>
                <h2>Edit Request</h2>
                <div className="request-recieved-heading">
                  <h1>WESTERN PROVINCE</h1>
                  <h1>DISTRICT: NYABIHU</h1>
                  <h1>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h1>
                  <h1>DEPARTMENT: LOGISTIC OFFICE</h1>
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
                  <button className='reject-request' onClick={handleRejectRequest}>Reject Request</button>
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
                  <h1>DISTRICT: NYABIHU</h1>
                  <h1>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h1>
                  <h1>DEPARTMENT: LOGISTIC OFFICE</h1>
                </div>

                <h2>REQUISITION FORM OF LOGISTIC</h2>
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
                          <img src={`${process.env.REACT_APP_BACKEND_URL}/${user.signature}`} alt={`${user.firstName} ${user.lastName} Signature`} />
                        ) : (
                          <p>No signature available</p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      )}
   
    </div>
  );
};

export default ForwardedRequests;