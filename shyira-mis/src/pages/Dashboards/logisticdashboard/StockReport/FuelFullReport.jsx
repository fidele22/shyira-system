import React, { useState, useEffect } from 'react';
import axios from 'axios';

const CarPlaqueList = () => {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [carPlaqueData, setCarPlaqueData] = useState([]);
  const [fuelStocks, setFuelStocks] = useState([]);
  const [pricePerUnit, setPricePerUnit] = useState(null); // To store the price per unit
  const [error, setError] = useState('');

  useEffect(() => {
    fetchFuelStocks();
  }, []);

  // Fetch fuel stock data and set a default price per unit
  const fetchFuelStocks = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fuel`);
      setFuelStocks(response.data);
      if (response.data.length > 0) {
        setPricePerUnit(response.data[0].pricePerUnit); // Set price per unit from the first fuel stock
      }
    } catch (error) {
      console.error('Error fetching fuel stocks:', error);
      setError('Error fetching fuel stocks');
    }
  };

  // Fetch car plaque data based on date range
  const fetchCarPlaqueData = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/fuel/fuelFull-Report`, {
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
      <h2>Fuel Stock Report Generation</h2>

      <div className='fuel-filter-input'>
        <div>
          <label>Start Date</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
        </div>
        <div>
          <label>End Date</label>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
        </div>
        <button onClick={fetchCarPlaqueData}>Fetch Report</button>
      </div>

      {carPlaqueData.length > 0 ? (
        <div>
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
                <th>Unity Cost per Litre</th>
                <th>Total Cost Consumed (FRW)</th>
                <th>Distance Covered (Km/L)</th>
                <th>Total Cost Repairs</th>
                <th>Full Total Cost</th>
              </tr>
            </thead>
            <tbody>
              {carPlaqueData.map((data, index) => {
                const totalCostConsumed = (pricePerUnit && data.totalFuelConsumed) ? (pricePerUnit * data.totalFuelConsumed) : 0;
                const fullTotalCost = totalCostConsumed + (data.totalCostRepairs || 0);

                return (
                  <tr key={index}>
                    <td>{index + 1}</td>
                    <td>{data.registerNumber}</td>
                    <td>{data.modeOfVehicle}</td>
                    <td>{new Date(data.dateOfReception).toLocaleDateString()}</td>
                    <td>{data.depart}</td>
                    <td>{data.destination}</td>
                    <td>{data.totalFuelConsumed}</td>
                    <td>{pricePerUnit}</td> 
                    <td>{totalCostConsumed}</td> 
                    <td>{data.distanceCovered}</td>
                    <td>{data.totalCostRepairs}</td> 
                    <td>{fullTotalCost}</td> 
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <p>{error || 'No data available for the selected date range.'}</p>
      )}
    </div>
  );
};

export default CarPlaqueList;
