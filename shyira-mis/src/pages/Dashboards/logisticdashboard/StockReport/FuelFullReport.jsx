import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarPlaqueList = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [carPlaqueData, setCarPlaqueData] = useState([]);
  const [fuelStocks, setFuelStocks] = useState([]);
  const [error, setError] = useState('');


  useEffect(() => {
    fetchFuelStocks();
    
  }, []);

  const fetchFuelStocks = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fuel');
      setFuelStocks(response.data);
    } catch (error) {
      console.error('Error fetching fuel stocks:', error);
      setError('Error fetching fuel stocks');
    }
  };

  const fetchCarPlaqueData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/fuel/fuelFull-Report', {
        params: { startDate, endDate }
      });
      setCarPlaqueData(response.data.carPlaqueData || []);
      setError('');
    } catch (error) {
      console.error('Error fetching car plaque data:', error);
      setError('Failed to fetch data');
    }
  };

  return (
    <div className='fuel-full-report'>

      <h2>Fuel stock report generation</h2>

      {/* Input fields for startDate and endDate */}
      <div className='fuel-filter-input'>
        <div>
        <label htmlFor="">start date</label>
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
        />
        </div>
        <div>
        <label htmlFor="">start date</label>
        <input
          type="date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
        />
        </div>
      
        <button onClick={fetchCarPlaqueData}>Fetch Report</button>
      </div>

      {/* Conditionally render the table only if carPlaqueData is not empty */}
      {carPlaqueData.length > 0 ? (

        <div>
           <div className="imag-logo">
          <img src="/image/logo2.png" alt="Logo" className="log"  />
          </div>
          <div className="fuel-report-titles">
            <p>MINISTRY OF HEALTH</p>
            <p>DISTRICT OF NYABIHU</p>
            <p>HOSPITAL OF SHYIRA</p>
             <h2>MONTHLY FLEET AND FUEL UTILIZATION REPORT FROM <u>{startDate}</u> UP TO <u>{endDate}</u></h2>
            </div> 
       <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Register Number</th>
              <th>Mode of Vehicle</th>
              <th>Date of Reception</th>
              <th>Department</th>
              <th>Destination</th>
              <th>Liter of Fuel Consumed</th>
              <th>Unity cost per litre</th>
              <th>Total cost Consumed (frw)</th>
              <th>Distance Coverde using Km/l</th>
              <th>Total cost Repairs </th>
              <th>Full total cost</th>
            </tr>
          </thead>
          <tbody>
            {carPlaqueData.map((data, index) => (
              <tr key={index}>
                <td className='number'>{index+1}</td>
                <td>{data.registerNumber}</td>
                <td>{data.modeOfVehicle}</td>
                <td>{new Date(data.dateOfReception).toLocaleDateString()}</td>
                <td>{data.depart}</td>
                <td>{data.destination}</td>
                <td>{data.totalFuelConsumed}</td>
                <td>{data.pricePerUnit}</td>
                <td></td>
                <td>{data.distanceCoverde}</td>
                <td></td>
                <td></td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="report-footer">
          <div>
          <p>prepared by: </p>
      <h4>AMINI ABEDI</h4>
      <h4>LOGISTIC OFFICER</h4>
          </div>
            {/*
             <div >
          
      <p>Approved by: </p>
      <h4>AMINI ABEDI</h4>
      <h4>LOGISTIC OFFICER</h4>
      </div>*/}
         
      </div>
     
        </div>
       
      ) : (
        <p>{error || 'No data available for the selected date range.'}</p>
      )}
    </div>
  );
};

export default CarPlaqueList;
