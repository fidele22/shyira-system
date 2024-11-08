import React, { useState } from 'react';
import './registercar.css'
import '../addItem/additem.css'
function CarRegistrationForm() {
  const [formData, setFormData] = useState({
    registerNumber: '',
    modeOfVehicle: '',
    dateOfReception: '',
    depart: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/forms-data/cars`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        alert('Car registered successfully!');
        setFormData({
          registerNumber: '',
          modeOfVehicle: '',
          dateOfReception: '',
          depart: ''
        });
      } else {
        alert('Failed to register car');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while registering the car.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className='addcar'>
      <div >
        <label>Register Number (Plaque):</label>
        <input
          type="text"
          name="registerNumber"
          value={formData.registerNumber}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Mode of Vehicle:</label>
        <input
          type="text"
          name="modeOfVehicle"
          value={formData.modeOfVehicle}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Date of Reception:</label>
        <input
          type="date"
          name="dateOfReception"
          value={formData.dateOfReception}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Depart:</label>
        <input
          type="text"
          name="depart"
          value={formData.depart}
          onChange={handleChange}
          required
        />
      </div>
      <button type="submit">Register Car</button>
    </form>
  );
}

export default CarRegistrationForm;
