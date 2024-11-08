import React, { useState, useEffect } from 'react';
import AddnewService from './addService'
import { FaEdit, FaTrash,FaTimes } from 'react-icons/fa';
import '../css/service.css'
import axios from 'axios';

const ViewService = () => {
  
    


  const [services, setServices] = useState([]);
  const [editService, setEditService] = useState(null);
  const [serviceName, setServiceName] = useState('');


  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services`);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching items:', error);
      }
    };

    fetchServices();
  }, []);

  
  const handleEditClick = (service) => {
    setEditService(service);
    setServiceName(service.name);
  };

  const handleUpdate = async () => {
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/api/services/${editService._id}`, {
        name: serviceName,
      });
      setEditService(null);
      setServiceName('');
      // Fetch updated positions
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services`);
      setServices(response.data);
    } catch (error) {
      console.error('Error updating position:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(`${process.env.REACT_APP_BACKEND_URL}/api/services/${id}`);
      console.log('Delete response:', response.data); // Log the response
      // Fetch updated positions
      const fetchUpdatedPositions = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services`);
      setServices(fetchUpdatedPositions.data);
    } catch (error) {
      console.error('Error deleting position:', error);
    }
  };
  

  return (
    <div className="service-data">
       
        <div className="service-table-data">
        <h1>Services Managment</h1>
        <table className='table'>
          <thead>
            <tr>
              <th>No</th>
              <th>Name</th>
              <th>Action</th>
             
              
            </tr>
          </thead>
          <tbody>
            {services.map((service, index) => (
              <tr key={service._id}>
                <td>{index+1}</td>
                <td>{service.name}</td>
                <td>
                <button onClick={() => handleEditClick(service)}><FaEdit size={16} color='black'/></button>
                <button onClick={() => handleDelete(service._id)} ><FaTrash size={16} color='red'/></button>

                </td>
               
               
                
              </tr>
            ))}
          </tbody>
        </table>
        </div>
         
       
   
      {editService && (
          <div className="editing-userdata-ovelay">
        <div className="edit-form">
          <h2>Edit Service</h2>
          <input
            type="text"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
          <button onClick={handleUpdate}>Update</button>
          <button className='cancel-btn' onClick={() => setEditService(null)}>Cancel</button>
        </div>
        </div>
      )}
      <div className="addnew-service">
        <AddnewService />
      </div>
    </div>
  );
};

export default ViewService;