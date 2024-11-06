import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './profile.css';

const ProfilePage = () => {
  const [user, setUser ] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [file, setFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const currentTab = sessionStorage.getItem('currentTab');
      const token = sessionStorage.getItem(`token_${currentTab}`);

      if (!token) {
        console.error('No token found for the current tab');
        return;
      }

      try {
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setUser (response.data);
        setFormData(response.data); // Set initial form data
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    fetchProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentTab = sessionStorage.getItem('currentTab');
    const token = sessionStorage.getItem(`token_${currentTab}`);

    const formDataToSend = new FormData();
    formDataToSend.append('firstName', formData.firstName);
    formDataToSend.append('lastName', formData.lastName);
    formDataToSend.append('phone', formData.phone);
    formDataToSend.append('email', formData.email);
    formDataToSend.append('positionName', formData.positionName);
    formDataToSend.append('serviceName', formData.serviceName);
    formDataToSend.append('departmentName', formData.departmentName);
    if (file) {
      formDataToSend.append('signature', file);
    }

    try {
      const response = await axios.put(
        'http://localhost:5000/api/users/profile-update',
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setUser (response.data); // Update the user state with the updated data
      setIsEditing(false); // Exit editing mode
      setFile(null); // Clear the file input
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  if (!user) return <p className="loading">Loading...</p>;

  return (
    <div className="profile-container">
      <div className="profile-card">
        <div className="profile-header">
          <img
            src={`https://api.dicebear.com/6.x/initials/svg?seed=${user.firstName}&backgroundColor=E3F2FD`}
            alt={`${user.firstName} ${user.lastName}`}
            className="profile-avatar"
          />
          <h1 className="profile-name">
            {user.firstName} {user.lastName}
          </h1>
          <p className="profile-email">{user.email}</p>
          {!isEditing && (
            <button onClick={handleEdit} className="edit-button">Edit Profile</button>
          )}
        </div>
        <div className="profile-details">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="profile-edit-form">
              <label>
                First Name:
                <input
                  type="text"
                  name ="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Last Name:
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Phone:
                <input
                  type="text"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Position:
                <input
                  type="text"
                  name="positionName"
                  value={formData.positionName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Service:
                <input
                  type="text"
                  name="serviceName"
                  value={formData.serviceName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Department:
                <input
                  type="text"
                  name="departmentName"
                  value={formData.departmentName}
                  onChange={handleChange}
                  required
                />
              </label>
              <label>
                Signature:
                <input
                  type="file"
                  name="signature"
                  onChange={handleFileChange}
                />
              </label>
              <button type="submit">Update Profile</button>
              <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
            </form>
          ) : (
            <>
              <p><strong>Phone:</strong> {user.phone}</p>
              <p><strong>Position:</strong> {user.positionName}</p>
              <p><strong>Service:</strong> {user.serviceName}</p>
              <p><strong>Department:</strong> {user.departmentName}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;