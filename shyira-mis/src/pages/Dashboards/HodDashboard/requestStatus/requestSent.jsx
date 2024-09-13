import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaCheckCircle,FaEdit,FaTimesCircle, FaTimes, FaTrash } from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
//import './recievedRequest.css'; // Import CSS for styling

const LogisticRequestForm = () => {

  const [users, setUsers] = useState(null);
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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

    date: ''
  });

  useEffect(() => {
    fetchRequests();
  }, []);


  const fetchRequests = async () => {
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
      const response = await axios.get('http://localhost:5000/api/UserRequest/sent', {
        headers: { Authorization: `Bearer ${token}` } // Send token with request
      });
      setRequests(response.data);
      setFilteredRequests(response.data)
    } catch (err) {
      setError(err.response ? err.response.data.message : 'Error fetching requests');
    } finally {
      setLoading(false);
    }
  };
  
  
  const handleRequestClick = async (requestId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/UserRequest/${requestId}`);
      setSelectedRequest(response.data);
      setEditFormData(response.data);
      setIsEditing(false);
  
      
  
     
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };
  const handleUpdateSubmit = async () => {
  
    try {
      await axios.put(`http://localhost:5000/api/UserRequest/${selectedRequest._id}`, editFormData, { clicked: true });
      
      setModalMessage('Requisition Updated successfull!!');
      setIsSuccess(true); // Set the error state
      setShowModal(true); // Show the modal
      fetchRequests(); // Refresh the list of requests
      setSelectedRequest(null); // Close the details view

     
    } catch (error) {
      console.error('Error updating request:', error);
      setModalMessage('Failed to Update requisition!');
      setIsSuccess(false); // Set the error state
      setShowModal(true); // Show the modal
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
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={`requist ${selectedRequest ? 'dim-background' : ''}`}>
      <h2>Your Requisition waited to be verified</h2>

      <form onSubmit={handleSearchSubmit} className="search-form">
     
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

      <div className="navigate-request">
      <ul>
    {filteredRequests.slice().reverse().map((request, index) => (
      <li key={index}>
       
        <p onClick={() => handleRequestClick(request._id)}>
          Requisition Form from <b>{request.department}</b> done on {new Date(request.createdAt).toDateString()}
       
         
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
                            onChange={(e) => handleItemChange(idx, e)} 
                          />
                        </td>
                        <td>
                          <input 
                            type="number" 
                            name="quantityReceived" 
                            value={item.quantityReceived} 
                          
                          />
                        </td>
                        <td>
                          <input 
                            type="text" 
                            name="observation" 
                            value={item.observation} 
                           
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
                    {selectedRequest.hodSignature ? (
                      <img src={`http://localhost:5000/${selectedRequest.hodSignature}`} alt="HOD Signature" />
                    ) : (
                      <p>No HOD signature available</p>
                    )}

                  </div>
                  {/*<div className="logistic-signature">
                    <label>Logistic office:</label>
                  <h3>{user.firstName} {user.lastName}</h3>
                  {user.signature && <img src={`http://localhost:5000/${user.signature}`} alt="Signature" />}
                  </div>*/}
                  
                  

                </div>
                <hr />
                </div>
               

             
                <div className="buttons">
               
               

               
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
