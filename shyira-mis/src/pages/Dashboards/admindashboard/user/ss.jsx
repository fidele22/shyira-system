import React, { useState, useEffect } from 'react';
import axios from 'axios';

const UserProfile = ({ userId }) => {
  const [userData, setUserData] = useState({});
  const [formData, setFormData] = useState({});
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState(null); // Error state

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/profile/profile/${userId}`);
        setUserData(response.data);
        setFormData(response.data); // Initialize formData with user data
      } catch (error) {
        setError('Error fetching user profile');
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`http://localhost:5000/api/profile/${userId}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      setUserData(response.data); // Update userData with new formData
      setEditing(false); // Stop editing mode
    } catch (error) {
      setError('Error updating user profile');
      console.error('Error updating user profile:', error);
    }
  };

  return (
    <div className="user-profile">
      <h2>User Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {editing ? (
        <form onSubmit={handleSubmit}>
          <label>First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            required
          />
          
          <label>Last Name</label>
          <input
            type="text"
            name="lastName"
            value={formData.lastName}
            onChange={handleChange}
            required
          />
          
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <label>Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditing(false)}>Cancel</button>
        </form>
      ) : (
        <div>
          <p><strong>First Name:</strong> {userData.firstName}</p>
          <p><strong>Last Name:</strong> {userData.lastName}</p>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Phone:</strong> {userData.phone}</p>
          <button onClick={() => setEditing(true)}>Edit</button>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
