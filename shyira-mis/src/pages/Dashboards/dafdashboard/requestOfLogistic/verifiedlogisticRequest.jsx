import React, { useState, useEffect } from 'react';

import { FaQuestionCircle, FaEdit, FaTimes, FaTrash,FaCheck } from 'react-icons/fa';
import axios from 'axios';
import './css.css'; // Import CSS for styling


const ForwardedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [forwardedRequests, setForwardedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [logisticUsers, setLogisticUsers] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [searchParams, setSearchParams] = useState({
    department: '',
    date: ''
  });


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
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest/verified`);
      setForwardedRequests(response.data);
      setFilteredRequests(response.data);
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
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest/update-verified/${selectedRequest._id}`, formData);
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


  // handle search logic to filter requistion by date or department
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  const handleSearchRequest = (e) => {
    e.preventDefault();
    const { department, date } = searchParams;
    const filtered = requests.filter(request => {
      return (!department || request.department.toLowerCase().includes(department.toLowerCase())) &&
             (!date || new Date(request.date).toDateString() === new Date(date).toDateString());
    });
    setFilteredRequests(filtered);
  };
  if (!user) return <p>Loading...</p>;

  return (
    <div className={`verified-requist ${selectedRequest ? 'dim-background' : ''}`}>
    
      <div className="verified-request-navigation">
     
      <form onSubmit={handleSearchRequest} className="search-form">
        <div className='search-date'>
          <label htmlFor="">Search by date</label>
          <input
            type="date"
            name="date"
            placeholder="Search by date"
            value={searchParams.date}
            onChange={handleSearchChange}
          />
        </div>
        
        <button type="submit" className='search-btn'>Search</button>
      </form>

      <div className="order-navigation">
        <div className="navigation-title">
          <h3>Requisition of fuel form logistic office received</h3>
        </div>
        <ul>
          {filteredRequests.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
                Requisition Form from <b>logistic office</b> order of FUEL done on {new Date(request.createdAt).toDateString()}
                <span className="status-verified">Verified</span>
              </p>
            </li>
          ))}
        </ul>
        /</div>
    
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
                         
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            name="quantityRequested"
                            value={item.quantityRequested}
                        
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
            
               <button className='edit-btn' onClick={handleEditClick}>Edit</button>
               <button className='reject-btn'>Reject</button>
               <button></button>
             <label className='request-close-btn' onClick={() => setSelectedRequest(null)}><FaTimes /></label>
          </div>
              <div className="image-request-recieved">
          <img src="/image/logo2.png" alt="Logo" className="logo" />
          </div>
          <div className="request-recieved-heading">
            <h1>WESTERN PROVINCE</h1>
            <h1>DISTRIC: NYABIHU</h1>
            <h1>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h1>
            <h1>DEPARTMENT: LOGISTIC OFFICE </h1>
            <h1>SUPPLIER NAME:{forwardedRequests.supplierName}</h1>

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
                 
                    {logisticUsers.map(user => (
                      <div key={user._id} className="logistic-signature">
                         <h4>Logistic Office:</h4>
                         <label htmlFor="">Prepared By:</label>
                        <p>{user.firstName} {user.lastName}</p>
               s         {user.signature ? (
                          <img src={`${process.env.REACT_APP_BACKEND_URL}/${user.signature}`} alt={`${user.firstName} ${user.lastName} Signature`}
                          className='signature-img' />
                        ) : (
                          <p>No signature available</p>
                        )}
                      </div>
                    ))}
                  </div>
                 <div className="daf-signature">
                    <h4>DAF Office:</h4>
                    <label htmlFor="">verified By</label>
                  <p>{user.firstName} {user.lastName}</p>
                  {user.signature && <img src={`${process.env.REACT_APP_BACKEND_URL}/${user.signature}`} alt="Signature"
                   className='signature-img' />}
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
