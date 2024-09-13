import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import axios from 'axios';
import { FaQuestionCircle, FaEdit,FaTimes, FaTimesCircle, FaCheck,
  FaCheckCircle, FaCheckDouble, FaFileExcel,FaCheckSquare } from 'react-icons/fa';


const ExcelUpload = () => {
  const [file, setFile] = useState(null);



  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);


 //uploading excel items logic


const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};

const handleUpload = async () => {
  const reader = new FileReader();
  reader.onload = async (e) => {
    const data = new Uint8Array(e.target.result);
    const workbook = XLSX.read(data, { type: 'array' });
    const jsonData = XLSX.utils.sheet_to_json(workbook.Sheets[workbook.SheetNames[0]]);

    console.log(jsonData); // Log the data to see its structure

    try {
      await axios.post('http://localhost:5000/api/uploadData', jsonData, {
        headers: {
          'Content-Type': 'application/json'
        }
        
      });
  
      setModalMessage('upload items in stock successful');
      setIsSuccess(true); // Set the success state
      setShowModal(true); // Show the modal
    } catch (error) {
      console.error('Error uploading data:', error);
    
      setModalMessage('Failed to upload items data');
      setIsSuccess(false); // Set the error state
      setShowModal(true); // Show the modal
    }
  };
  reader.readAsArrayBuffer(file);
  };

  return (
    <div className="import-container">
         <div className="upload-data">
        <label htmlFor="">Here add items in stock with its data , with uploading file of .xlsx, .xls format</label>
       < input type="file" accept=".xlsx, .xls" onChange={handleFileChange}    required />
         <button className='upload-btn' onClick={handleUpload}> <FaFileExcel size={34} />Upload</button>
      
      <div className="upload-data-info">
      <label htmlFor="">Here is how excel column must be structured</label> 
      <div className="image-request-recieved">
          <img src="/image/excel.png" alt="Logo" className="logo" />
          </div>
      </div>
      </div>
     
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

export default ExcelUpload;
