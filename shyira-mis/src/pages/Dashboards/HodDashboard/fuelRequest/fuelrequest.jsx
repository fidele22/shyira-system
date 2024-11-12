import React, { useState, useEffect } from 'react';
import { FaQuestionCircle, FaEdit, FaTimes, FaTimesCircle, FaCheck, FaCheckCircle, FaCheckDouble, FaCheckSquare } from 'react-icons/fa';
import axios from 'axios';
import Swal from 'sweetalert2'; 
import './fuelrequest.css';

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
  const [file, setFile] = useState(null);
  const [user, setUser] = useState(null);
  const [fuelType, setFuelType] = useState('');
  const [availableBalance, setAvailableBalance] = useState(0);
  const [error, setError] = useState(null);
  const [carOptions, setCarOptions] = useState([]);
  const [reasonOptions, setReasonOptions] = useState([]);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const carResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/forms-data/cars`);
        setCarOptions(carResponse.data);

        const fuelResponse = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fuel`);
        if (fuelResponse.data.length > 0) {
          setFuelType(fuelResponse.data[0].fuelType);
          fetchFuelBalance(fuelResponse.data[0].fuelType);
        }
      } catch (error) {
        console.error('Error fetching options:', error);
      }
    };
    fetchOptions();
  }, []);

  const fetchFuelBalance = async (type) => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fuel?fuelType=${type}`);
      setAvailableBalance(response.data.quantity);
    } catch (error) {
      console.error('Error fetching fuel balance:', error);
      setError('Error fetching fuel balance');
    }
  };

  const handleFuelTypeChange = (event) => {
    const selectedFuelType = event.target.value;
    setFuelType(selectedFuelType);
    fetchFuelBalance(selectedFuelType);
  };

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
  
    if (!requesterName || !carPlaque || !kilometers || !quantityRequested) {
      alert("Please fill in all required fields.");
      return;
    }

    if (parseInt(quantityRequested) > availableBalance) {
      Swal.fire({
        icon: 'error',
        title: 'Insufficient Quantity',
        text: `Requested quantity (${quantityRequested} liters) exceeds available stock of ${availableBalance} liters.`,
      });
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
    formData.append('fuelType', fuelType);
    formData.append('reasonOption', reasonOption);
    formData.append('hodName', user ? `${user.firstName} ${user.lastName}` : '');
    formData.append('hodSignature', user && user.signature ? user.signature : '');
    if (file) {
      formData.append('file', file);
    }

    try {
      const currentTab = sessionStorage.getItem('currentTab');
      if (!currentTab) {
        setError('No tab ID found in sessionStorage');
        return;
      }
      const token = sessionStorage.getItem(`token_${currentTab}`);
      if (!token) {
        setError('Token not found');
        return;
      }

      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/fuel-requisition/submit`, formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      Swal.fire({
        title: 'Success!',
        text: 'Submit fuel requisition to logistic successfully',
        icon: 'success',
        confirmButtonText: 'OK',
        customClass: { popup: 'custom-swal' }
      });
      
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
      console.error('Error submitting requisition:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to submit fuel requisition',
        icon: 'error',
        confirmButtonText: 'OK',
        customClass: { popup: 'custom-swal' }
      });
    }
  };

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const currentTab = sessionStorage.getItem('currentTab');
        if (!currentTab) {
          setError('No tab ID found in sessionStorage');
          return;
        }
        const token = sessionStorage.getItem(`token_${currentTab}`);
        if (!token) {
          setError('Token not found');
          return;
        }

        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
          headers: { 'Authorization': `Bearer ${token}` },
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
        <h3>Fuel Requisition Form</h3>
        
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

          <div className="form-group">
            <label htmlFor="availableBalance">Available Balance:</label>
            <input
              type="number"
              id="availableBalance"
              value={availableBalance}
              readOnly
              required
            />
          </div>

          <button type="submit" className="submit-btn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default RequisitionForm;
