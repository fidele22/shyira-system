import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './logisticProfile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    positionName: '',
    serviceName: '',
    departmentName: '',
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [signatureFile, setSignatureFile] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${sessionStorage.getItem('token')}`
          }
        });
        setUser(response.data);
        setFormData({
          firstName: response.data.firstName,
          lastName: response.data.lastName,
          email: response.data.email,
          phone: response.data.phone,
          positionName: response.data.positionName,
          serviceName: response.data.serviceName,
          departmentName: response.data.departmentName,
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };

    fetchUserProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setSignatureFile(e.target.files[0]);
  };

  const handleSave = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('firstName', formData.firstName);
      formDataToSend.append('lastName', formData.lastName);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phone', formData.phone);
      formDataToSend.append('positionName', formData.positionName);
      formDataToSend.append('serviceName', formData.serviceName);
      formDataToSend.append('departmentName', formData.departmentName);

      if (signatureFile) {
        formDataToSend.append('signature', signatureFile);
      }

      const response = await axios.put('http://localhost:5000/api/profile', formDataToSend, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      setUser(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

  const handleSaveWithoutSignature = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/profile', formData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      setUser(response.data);
      setIsEditing(false);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile.');
    }
  };

 
  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      {isEditing ? (
        <>
          <h1>Edit Profile</h1>
          <form className="profile-form">
            <div className="form-group">
              <label>First Name:</label>
              <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Last Name:</label>
              <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Email:</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Phone:</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Position:</label>
              <input type="text" name="positionName" value={formData.positionName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Service:</label>
              <input type="text" name="serviceName" value={formData.serviceName} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Department:</label>
              <input type="text" name="departmentName" value={formData.departmentName} onChange={handleChange} />
            </div>
            <button
              type="button"
              className="save-button"
              onClick={signatureFile ? handleSave : handleSaveWithoutSignature}
            >
              Save Changes
            </button>
            <button type="button" className="cancel-button" onClick={() => setIsEditing(false)}>
              Cancel
            </button>
          </form>
        </>
      ) : (
        <>
          <h1>{user.firstName} {user.lastName}</h1>
          <p className="profile-detail"><strong>Email:</strong> {user.email}</p>
          <p className="profile-detail"><strong>Phone:</strong> {user.phone}</p>
          <p className="profile-detail"><strong>Position:</strong> {user.positionName}</p>
          <p className="profile-detail"><strong>Service:</strong> {user.serviceName}</p>
          <p className="profile-detail"><strong>Department:</strong> {user.departmentName}</p>
          {user.signature && <img className="profile-signature" src={`http://localhost:5000/${user.signature}`} alt="Signature" />}
          <button className="edit-button" onClick={() => setIsEditing(true)}>
            Edit Profile
          </button>
          
        </>
      )}
     
    </div>
  );
};

export default UserProfile;
