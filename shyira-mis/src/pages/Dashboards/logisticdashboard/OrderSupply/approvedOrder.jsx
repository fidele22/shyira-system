// src/components/ApprovedRequests.js
import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaEdit,FaTimes, FaTimesCircle, FaCheck,
     FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { useDropzone } from 'react-dropzone';
import './modelMessage.css'  // Import Dropzone for file attachment

const ApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [approvedRequests, setApprovedRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [fileAttachments, setFileAttachments] = useState([]);
  const [searchParams, setSearchParams] = useState({
    department: '',
    date: ''
  });

  const [logisticUsers, setLogisticUsers] = useState([]);
  const [dafUsers, setDafUsers] = useState([]);
  const [dgUsers, setDgUsers] = useState([]);

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);

  useEffect(() => {
    fetchApprovedRequests();
    fetchLogisticUsers();
    fetchDafUsers();
    fetchDgUsers();
  }, []);

  const fetchLogisticUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/logistic-users`);
      setLogisticUsers(response.data);
    } catch (error) {
      console.error('Error fetching logistic users:', error);
    }
  };

  const fetchDafUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/daf-users`);
      setDafUsers(response.data);
    } catch (error) {
      console.error('Error fetching daf users:', error);
    }
  };
  const fetchDgUsers = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/DG-users`);
      setDgUsers(response.data);
    } catch (error) {
      console.error('Error fetching daf users:', error);
    }
  };

  const fetchApprovedRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest/approved-order`);
      setRequests(response.data);
      setFilteredRequests(response.data); 
    } catch (error) {
      console.error('Error fetching approved requests:', error);
    }
  };
//marking and send requisition into recieved collection

const handleReceivedClick = async (requestId) => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest/received/${requestId}`);
      setModalMessage('Reception sign and update stock successfully');
      setIsSuccess(true); // Set the success state
      setShowModal(true); // Show the modal
      fetchApprovedRequests(); // Refresh the list after posting
    } catch (error) {
      console.error('Error marking request as received:', error);
      setModalMessage('Failed to mark request as received');
      setIsSuccess(false); // Set the error state
      setShowModal(true); // Show the modal
    }
  };
  const handleRequestClick = async (requestId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest/approved/${requestId}`);
      setSelectedRequest(response.data);
      setApprovedRequests(response.data);

      // Fetch associated file attachments
      const attachmentsResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest/attachments/${requestId}`);
      setFileAttachments(attachmentsResponse.data);

      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/approve/${requestId}`, { clicked: true });
      fetchApprovedRequests();
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
  };

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
      const imgWidth = pdfWidth - 20;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(data, 'PNG', 10, 10, imgWidth, imgHeight);
      pdf.save('requisition-form.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };


  return (
    <div className={`requist ${selectedRequest ? 'dim-background' : ''}`}>
     
      <h2>List of approved Order for Item</h2>
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

      <div className="approved-navigate-request">
        <ul>
          {filteredRequests.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
                Requisition Form of logistic <b>{request.department}</b> done on {new Date(request.createdAt).toDateString()}
              <label htmlFor=""><FaCheckCircle/> Approved</label>
              </p>

            </li>
          ))}
        </ul>
      </div>
     
      {selectedRequest && (
        <div className="approved-request-overlay">
          <div className="form-navigation">
            <button className='request-dowload-btn' onClick={downloadPDF}>Download Pdf</button>
            <button className='mark-received-btn' onClick={handleReceivedClick}>Mark as Received</button> 
            <label className='request-close-btn' onClick={() => setSelectedRequest(null)}><FaTimes /></label>
          </div>  
          
          <div className="request-details" >
            <div id='pdf-content'>
              <div className="image-request-recieved">
                <img src="/image/logo2.png" alt="Logo" className="logo" />
              </div>
              <div className="request-recieved-heading">
                <h1>WESTERN PROVINCE</h1>
                <h1>DISTRIC: NYABIHU</h1>
                <h1>HEALTH FACILITY: SHYIRA DISTRICT HOSPITAL</h1>
                <h1>DEPARTMENT: <span></span> </h1>
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
              <div className="approved-signature-section">
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

                <div className='daf-signature'>
                  <h3>DAF Office:</h3>
                  <label htmlFor="">Verified By:</label>
                  {dafUsers.map(user => (
                    <div key={user._id} className="daf-user">
                      <p>{user.firstName} {user.lastName}</p>
                      {user.signature ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${user.signature}`} alt={`${user.firstName} ${user.lastName} Signature`} />
                      ) : (
                        <p>No signature available</p>
                      )}
                    </div>
                  ))}
                </div>
                <div className='daf-signature'>
                  <h3>DG Office:</h3>
                  <label htmlFor="">Approved By:</label>
                  {dgUsers.map(user => (
                    <div key={user._id} className="daf-user">
                      <p>{user.firstName} {user.lastName}</p>
                      {user.signature ? (
                        <img src={`${process.env.REACT_APP_BACKEND_URL}/${user.signature}`} alt={`${user.firstName} ${user.lastName} Signature`} />
                      ) : (
                        <p>No signature available</p>
                      )}
                    </div>
                  ))}
                </div>

                {/* File Attachment Section 
                <div className="file-attachments">
                  <h3>File Attachments:</h3>
                  <div {...getRootProps({ className: 'dropzone' })}>
                    <input {...getInputProps()} />
                    <p>Drag 'n' drop some files here, or click to select files</p>
                  </div>
                  <ul>
                    {fileAttachments.map((file, index) => (
                      <li key={index}>
                        <a href={`http://localhost:5000/${file.path}`} target="_blank" rel="noopener noreferrer">
                          {file.originalname}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
                */}
              </div>
            </div> 
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

export default ApprovedRequests;
