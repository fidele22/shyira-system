// src/components/ApprovedRequests.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './approvedRequest.css'; // Import CSS for styling

const ApprovedRequests = () => {
  const [approvedRequests, setApprovedRequests] = useState([]);

  useEffect(() => {
    fetchApprovedRequests();
  }, []);

  const fetchApprovedRequests = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/approve');
      setApprovedRequests(response.data);
    } catch (error) {
      console.error('Error fetching approved requests:', error);
    }
  };

  return (
    <div className="approved-requests">
      <h2>Approved Requests</h2>
      {approvedRequests.length === 0 ? (
        <p>No approved requests found.</p>
      ) : (
        approvedRequests.map((request, index) => (
          <div key={index} className="approved-request">
            <h3>Request {index + 1}</h3>
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
                {request.items.map((item, idx) => (
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
                <p><strong>HOD Name:</strong> {request.hodName}</p>
                {request.hodSignature ? (
                  <img src={`http://localhost:5000/${request.hodSignature}`} alt="HOD Signature" />
                ) : (
                  <p>No HOD signature available</p>
                )}
              </div>
              <div className="logistic">
                <p><strong>Logistic Name:</strong> {request.logisticName}</p>
                {request.logisticSignature ? (
                  <img src={`http://localhost:5000/${request.logisticSignature}`} alt="Logistic Signature" />
                ) : (
                  <p>No logistic signature available</p>
                )}
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default ApprovedRequests;
