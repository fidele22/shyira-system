import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './viewItems.css';

const DataDisplay = ({ onItemSelect }) => {
  const [data, setData] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://10.20.0.99:5000/api/stocks');
        setData(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  // Filter data based on search query
  const filteredData = data.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className='hod-items'>
      <h2>Items list Available</h2>

      {/* Search input field */}
      <input
        type="text"
        placeholder="Search by name..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
      />

      <table>
        <thead>
          <tr>
            <th>Item Name</th>
          {/*<th>Quantity Available</th>*/}  
          </tr>
        </thead>
        <tbody>
          {filteredData.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
             {/*<td>{item.quantity}</td>*/} 
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataDisplay;
