import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaEdit,FaTimes, FaTimesCircle, FaCheck,
  FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import axios from 'axios';
import { jsPDF } from 'jspdf';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';

const StockDetails = ({ item,onClose}) => {
  const [stockDetails, setStockDetails] = useState([]);
  const [stockHistory, setStockHistory] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [editedStock, setEditedStock] = useState(null);
  //const [showStockDetails, setShowStockDetails] = useState(true);

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);

  const fetchStockDetails = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/getStockHistory/${item._id}`);
      setStockDetails(response.data);
      setShowDetails(true);
      setShowHistory(false); // Close history if it was open
    } catch (error) {
      console.error('Error fetching stock details:', error);
    }
  };

  const fetchStockHistory = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/stocks/history/${item._id}`, {
        params: { startDate, endDate }
      });
      setStockHistory(response.data);
      setShowHistory(true);
      setShowDetails(false); // Close details if it was open
    } catch (error) {
      console.error('Error fetching stock history:', error);
      alert('Fetching stock history failed');
    }
  };

  const handleEditStock = (stock) => {
    setEditedStock({ ...stock });
  };

  const handleInputChange = (e, section, field) => {
    const { value } = e.target;
    setEditedStock((prevStock) => ({
      ...prevStock,
      [section]: {
        ...prevStock[section],
        [field]: value,
      },
    }));
  };

  const handleClose = () => {
    onClose(); // Call the onClose function passed from the parent
  };

  const handleUpdateStock = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/stocks/${editedStock._id}`, editedStock);
      setStockDetails(stockDetails.map((entry) => (entry._id === editedStock._id ? editedStock : entry)));
      setModalMessage('Update stock done successful');
      setIsSuccess(true); // Set the success state
      setShowModal(true); // Show the modal
    } catch (error) {
      console.error('Error updating stock:', error);
 
      setModalMessage('Failed to update stock');
      setIsSuccess(true); // Set the success state
      setShowModal(true); // Show the modal
    }
  };

  const downloadPDF = async () => {
    const input = document.getElementById('history-content');
    if (!input) {
      console.error('Element with ID history-content not found');
      return;
    }

    try {
      const canvas = await html2canvas(input);
      const data = canvas.toDataURL('image/png');

      const pdf = new jsPDF();
      const imgProps = pdf.getImageProperties(data);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth - 15;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      pdf.addImage(data, 'PNG', 5, 5, imgWidth, imgHeight);
      pdf.save('Fiche de stock.pdf');
    } catch (error) {
      console.error('Error generating PDF:', error);
    }
  };

  const downloadExcel = () => {
    const table = document.getElementById("history-content").getElementsByTagName("table")[0];

    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.table_to_sheet(table);

    XLSX.utils.book_append_sheet(wb, ws, "Stock History");

    XLSX.writeFile(wb, `Stock_History_${stockDetails[0]?.itemId?.name}_${startDate}_to_${endDate}.xlsx`);
  };
 
  return (
    <div className="stockDetails-overlay">
      <div className="stock-details">
        <div className="detail-history">
        <button onClick={fetchStockDetails} className='view-details-btn'>View stock</button>
        <div className="history-filter">
          <label>
            Start Date:
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </label>
          <label>
            End Date:
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </label>
          <button onClick={fetchStockHistory} className='view-history-btn'>View History</button>
        </div>
        <p className="detail-close-btn" onClick={handleClose}><FaTimes /></p>
        </div>
        
        {showDetails && (
          <>
       
            <h2>Stock Details for {item.name}</h2>
            <table>
              <thead>
                <tr>
                  <th rowSpan={2}>Date</th>
                  <th colSpan="3">ENTRY</th>
                  <th colSpan="3">EXIT</th>
                  <th colSpan="3">BALANCE</th>
                  <th rowSpan={2}>Actions</th>
                </tr>
                <tr>
                 
                  <th>Quantity</th>
                  <th>Price per Unit</th>
                  <th>Total Amount</th>
                  <th>Quantity</th>
                  <th>Price per Unit</th>
                  <th>Total Amount</th>
                  <th>Quantity</th>
                  <th>Price per Unit</th>
                  <th>Total Amount</th>
                </tr>
              </thead>
              <tbody>
                {stockDetails.map((entry, index) => (
                  <tr key={index}>
                    <td>{new Date(entry.updatedAt).toLocaleString()}</td>
                    <td>
                      {editedStock && editedStock._id === entry._id ? (
                        <input
                          type="number"
                          name="quantity"
                          value={editedStock.entry.quantity}
                          onChange={(e) => handleInputChange(e, 'entry', 'quantity')}
                        />
                      ) : (
                        entry.entry.quantity
                      )}
                    </td>
                    <td>
                      {editedStock && editedStock._id === entry._id ? (
                        <input
                          type="number"
                          name="pricePerUnit"
                          value={editedStock.entry.pricePerUnit}
                          onChange={(e) => handleInputChange(e, 'entry', 'pricePerUnit')}
                        />
                      ) : (
                        entry.entry.pricePerUnit
                      )}
                    </td>
                    <td>{entry.entry.totalAmount}</td>
                    <td>
                      {editedStock && editedStock._id === entry._id ? (
                        <input
                          type="number"
                          name="quantity"
                          value={editedStock.exit.quantity}
                          onChange={(e) => handleInputChange(e, 'exit', 'quantity')}
                        />
                      ) : (
                        entry.exit.quantity
                      )}
                    </td>
                    <td>{entry.exit.pricePerUnit}</td>
                    <td>{entry.exit.totalAmount}</td>
                    <td>{entry.balance.quantity}</td>
                    <td>{entry.balance.pricePerUnit}</td>
                    <td>{entry.balance.totalAmount}</td>
                    <td>
                      {editedStock && editedStock._id === entry._id ? (
                        <>
                          <button className='detail-update-btn' onClick={handleUpdateStock}>Update</button>
                          <button className='detail-cancel-btn' onClick={() => setEditedStock(null)}>Cancel</button>
                        </>
                      ) : (
                        <button className='detail-edit-btn' onClick={() => handleEditStock(entry)}>Edit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="detail-close-btn" onClick={() => setShowDetails(false)}><FaTimes /></p>
          </>
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

        {showHistory && (
          <div className="stockHistory-overlay">
            <div className="stock-history">
              <div id='history-content'>
              <div className="imag-logo">
            <img src="/image/logo2.png" alt="Logo" className="log" />
          </div>
                <h2>Fiche De Stock</h2>
                <h3>Article de stock <span>{item.name}</span></h3>
                <h4>Code:</h4>
                <h4>Stock History from {new Date(startDate).toLocaleDateString()} to {new Date(endDate).toLocaleDateString()}</h4>
                <table>
                  <thead>
                    <tr>
                      <th colSpan="10">Quantity Maximum : {stockDetails[0]?.itemId?.maximum}</th>
                    </tr>
                    <tr>
                      <th colSpan="10">Stock d'alerte: {stockDetails[0]?.itemId?.minimum}</th>
                    </tr>
                    <tr>
                      <th>Date</th>
                      <th colSpan="3">ENTRY</th>
                      <th colSpan="3">EXIT</th>
                      <th colSpan="3">BALANCE</th>
                    </tr>
                    <tr>
                      <th>Updated on</th>
                      <th>Quantity</th>
                      <th>Price per Unit</th>
                      <th>Total Amount</th>
                      <th>Quantity</th>
                      <th>Price per Unit</th>
                      <th>Total Amount</th>
                      <th>Quantity</th>
                      <th>Price per Unit</th>
                      <th>Total Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stockHistory.map((entry, index) => (
                      <tr key={index}>
                        <td>{new Date(entry.updatedAt).toLocaleString()}</td>
                        <td>{entry.entry.quantity}</td>
                        <td>{entry.entry.pricePerUnit}</td>
                        <td>{entry.entry.totalAmount}</td>
                        <td>{entry.exit.quantity}</td>
                        <td>{entry.exit.pricePerUnit}</td>
                        <td>{entry.exit.totalAmount}</td>
                        <td>{entry.balance.quantity}</td>
                        <td>{entry.balance.pricePerUnit}</td>
                        <td>{entry.balance.totalAmount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <button className='download-history-btn' onClick={downloadPDF}>Download PDF</button>
              <button className='download-exl-btn' onClick={downloadExcel}>Download Excel</button>
              <p className='history-close-btn' onClick={() => setShowHistory(false)}><FaTimes /></p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StockDetails;
