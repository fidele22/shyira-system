import React, { useState, useEffect } from 'react';
import AddNewDepartment from './AddDepartment'
import { FaEdit, FaTrash,FaTimes } from 'react-icons/fa';
import '../css/service.css'
import axios from 'axios';

const ViewDepartment = () => {
  
    

  const [departments, setDepartments] = useState([]);
  const [editDepartment, setEditDepartment] = useState(null);
  const [departmentName, setDepartmentName] = useState('');


  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchDepartments();
  }, []);

  const handleEditClick = (department) => {
    setEditDepartment(department);
    setDepartmentName(department.name);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`http://localhost:5000/api/departments/${editDepartment._id}`, {
        name: departmentName,
      });
      setEditDepartment(null);
      setDepartmentName('');
      // Fetch updated positions
      const response = await axios.get('http://localhost:5000/api/departments');
      setDepartments(response.data);
    } catch (error) {
      console.error('Error updating position:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`http://localhost:5000/api/departments/${id}`);
      console.log('Delete response:', response.data); // Log the response
      // Fetch updated positions
      const fetchUpdatedPositions = await axios.get('http://localhost:5000/api/departments');
      setDepartments(fetchUpdatedPositions.data);
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  };

  return (
    <div className="service-data">
        
        <div className="service-table-data">
        <h1>Departments List</h1>
        <table>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Action</th>
             
              
            </tr>
          </thead>
          <tbody>
            {departments.map((department, index) => (
              <tr key={department._id}>
                <td>{index+1}</td>
                <td>{department.name}</td>
                <td>
                <button onClick={() => handleEditClick(department)}><FaEdit size={24} color='black'/></button>
                <button onClick={() => handleDelete(department._id)}><FaTrash size={24} color='red'/></button>

                </td>
               
               
                
              </tr>
            ))}
          </tbody>
        </table>
        </div>

        {editDepartment && (
        <div className="edit-form">
          <h2>Edit Department</h2>
          <input
            type="text"
            value={departmentName}
            onChange={(e) => setDepartmentName(e.target.value)}
          />
          <button onClick={handleUpdate}>Update</button>
          <button onClick={() => setEditDepartment(null)}>Cancel</button>
        </div>
      )}  

      <div className="addnew-department">
      <AddNewDepartment />
      </div>
      
    </div>
  );
};

export default ViewDepartment;