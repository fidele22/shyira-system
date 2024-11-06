import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash,FaTimes,FaTimesCircle,FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import AddUser from './AddUser'; // Import the AddUser component
import '../css/adminDashboard.css';
import '../css/user.css'

const ViewItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // State to show/hide Add User form
  const [usersPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    positionName: '',
    serviceName: '',
    departmentName: '',
    phone: '',
    email: '',
    role: '',
    signature: '',
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [positions, setPositions] = useState([]);
  const [roles, setRoles] = useState([]);

  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/services');
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

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

  useEffect(() => {
    const fetchUserRoles = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/roles');
        setRoles(response.data);
      } catch (error) {
        console.error('Error fetching roles:', error);
      }
    };

    fetchUserRoles();
  }, []);

  const handleEditClick = (user) => {
    setEditingUser(user._id);
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      positionName: user.positionName,
      serviceName: user.serviceName,
      departmentName: user.departmentName,
      phone: user.phone,
      email: user.email,
      role: user.role,
      signature: user.signature,
    });
  };

  const handleDeleteClick = async (userId) => {
    try {
      await axios.delete(`http://localhost:5000/api/users/${userId}`);
      setUsers(users.filter((user) => user._id !== userId));
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedFormData = new FormData();
    
    updatedFormData.append('firstName', formData.firstName);
    updatedFormData.append('lastName', formData.lastName);
    updatedFormData.append('positionName', formData.positionName);
    updatedFormData.append('serviceName', formData.serviceName);
    updatedFormData.append('departmentName', formData.departmentName);
    updatedFormData.append('phone', formData.phone);
    updatedFormData.append('email', formData.email);
    updatedFormData.append('role', formData.role);
    
    if (formData.signature) {
      updatedFormData.append('signature', formData.signature);
    }
    
    try {
      await axios.put(`http://localhost:5000/api/profile/${editingUser}`, updatedFormData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
    
      setModalMessage('User updated successfully');
      setIsSuccess(true); // Set the success state
      setShowModal(true); // Show the modal
      setEditingUser(null);
     
    } catch (error) {
      console.error('Error updating user:', error);
      setModalMessage('Error for updating user');
      setIsSuccess(false); // Set the success state
      setShowModal(true); // Show the modal
    }
  };

    // Handle close form
    const handleCloseForm = () => {
      setEditingUser(null);
    };
//handle search  
  const filteredUsers = users.filter(user =>
    user.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  const paginate = pageNumber => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filteredUsers.length / usersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="view-items">
      <div className="headers">
      <h2>System User Management</h2>
      <div >
          <button className="add-new-user-btn" onClick={() => setShowAddUserForm(true)}>Add new user</button>
        </div>
      </div>
     
      <div className='items-table'>
        <div className="searchbar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table className='user-table'>
          <thead>
            <tr>
              <th>No</th>
              <th>First Name</th>
              <th>Last Name</th>
              <th>Position</th>
              <th>Service</th>
              <th>Department</th>
              <th>Phone</th>
              <th>Email</th>
              <th>Role</th>
              <th>Signature</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {currentUsers.map((user, index) => (
              <tr key={user._id}>
                <td>{index + 1}</td>
                <td>{user.firstName}</td>
                <td>{user.lastName}</td>
                <td>{user.positionName}</td>
                <td>{user.serviceName}</td>
                <td>{user.departmentName}</td>
                <td>{user.phone}</td>
                <td>{user.email}</td>
                <td>{user.role}</td>
                <td>{user.signature}</td>
                <td className='edit-delete'>
                  <label className='user-edit-btn' onClick={() => handleEditClick(user)}>
                    <FaEdit size={15} color="green" />
                  </label>
                  <label className='delete-btn' onClick={() => handleDeleteClick(user._id)}>
                    <FaTrash size={15} color="darkred" />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="pagination">
          {pageNumbers.map(number => (
            <li key={number}>
              <button className='pagination-number' onClick={() => paginate(number)}>{number}</button>
            </li>
          ))}
        </ul>
  {/* Add User Form Overlay */}
  {showAddUserForm && (
          <div className="add-overlay">
            <div className="add-user-form-container">
              <button className="close-form-btn" onClick={() => setShowAddUserForm(false)}>
                <FaTimes size={32} />
              </button>
              <AddUser /> {/* Add User Component */}
            </div>
          </div>
        )}


        {editingUser && (
          <div className="editing-userdata-ovelay">
            <div className="editinguser-form">
            <button className='edit-user-close-btn' onClick={handleCloseForm}>
                <FaTimes size={44} />
              </button>
              <form onSubmit={handleSubmit}>
                <h2>Edit User</h2>
                <label>First Name</label>
                <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
                <label>Last Name</label>
                <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />

                <label>Position</label>
                <select name="positionName" value={formData.positionName} onChange={handleChange} required>
                  <option value="">Select Position</option>
                  {positions.map((position) => (
                    <option key={position._id} value={position.name}>{position.name}</option>
                  ))}
                </select>

                <label>Service</label>
                <select name="serviceName" value={formData.serviceName} onChange={handleChange}>
                  <option value="">Select Service</option>
                  {services.map((service) => (
                    <option key={service._id} value={service.name}>{service.name}</option>
                  ))}
                </select>
                <label>Department</label>
                <select name="departmentName" value={formData.departmentName} onChange={handleChange}>
                  <option value="">Select Department</option>
                  {departments.map((department) => (
                    <option key={department._id} value={department.name}>{department.name}</option>
                  ))}
                </select>
                <label>Phone</label>
                <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                <label>Email</label>
                <input type="text" name="email" value={formData.email} onChange={handleChange} />
                <label>Role</label>
                <select name="role" value={formData.role} onChange={handleChange}>
                  <option value="">Select role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role.name}>{role.name}</option>
                  ))}
                </select>
                <label>Signature</label>
                <input type="file" name="signature" onChange={(e) => setFormData({ ...formData, signature: e.target.files[0] })} />
                <button type="submit" className='update-user-btn'>Update</button>
              </form>
            </div>
          </div>
        )}
          


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

      </div>
    </div>
  );
};

export default ViewItems;
