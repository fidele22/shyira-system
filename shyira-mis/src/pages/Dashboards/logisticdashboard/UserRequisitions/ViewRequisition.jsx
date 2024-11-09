import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaCheckCircle,FaEdit,FaTimesCircle, FaTimes, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2'; 
import './recievedRequest.css'; // Import CSS for styling

const LogisticRequestForm = () => {

  const [users, setUsers] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);


  const [editFormData, setEditFormData] = useState({
    
  
    department: '',
    items: [],
    logisticName: users ? `${user.firstName} ${user.lastName}`:'',
    logisticSignature: '',
    
  });

  // Search parameters state
  const [searchParams, setSearchParams] = useState({
    department: '',
    date: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/UserRequest`);
      setRequests(response.data);
      setFilteredRequests(response.data); // Initialize filteredRequests with all requests
    } catch (error) {
      console.error('Error fetching requests:', error);
    }
  };


  
  const handleRequestClick = async (requestId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/UserRequest/${requestId}`);
      setSelectedRequest(response.data);
      setEditFormData(response.data);
      setIsEditing(false);
  
      
  
      // Update the filtered requests to reflect the clicked status
      setFilteredRequests((prevRequests) =>
        prevRequests.map((req) => req._id === requestId ? { ...req, clicked: true } : req)
      );
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };
  

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFormData({
      ...editFormData,
      [name]: value
    });
  };

  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    const updatedItems = editFormData.items.map((item, idx) => 
      idx === index ? { ...item, [name]: value } : item
    );
    setEditFormData({
      ...editFormData,
      items: updatedItems
    });
  };

  const handleUpdateSubmit = async () => {
  
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/UserRequest/${selectedRequest._id}`, editFormData, { clicked: true });
      
       // Show success message using SweetAlert2
       Swal.fire ({
        title: 'Success!',
        text: 'requisition updated successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
      fetchRequests(); // Refresh the list of requests
      setSelectedRequest(null); // Close the details view

     
    } catch (error) {
      console.error('Error updating request:', error);
       // Show error message using SweetAlert2
       Swal.fire({
        title: 'Error!',
        text: 'Failed to update requisition',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
    }
  };
//send verified
const handleVerifySubmit = async () => {
  
  try {
    await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/UserRequest/verified/${selectedRequest._id}`, { clicked: true });
  
      // Show success message using SweetAlert2
      Swal.fire ({
        title: 'Success!',
        text: 'requisition verified successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
    fetchRequests(); // Refresh the list of requests
    setSelectedRequest(null); // Close the details view

  } catch (error) {
    console.error('Error updating request:', error);
      // Show error message using SweetAlert2
      Swal.fire({
        title: 'Error!',
        text: 'Failed to verify requisition',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
  }
};

  // Function to generate and download PDF
  const downloadPDF = async () => {
    const input = document.getElementById('pdf-content');
    if (!input) {
      console.error('Element with ID pdf-content not found');
      return;
    }
    
    try {
      const canvas = await html2canvas(input);
      const data = canvas.toDataURL('image/png');

      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 20; // Subtract the margin from the width
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(data, 'PNG', 10, 10, imgWidth, imgHeight); // 10 is the margin
      pdf.save('requisition-form.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({
      ...searchParams,
      [name]: value
    });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const { department, date } = searchParams;
    const filtered = requests.filter(request => {
      return (!department || request.department.toLowerCase().includes(department.toLowerCase())) &&
             (!date || new Date(request.date).toDateString() === new Date(date).toDateString());
    });
    setFilteredRequests(filtered);
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


  const handleRejectClick = async (requestId) => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/UserRequest/rejected/${requestId}`, { clicked: true });
      
      setModalMessage(' requisition rejected Successful!!');
      setIsSuccess(true); // Set the success state
      setShowModal(true); // Show the modal
      fetchRequests(); // Refresh the list of requests
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error marking request as received:', error);
   
      setModalMessage('Failed to reject requisition');
      setIsSuccess(false); // Set the success state
      setShowModal(true); // Show the modal
    }
  };
  if (!user) return <p>Loading...</p>;

  return (
    <div className={`requist ${selectedRequest ? 'dim-background' : ''}`}>


      <form onSubmit={handleSearchSubmit}>
        <div className="search-form">
        <div className='search-department'>
        <label htmlFor="">Search by department</label>
       <input
          type="text"
          name="department"
          placeholder="Search by department"
          value={searchParams.department}
          onChange={handleSearchChange}
        />
       </div>
      
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
        </div>
       
      </form>
      <div className="order-navigation">
        <div className="navigation-title">
          <h2>Requisition of items form different department</h2>
        </div>
        <ul>
          {filteredRequests.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
                Requisition Form of item from <b>{request.department}</b> done on {new Date(request.createdAt).toDateString()}
               
              </p>

            </li>
            
          ))}
        </ul>
   
      
  
      </div>
   
      {selectedRequest && (
      
      
        <div className="request-details-overlay">
         
          <div className="request-details">
          
            {isEditing ? (
              <>
                <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Item Name</th>
                      <th>Quantity Requested</th>
                      <th>Quantity Received</th>
                      <th>Observation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {editFormData.items.map((item, idx) => (
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
                            name="quantityReceived" 
                            value={item.quantityReceived} 
                            onChange={(e) => handleItemChange(idx, e)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            name="observation" 
                            value={item.observation} 
                            onChange={(e) => handleItemChange(idx, e)} 
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

               
                <hr />
               
                <div className="buttons">
                <button className='submit-an-update' onClick={handleUpdateSubmit}>update</button>
                <button className='request-cancel-btn' onClick={handleCancelEdit}>Cancel</button>
                
                </div>
               
                
                
              </>
             
            ) : (
       
              <>
          <div className="form-navigation">
         
          <button className='verify-requisition' onClick={ handleVerifySubmit}>Verify Request</button>
          <button className='request-dowload-btn' onClick={downloadPDF}>Download Pdf</button>
          <button className='request-edit-btn' onClick={handleEditClick}>Edit</button>
          <button></button>
             <label className='request-close-btn' onClick={() => setSelectedRequest(null)}><FaTimes /></label>
          </div>
         <div id="pdf-content">
          <div className="image-request-recieved">
          <img src="/image/logo2.png" alt="Logo" className="logo" />
          </div>
          <div className="request-recieved-heading">
          <div className='date-done'>
            <label htmlFor="">{new Date(editFormData.date).toDateString()}</label>
            </div>
         
            <h1>WESTERN PROVINCE</h1>
            <h1>DISTRIC: NYABIHU</h1>
            <h1>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h1>
            <h1>DEPARTMENT: <span>{editFormData.department}</span> </h1>
          

          </div>
           
            <u><h2>REQUISITON FORM</h2></u>  
               <table>
                  <thead>
                    <tr>
                      <th>No</th>
                      <th>Item Name</th>
                      <th>Quantity Requested</th>
                      <th>Quantity Received</th>
                      <th>Observation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedRequest.items.map((item, idx) => (
                      <tr key={idx}>
                        <td>{idx + 1}</td>
                        <td>{item.itemName}</td>
                        <td>{item.quantityRequested}</td>
                        <td>{item.quantityReceived}</td>
                        <td>{item.observation}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="signature-section">
                  <div className="hod">
                  <label htmlFor="hodName">Name of HOD:</label>
                    {selectedRequest.hodName && <p>{selectedRequest.hodName}</p>}
                    <label htmlFor="hodSignature">HOD Signature:</label>
                    {selectedRequest.hodSignature ? (
                      <img src={`http://localhost:5000/${selectedRequest.hodSignature}`} alt="HOD Signature" />
                    ) : (
                      <p>No HOD signature available</p>
                    )}

                  </div>
                 
                  
                  

                </div>
                <hr />
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

export default LogisticRequestForm;
