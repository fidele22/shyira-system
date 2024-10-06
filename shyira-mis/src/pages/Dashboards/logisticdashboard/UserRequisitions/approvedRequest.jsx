// src/components/ApprovedRequests.js
import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaEdit, FaTimes, FaCheck, FaCheckCircle, FaCheckDouble, FaCheckSquare,  } from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './approvedrequest.css'; // Import CSS for styling

const ApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);

  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  // Search parameters state
  const [searchParams, setSearchParams] = useState({
    department: '',
    date: ''
  });

  const [logisticUsers, setLogisticUsers] = useState([]);
  const [dafUsers, setDafUsers] = useState([]);

  useEffect(() => {
    fetchApprovedRequests();
    fetchLogisticUsers(); // Fetch logistic users name and signature on component mount
    fetchDafUsers();   // Fetch Daf users name and signature on component mount
  }, []);

  const fetchLogisticUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/logistic-users');
      setLogisticUsers(response.data);
    } catch (error) {
      console.error('Error fetching logistic users:', error);
    }
  };
  //fetch daf username and signature
  const fetchDafUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/users/daf-users');
      setDafUsers(response.data);
    } catch (error) {
      console.error('Error fetching daf users:', error);
    }
  };
  //fetching approved request from approved collection
  const fetchApprovedRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/approve');
     
      setRequests(response.data);
      setFilteredRequests(response.data); 
    } catch (error) {
      console.error('Error fetching approved requests:', error);
    }
  };
  //fetch with clicking 
  const handleRequestClick = async (requestId) => {
    try {
      const response = await axios.get(`http://localhost:5000/api/approve/${requestId}`);
      setSelectedRequest(response.data);
      setApprovedRequests(response.data);
   

      // Update the clicked status to true
      await axios.put(`http://localhost:5000/api/approve/${requestId}`, { clicked: true });

      // Refresh the requests list
      fetchApprovedRequests();
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };
  //Handle search function
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


  return (
    <div className="approved-requests-page">
      <h4>Approved user's Requesition  for item</h4>
      <form onSubmit={handleSearchRequest} className="search-form">
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
      </form>

      <div className="approved-navigate-request">
        <ul>
          {filteredRequests.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
              Requisition Form from department of <b>{request.department}</b> done on {new Date(request.createdAt).toDateString()}
             {/*<span>{request.clicked ? '' : 'New Request: '}</span>*/}  <label htmlFor=""><FaCheckCircle/> Approved</label>
            </p>
            </li>
          ))}
        </ul>
      </div>

      {selectedRequest && (

        <div className="approved-request-overlay">
         <div className="form-navigation">
         
       
         <button className='request-dowload-btn' onClick={downloadPDF}>Download Pdf</button>
          <label className='request-close-btn' onClick={() => setSelectedRequest(null)}><FaTimes /></label>
         </div>  
          <div className="request-details" >
          <div id='pdf-content'>
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
         <div className="approved-signature-section">
           <div >
             <h3>HOD Name:</h3>
             <label>prepared By:</label> 
            <p>{selectedRequest.hodName}</p>
             {selectedRequest.hodSignature ? (
               <img src={`http://localhost:5000/${selectedRequest.hodSignature}`} alt="HOD Signature" />
             ) : (
               <p>No HOD signature available</p>
             )}
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
         </div>
        
        
       </div>
       </div>
   )}

        </div>
          
  );
};

export default ApprovedRequests;
