import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaEdit,FaTimes, FaTimesCircle, FaCheck,
  FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import axios from 'axios';
import './fuelrequest.css'; // Make sure to add CSS for styling

const RequisitionForm = () => {
  const [requesterName, setRequesterName] = useState('');
  const [carPlaque, setCarPlaque] = useState('');
  const [kilometers, setKilometers] = useState('');
  const [remainingLiters, setRemainingLiters] = useState('');
  const [average, setAverage] = useState('');
  const [quantityRequested, setQuantityRequested] = useState('');
  const [quantityReceived, setQuantityReceived] = useState('');
  const [destination, setDestination] = useState('');
  const [reasonOption, setReasonOption] = useState('');
  const [file, setFile] = useState(null); // New state for file
  const [user, setUser] = useState(null);
  const [fuelType, setFuelType] = useState('');
  const [error, setError] = useState(null);
  const [carOptions, setCarOptions] = useState([]);
  const [destinationOptions, setDestinationOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);


  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const carResponse = await axios.get('http://10.20.0.99:5000/api/forms-data/cars');
        setCarOptions(carResponse.data);

        const reasonResponse = await axios.get('http://10.20.0.99:5000/api/forms-data/reasons');
        setReasonOptions(reasonResponse.data);

              // Fetch fuel types and set the first one as default
              const fuelResponse = await axios.get('http://10.20.0.99:5000/api/fuel');
              if (fuelResponse.data.length > 0) {
                setFuelType(fuelResponse.data[0].fuelType);
              }

      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };

    fetchOptions();
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!requesterName || !carPlaque || !kilometers || !quantityRequested) {
      alert("Please fill in all required fields.");
      return;
    }
  
    const formData = new FormData();
    formData.append('requesterName', requesterName);
    formData.append('carPlaque', carPlaque);
    formData.append('kilometers', kilometers);
    formData.append('remainingLiters', remainingLiters);
    formData.append('average', average);
    formData.append('quantityRequested', quantityRequested);
    formData.append('quantityReceived', quantityReceived);
    formData.append('destination', destination);
    formData.append('fuelType', fuelType); // Automatically selected fuel type
    formData.append('reasonOption', reasonOption);
    formData.append('hodName', user ? `${user.firstName} ${user.lastName}` : '');
    formData.append('hodSignature', user && user.signature ? user.signature : '');
    if (file) {
      formData.append('file', file);
    }
  
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
 
      const response = await axios.post('http://10.20.0.99:5000/api/fuel-requisition/submit', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
  
      console.log('Response:', response.data); // Debugging
      setModalMessage('Submit requisition to logistic successfully');
      setIsSuccess(true); // Set the success state
      setShowModal(true); 
      
      setRequesterName('');
      setCarPlaque('');
      setKilometers('');
      setAverage('');
      setRemainingLiters('');
      setQuantityRequested('');
      setQuantityReceived('');
      setDestination('');
      setReasonOption('');
      setFile(null);
    } catch (error) {
      console.error('Error submitting requisition:', error); // Debugging
      setModalMessage('Failed to submit requisition');
      setIsSuccess(false); // Set the success state
      setShowModal(true); 
      
    }
  };
  
  
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
        const response = await axios.get('http://10.20.0.99:5000/api/users/profile', {
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

  return (
    <div className="requisition-form">
   
     
        <form onSubmit={handleSubmit}>
        <div className="image-logo">
            <img src="/image/logo2.png" alt="Logo" className="logo" />
          </div>
         <h2>Fuel Requisition Form</h2> 
        <div className="left-content">
          <div className="form-group">
            <label htmlFor="requesterName">Name of Requester:</label>
            <input
              type="text"
              id="requesterName"
              value={requesterName}
              onChange={(e) => setRequesterName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="carPlaque">Plaque of Car:</label>
            <select
              id="carPlaque"
              value={carPlaque}
              onChange={(e) => setCarPlaque(e.target.value)}
              required
            >
              <option value="">Select Plaque</option>
              {carOptions.map((car) => (
                <option key={car._id} value={car.registerNumber}>
                  {car.registerNumber}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="kilometers">Kilometers:</label>
            <input
              type="number"
              id="kilometers"
              value={kilometers}
              onChange={(e) => setKilometers(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="remainingliters">Remaining Liters:</label>
            <input
              type="number"
              id="remainingliters"
              value={remainingLiters}
              onChange={(e) => setRemainingLiters(e.target.value)}
              required
            />
          </div>

        

          <div className="form-group">
            <label htmlFor="quantityRequested">Quantity Requested (liters):</label>
            <input
              type="number"
              id="quantityRequested"
              value={quantityRequested}
              onChange={(e) => setQuantityRequested(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="quantityReceived">Quantity Received (liters):</label>
            <input
              type="number"
              id="quantityReceived"
              value={quantityReceived}
              
            />
          </div>
          </div>
    

          <div className="right-content">
            <div className="form-group">
              <label htmlFor="fuelType">Fuel Type:</label>
              <input
                type="text"
                id="fuelType"
                value={fuelType}
                readOnly
                required
              />
            </div>
            </div>
      <div className="right-content">
        <div className="form-group">
        <div className="form-group">
            <label htmlFor="destination">Previous Destination Report:</label>
            <input
              type="file"
              id="destination"
              onChange={handleFileChange}
            />
          </div>
        </div>
       </div>
        <div className="form-group">
          <button type="submit" className="submit-button">Submit</button>
        </div>
        </form>
       
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


        <div>
           
            {user ? (
              <>
               <label htmlFor="hodName">Name of {user.positionName}</label>
                <p>{user.firstName} {user.lastName}</p>
               
                {user.signature ? (
                  <img src={`http://localhost:5000/${user.signature}`} alt="Signature" />
                ) : (
                  <p>No signature available</p>
                )}
              </>
            ) : (
              <p>Loading user profile...</p>
            )}
          </div>


       
      </div>
    
  );
};

export default RequisitionForm;
