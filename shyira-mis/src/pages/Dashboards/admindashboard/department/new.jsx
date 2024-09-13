import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrash, FaTimes, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import axios from 'axios';
import '../css/admin.css';
import '../css/new.css'
import AddUser from './AddUser'; // Import the AddUser component

const ViewItems = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5);
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showAddUserForm, setShowAddUserForm] = useState(false); // State to show/hide Add User form
  const [showModal, setShowModal] = useState(false); // State for modal visibility
  const [modalMessage, setModalMessage] = useState(''); //
  const [isSuccess, setIsSuccess] = useState(true);

  // Fetch users, departments, services, positions, and roles here...
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://10.20.0.99:5000/api/users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
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
        <div className="add-new-user-btn">
          <button onClick={() => setShowAddUserForm(true)}>Add new user</button>
        </div>
      </div>
     
      <div className="items-table">
        <div className="searchbar">
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <table>
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
                <td className="edit-delete">
                  <label className="user-edit-btn" onClick={() => handleEditClick(user)}>
                    <FaEdit size={24} color="green" />
                  </label>
                  <label className="delete-btn" onClick={() => handleDeleteClick(user._id)}>
                    <FaTrash size={24} color="darkred" />
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <ul className="pagination">
          {pageNumbers.map(number => (
            <li key={number}>
              <button className="pagination-number" onClick={() => paginate(number)}>{number}</button>
            </li>
          ))}
        </ul>

        {/* Add User Form Overlay */}
        {showAddUserForm && (
          <div className="overlay">
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
              <button className="edit-user-close-btn" onClick={() => setEditingUser(null)}>
                <FaTimes size={44} />
              </button>
              <form onSubmit={handleSubmit}>
                {/* Form fields here */}
                <button type="submit" className="update-user-btn">Update</button>
              </form>
            </div>
          </div>
        )}

        {/* Modal pop message */}
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
