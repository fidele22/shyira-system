import React, { useEffect, useState } from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { FaEdit, FaTrash,FaTimes } from 'react-icons/fa';
import AddNewCar from './addcarplaque'
function CarList() {
    const [cars, setCars] = useState([]);
    const [editCarId, setEditCarId] = useState(null);
    const [showAddCarForm, setShowAddCarForm] = useState(false); 
    const [formData, setFormData] = useState({
      registerNumber: '',
      modeOfVehicle: '',
      dateOfReception: '',
      depart: ''
    });
  
    useEffect(() => {
      fetchCars();
    }, []);
  
    const fetchCars = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/forms-data/cars');
        const data = await response.json();
        setCars(data);
      } catch (error) {
        console.error('Error fetching car data:', error);
      }
    };
  
    const handleDelete = async (id) => {
      try {
        await fetch(`http://localhost:5000/api/forms-data/cars/${id}`, {
          method: 'DELETE'
        });
        fetchCars(); // Refresh car list after deletion
      } catch (error) {
        console.error('Error deleting car:', error);
      }
    };
  
    const handleEditClick = (car) => {
      setEditCarId(car._id);
      setFormData({
        registerNumber: car.registerNumber,
        modeOfVehicle: car.modeOfVehicle,
        dateOfReception: car.dateOfReception.split('T')[0], // Format date for input
        depart: car.depart
      });
    };
  
    const handleEditSubmit = async (e) => {
      e.preventDefault();
      try {
        await fetch(`http://localhost:5000/api/forms-data/cars/${editCarId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData)
        });
        setEditCarId(null);
        fetchCars(); // Refresh car list after update
      } catch (error) {
        console.error('Error updating car:', error);
      }
    };
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value
      });
    };
  
    return (
      <div className='veiw-car-info'>


        {editCarId ? (
          <form onSubmit={handleEditSubmit} className='addcar'>
            <h2>Edit car information</h2>
            <div>
              <label>Register Number (Plaque)</label>
              <input
                type="text"
                name="registerNumber"
                value={formData.registerNumber}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Mode of Vehicle</label>
              <input
                type="text"
                name="modeOfVehicle"
                value={formData.modeOfVehicle}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Date of Reception</label>
              <input
                type="date"
                name="dateOfReception"
                value={formData.dateOfReception}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label>Depart</label>
              <input
                type="text"
                name="depart"
                value={formData.depart}
                onChange={handleChange}
                required
              />
            </div>
            <button type="submit" className='update-car'>Update Car</button>
            <button type="button" onClick={() => setEditCarId(null)} className='cancel-edit-btn'>  <FaTimes size={32} /></button>
          </form>
        ) : (
          cars.length > 0 ? (
            <div className="car-info">
              <div className="title">
              <div className='add-item'>
              <button className='add-new-user-btn' onClick={() => setShowAddCarForm(true)}>Add new Item</button>
          
             </div>

              <h2>Registered Cars</h2>
              </div>
       
       
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>Register Number (Plaque)</th>
                  <th>Mode of Vehicle</th>
                  <th>Date of Reception</th>
                  <th>Depart</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {cars.map((car,index) => (
                  <tr key={car._id}>
                    <td>{index+1}</td>
                    <td>{car.registerNumber}</td>
                    <td>{car.modeOfVehicle}</td>
                    <td>{new Date(car.dateOfReception).toLocaleDateString()}</td>
                    <td>{car.depart}</td>
                    <td>
                      <label htmlFor="" className='edit-icon' onClick={() => handleEditClick(car)}>
                        <i className="fas fa-edit"></i> </label> 
                      
                     <label htmlFor=""className='delete-btn' onClick={() => handleDelete(car._id)}>
                        <i className="fas fa-trash-alt"></i> 
                        </label> 
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          ) : (
            <p>No cars registered yet.</p>
          )
        )}
            {/* Add User Form Overlay */}
  {showAddCarForm && (
          <div className="add-overlay">
            <div className="add-user-form-container">
              <button className="close-form-btn" onClick={() => setShowAddCarForm(false)}>
                <FaTimes size={32} />
              </button>
              <AddNewCar /> {/* Add User Component */}
            </div>
          </div>
        )}
      </div>
    );
  }
  
  export default CarList;