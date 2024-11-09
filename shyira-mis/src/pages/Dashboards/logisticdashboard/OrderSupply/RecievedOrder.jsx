import React, { useState, useEffect } from 'react';
import { FaCheckCircle, FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import './modelMessage.css';

const ApprovedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [searchParams, setSearchParams] = useState({
    department: '',
    date: ''
  });

  const [logisticUsers, setLogisticUsers] = useState([]);
  const [dafUsers, setDafUsers] = useState([]);
  const [dgUsers, setDgUsers] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(5); // Set items per page
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApprovedRequests();
  }, []);
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

  useEffect(() => {
    // Update total pages when filteredRequests change
    setTotalPages(Math.ceil(filteredRequests.length / itemsPerPage));
  }, [filteredRequests, itemsPerPage]);

  const fetchApprovedRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest/received-order`);
      setRequests(response.data);
      setFilteredRequests(response.data);
    } catch (error) {
      console.error('Error fetching approved requests:', error);
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
    const { supplierName, date } = searchParams;
    const filtered = requests.filter(request => {
      return (!supplierName || request.supplierName.toLowerCase().includes(supplierName.toLowerCase())) &&
             (!date || new Date(request.date).toDateString() === new Date(date).toDateString());
    });
    setFilteredRequests(filtered);
    setCurrentPage(1); // Reset to first page after filtering
  };

  const handleRequestClick = async (requestId) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/LogisticRequest/received/${requestId}`);
      setSelectedRequest(response.data);
    } catch (error) {
      console.error('Error fetching request details:', error);
    }
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
      const imgWidth = pdf.internal.pageSize.getWidth();
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(data, 'PNG', 10, 10, imgWidth - 20, imgHeight);
      pdf.save('requisition-form.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  // Pagination helpers
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRequests.slice(indexOfFirstItem, indexOfLastItem);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className={`requist ${selectedRequest ? 'dim-background' : ''}`}>
     
      <form onSubmit={handleSearchRequest}>
        <div className="search-form">
        <div className='search-supplier'>
          <label htmlFor="">Search by supplier Name</label>
          <input
            type="text"
            name="supplierName"
            placeholder="Search by Supplier Name"
            value={searchParams.supplierName}
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
          <h2>Requisition of fuel form logistic office received</h2>
        </div>
        <ul>
          {currentItems.slice().reverse().map((request, index) => (
            <li key={index}>
              <p onClick={() => handleRequestClick(request._id)}>
                Requisition Form from <b>logistic office</b> order of ITEMs done on {new Date(request.createdAt).toDateString()}
                <span className="status-badge">Received</span>
              </p>
            </li>
          ))}
        </ul>
        <div className="pagination-buttons">
          <button onClick={prevPage} disabled={currentPage === 1}>Previous</button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={nextPage} disabled={currentPage === totalPages}>Next</button>
        </div>
      </div>

      {selectedRequest && (
        <div className="approved-request-overlay">
          <div className="form-navigation">
            <button className='request-dowload-btn' onClick={downloadPDF}>Download Pdf</button>
            <label className='request-close-btn' onClick={() => setSelectedRequest(null)}><FaTimes /></label>
          </div>  
          <div className="request-details" >
            <div id="pdf-content">

           
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
                <div className='logistic-signature'>
                  <h3>Logistic Office:</h3>
                  <label htmlFor="">Received By:</label>
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
          </div>
        </div>
        </div>
      )}
    </div>
  );
};

export default ApprovedRequests;
