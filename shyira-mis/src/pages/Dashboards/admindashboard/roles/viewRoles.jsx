import React, { useState, useEffect } from 'react';
import AddNewPosition from './AddPosition'
import { FaEdit, FaTrash,FaTimes } from 'react-icons/fa';
import axios from 'axios';
import '../css/service.css';

const ViewPosition = () => {
  const [positions, setPositions] = useState([]);
  const [editPosition, setEditPosition] = useState(null);
  const [positionName, setPositionName] = useState('');

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/positions');
        setPositions(response.data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };

    fetchPositions();
  }, []);

  const handleEditClick = (position) => {
    setEditPosition(position);
    setPositionName(position.name);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/positions/${editPosition._id}`, {
        name: positionName,
      });
      setEditPosition(null);
      setPositionName('');
      // Fetch updated positions
      const response = await axios.get('http://localhost:5000/api/positions');
      setPositions(response.data);
    } catch (error) {
      console.error('Error updating position:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/positions/${id}`);
      console.log('Delete response:', response.data); // Log the response
      // Fetch updated positions
      const fetchUpdatedPositions = await axios.get('http://localhost:5000 /api/positions');
      setPositions(fetchUpdatedPositions.data);
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  };
  
  return (
    <div className="service-data">
     
      <div className="service-table-data">
      <h1>Positions Managment</h1>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {positions.map((position, index) => (
              <tr key={position._id}>
                <td>{index + 1}</td>
                <td>{position.name}</td>
                <td>
                  <button onClick={() => handleEditClick(role)}><FaEdit size={24} color='black'/></button>
                  <button onClick={() => handleDelete(role._id)}><FaTrash size={24} color='red'/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {editPosition && (
        <div className="edit-form">
          <h2>Edit Role</h2>
          <input
            type="text"
            value={positionName}
            onChange={(e) => setRoleName(e.target.value)}
          />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditRole(null)}>Cancel</button>
        </div>
      )}

      <div className="addnew-role">
        <AddNewRole />
      </div>
    </div>
  );
};

export default ViewPosition;
