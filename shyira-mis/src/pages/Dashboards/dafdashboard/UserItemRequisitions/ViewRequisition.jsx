import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaTimesCircle, FaEdit, FaCheckCircle, FaTimes, FaTrash, FaCheck } from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import Swal from 'sweetalert2';
import '../../logisticdashboard/contentCss/itemrequisition.css';

const ForwardedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [forwardedRequests, setForwardedRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ items: [] }); 
  const [logisticUsers, setLogisticUsers] = useState([]);
  const [searchParams, setSearchParams] = useState({ department: '', date: '' });
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchForwardedRequests();
    fetchLogisticUsers();
    fetchUserProfile();
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
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/forwardedrequests/items`);
      setForwardedRequests(response.data);
      setRequests(response.data);
      setFilteredRequests(response.data); 
    } catch (error) {
      console.error('Error fetching forwarded requests:', error);
    }
  };

  const fetchUserProfile = async () => {
    try {
      const currentTab = sessionStorage.getItem('currentTab');
      if (!currentTab) return setError('No tab ID found in sessionStorage');

      const token = sessionStorage.getItem(`token_${currentTab}`);
      if (!token) return setError('Token not found');

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      setUser(response.data);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setError('Invalid token or unable to fetch profile data');
    }
  };

  const handleRequestClick = (requestId) => {
    const request = forwardedRequests.find(req => req._id === requestId);
    setSelectedRequest(request);
    setFormData(request);
  };

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setIsEditing(false);
    setFormData(selectedRequest);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({ ...prevState, [name]: value }));
  };
  
  const handleItemChange = (index, e) => {
    const { name, value } = e.target;
    
    // Ensure items exist in formData, default to an empty array if undefined
    const updatedItems = (formData.items || []).map((item, idx) => {
      if (idx === index) {
        // Validate "quantityReceived" if necessary
        if (name === "quantityReceived" && parseInt(value) > parseInt(item.quantityRequested)) {
          Swal.fire({
            title: 'Error!',
            text: 'Quantity received cannot be greater than quantity requested.',
            icon: 'error',
            confirmButtonText: 'OK',
            customClass: { popup: 'custom-swal' } 
          });
          return item; // Return original item if validation fails
        }
        // Update item with the new value
        return { ...item, [name]: value };
      }
      return item;
    });
  
    // Set updated items back to formData
    setFormData((prevState) => ({
      ...prevState,
      items: updatedItems
    }));
  };
  

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/forwardedrequests/${selectedRequest._id}`, formData);
      setSelectedRequest(response.data);
      setIsEditing(false);
      setForwardedRequests(prevRequests => prevRequests.map(req => (req._id === response.data._id ? response.data : req)));

      Swal.fire({
        title: 'Success!',
        text: 'Requisition updated successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
    } catch (error) {
      console.error('Error updating request:', error);
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

  const handleApproveSubmit = async (e) => {
    e.preventDefault();
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to approve this requisition with signing?,',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, approve it!',
      customClass: {
        popup: 'custom-swal', // Apply custom class to the popup
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/forwardedrequests/approved/${selectedRequest._id}`);
      Swal.fire({
        title: 'Success!',
        text: 'Requisition approved successfully!',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: {
          popup: 'custom-swal', // Apply custom class to the popup
        }
      });
      fetchForwardedRequests();
    } catch (error) {
      console.error('Error approving requisition:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to approve requisition',
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

  const handleRejectClick = async () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'Do you want to reject this requisition? you will not be able to revert!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, reject it!',
      customClass: { popup: 'custom-swal' }
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // Send request to backend to reject the requisition
          await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/forwardedrequests/rejectedrequests`, {
            requisitionId: selectedRequest._id
          });
          Swal.fire({
            title: 'Rejected',
            text: 'The requisition has been rejected.',
            icon: 'success',
            confirmButtonText: 'OK',
            customClass: {
              popup: 'custom-swal', // Apply custom class to the popup
            }
          });
        
          fetchForwardedRequests(); // Refresh the list of forwarded requests
          setSelectedRequest(null); // Deselect the rejected request
        } catch (error) {
          console.error('Error rejecting requisition:', error);

          Swal.fire({
            title: 'Error!',
            text: 'Failed to reject requisition.',
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
  
  // Function to generate and download PDF
  const downloadPDF = async () => {
    const input = document.getElementById('pdf-content');
    if (!input) {
      console.error('Element with ID pdf-content not found');
      return;
    }
  
    try {
      // Use html2canvas to capture the content of the div, including the image signatures
      const canvas = await html2canvas(input, {
        allowTaint: true,
        useCORS: true, // This allows images from different origins to be included in the canvas
      });
  
      const data = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
  
      // Add the image content into the PDF and download
      pdf.addImage(data, 'PNG', 10, 10, pdfWidth - 20, pdfHeight); // Adjust the margins if needed
      pdf.save('requisition-form-with-signatures.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };
  const handleSearchChange = (e) => {
    const { name, value } = e.target;
    setSearchParams({ ...searchParams, [name]: value });
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const { department, date } = searchParams;
    const filtered = forwardedRequests.filter(request => {
      const requestDate = new Date(request.date).toDateString();
      const searchDate = date ? new Date(date).toDateString() : null;

      return (!department || request.department.toLowerCase().includes(department.toLowerCase())) &&
             (!date || requestDate === searchDate);
    });
    setFilteredRequests(filtered.length > 0 ? filtered : []);
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className={`requist ${selectedRequest ? 'dim-background' : ''}`}>
       
   
      <form onSubmit={handleSearchSubmit} >
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
    <h2>User's Requisition for Items Verified</h2>
  </div>
  {filteredRequests.length > 0 ? (
  <ul>
    {filteredRequests.slice().reverse().map((request, index) => (
      <li key={index}>
        <p onClick={() => handleRequestClick(request._id)}>
          Requisition Form from department of <b>{request.department}</b> verified on {new Date(request.updatedAt).toDateString()}
          <span className='status-verified'>Verified</span>
        </p>
      </li>
    ))}
  </ul>
) : (
  <p>No requests found for the given search criteria.</p>
)}

</div>

      
      {selectedRequest && (
        <div className="request-details-overlay">
          <div className="request-details">
            {isEditing ? (
              <form >
                <h1>Edit Request</h1>
                <div className="request-recieved-heading">
            <h1>WESTERN PROVINCE</h1>
            <h1>DISTRIC: NYABIHU</h1>
            <h1>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h1>
            <h1>DEPARTMENT: <span>{selectedRequest.department}</span>  </h1>

          </div>
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
                <div className="buttons">
                <button className='submit-an-update' onClick={handleUpdateSubmit}>update</button>
                <button type="button" className='update-cancel-btn' onClick={handleCancelClick}>Cancel</button>
              </div>
              </form>
            ) : (
              <>
               <div className="form-navigation">
               <button className='approve-request-btn' onClick={handleApproveSubmit}>Approve Request</button>
               <button className='request-edit-btn' onClick={handleEditClick}>Edit</button>
               <button onClick={handleRejectClick} className="reject-button">Reject request</button>

               <button className='request-dowload-btn' onClick={downloadPDF}>Download Pdf</button>
               <button></button>
             <label className='request-close-btn' onClick={() => setSelectedRequest(null)}><FaTimes /></label>
          </div>
          <div id="pdf-content">

         
              <div className="image-request-recieved">
          <img src="/image/logo2.png" alt="Logo" className="logo" />
          </div>
          <div className="request-recieved-heading">
          <div className='date-done'>
            <label htmlFor="">{new Date(selectedRequest.date).toDateString()}</label>
            </div>
            <h1>WESTERN PROVINCE</h1>
            <h1>DISTRIC: NYABIHU</h1>
            <h1>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h1>
            <h1>DEPARTMENT: <span>{selectedRequest.department}</span>  </h1>
           

          </div>

            <h2>REQUISITON FORM</h2>
              
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
                <div className="hod-signature">
                <label className='signature-title'>Name of head of {selectedRequest.department}:</label>
                  <label htmlFor="">Prepared By:</label>
                     <p >{selectedRequest.hodName}</p>
              
                    {selectedRequest.hodSignature ? (
                      <img src={`${process.env.REACT_APP_BACKEND_URL}/${selectedRequest.hodSignature}`} alt="HOD Signature" className='signature-img' />
                    ) : (
                      <p>No HOD signature available</p>
                    )}

                  </div>
                  <div className='logistic-signature'>
                  <label className='signature-title'>Logistic Office:</label>
                  <label htmlFor="">verified By:</label>
                    {logisticUsers.map(user => (
                      <div key={user._id} className="logistic-user">
                        <p>{user.firstName} {user.lastName}</p>
                        {user.signature ? (
                          <img src={`${process.env.REACT_APP_BACKEND_URL}/${user.signature}`} className='signature-img' />
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
