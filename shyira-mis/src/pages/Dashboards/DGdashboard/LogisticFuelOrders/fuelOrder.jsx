import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaEdit, FaTimes,FaCheckCircle, FaTimesCircle,FaTrash,FaCheck } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import './stylingfuelorders.css'

//import './ViewRequest.css'; // Import CSS for styling


const ForwardedRequests = () => {
  const [forwardedRequests, setForwardedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [logisticUsers, setLogisticUsers] = useState([]);

  useEffect(() => {
    fetchForwardedRequests();
    fetchLogisticUsers(); // Fetch logistic users on component mount
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
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/logisticFuel`);
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
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/logisticFuel/${selectedRequest._id}`, formData);
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
 const handleApproveSubmit = async (e) => {
  e.preventDefault();
  try {
       // Forward the updated request to the approved collection
       const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logisticFuel/verified/${selectedRequest._id}`);
       setSelectedRequest(response.data);
       Swal.fire ({
        title: 'Success!',
        text: 'Approve fuel order successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
         // Optionally refresh the list
    fetchForwardedRequests();
  } catch (error) {
    console.error('Error for approving request:', error);  
    Swal.fire ({
      title: 'Error!',
      text: 'Failed to approve fuel order',
      icon: 'error',
      confirmButtonText: 'OK',
      customClass: {
        popup: 'custom-swal', // Apply custom class to the popup
      }
    });
  }
} 

//reject fuel order

const handleRejectSubmit = async () => {

    if (!selectedRequest) return;
    try {
        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/logisticFuel/rejectFuelOrder/${selectedRequest._id}`);

        Swal.fire ({
          title: 'Success!',
          text: 'Fuel order rejected successfully',
          icon: 'success',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'custom-swal', // Apply custom class to the popup
          }
        });
        // Optionally refresh the list
        fetchForwardedRequests();

    } catch (error) {

        console.error('Error rejecting request:', error);
        Swal.fire ({
          title: 'Error!',
          text: 'Failed to reject fuel order',
          icon: 'error',
          confirmButtonText: 'OK',
          customClass: {
            popup: 'custom-swal', // Apply custom class to the popup
          }
        });

    }

};

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

    fetchUserProfile();
  }, []);



  if (!user) return <p>Loading...</p>;

  return (
    <div className={`verified-requist ${selectedRequest ? 'dim-background' : ''}`}>

      <div className="order-navigation">
        <div className="navigation-title">
        <h2>Requisition from logistic office for fuel</h2>
        </div>
      
        <ul>
          {forwardedRequests.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
          Requisition Form from <b>logistic office</b>  order of FUEL done on {new Date(request.createdAt).toDateString()}
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
                <h2>Edit Logistic Fuel Order</h2>
                <div className="request-recieved-heading">
            <h5>WESTERN PROVINCE</h5>
            <h5>DISTRIC: NYABIHU</h5>
            <h5>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h5>
            <h5>DEPARTMENT:  LOGISTIC OFFICE</h5>
            <h5>SUPPLIER NAME:</h5>

          </div>
                <table>
                  <thead>
                    <tr>
                 <th>No</th>
                <th>desitination</th>
                <th>Quantity Requested(liters)</th>
                <th>Price Per Liter</th>
                <th>Price Total</th>
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
                            value={item.desitination}
                           
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
                            value={item.pricePerUnit}
                            onChange={(e) => handleItemChange(idx, e)}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="totalAmount"
                            value={item.totalPrice}
                            onChange={(e) => handleItemChange(idx, e)}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                
                <button className='update-request-btn' onClick={handleUpdateSubmit}>Update Request</button>
                <button type="button" className='cancel-request-btn' onClick={handleCancelClick}><FaTimes /></button>
              </form>
            ) : (
              <>
               <div className="form-navigation">
               {/* <button className='approve-requisition' onClick={handleApproveSubmit}>Approve Order</button>
               <button className='reject-request' onClick={handleRejectSubmit}>Reject Order</button> */}
               {/* <button className='edit-btn' onClick={handleEditClick}>Edit</button> */}
               <button></button>
             <label className='request-close-btn' onClick={() => setSelectedRequest(null)}><FaTimes /></label>
          </div>
            <div className="image-request-recieved">
          <img src="/image/logo2.png" alt="Logo" className="logo" />
          </div>
          <div className='date-done'>
            <label htmlFor="">{new Date(selectedRequest.date).toDateString()}</label>
            </div>
          <div className="fuel-order-heading">
            <h5>WESTERN PROVINCE</h5>
            <h5>DISTRIC: NYABIHU</h5>
            <h5>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h5>
            <h5>DEPARTMENT: LOGISTIC OFFICE </h5>
            <h5>SUPPLIER NAME:{selectedRequest.supplierName}</h5>
          </div>

            <h3>REQUISITON FORM OF LOGISTIC FOR FUEL</h3>
              
                <table>
                  <thead>
                    <tr>
                    <th>No</th>
                <th>desitination</th>
                <th>Quantity Requested(liters)</th>
                <th>Price Per Liter</th>
                <th>Price Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{item.desitination}</td>
                        <td>{item.quantityRequested}</td>
                        <td>{item.pricePerUnit}</td>
                        <td>{item.totalPrice}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="daf-signature-section">
                <div className="hod-signature">
                  <h4>Logistic Office</h4>
                  <label>Prepared By:</label>
                  <span>{selectedRequest.hodName || ''}</span><br />
                  <img src={`${process.env.REACT_APP_BACKEND_URL}/${selectedRequest.hodSignature}`} alt="HOD Signature"
                  className='signature-img' />
                
                    
                   
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
