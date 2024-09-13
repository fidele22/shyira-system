import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../logisticdashboard/logisticProfile.css';

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
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
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

      const response = await axios.put('http://localhost:5000/api/profile/update', formDataToSend, {
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

  const handlePasswordSave = async () => {
    try {
      const response = await axios.put('http://localhost:5000/api/profile/change-password', passwordData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      alert('Password changed successfully!');
      setIsChangingPassword(false);
    } catch (error) {
      console.error('Error changing password:', error);
      alert('Failed to change password.');
    }
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="profile-container">
      {isEditing ? (
        <>
          <h1>Edit Profile</h1>
          <form className="profile-form" encType="multipart/form-data">
            {/* Profile Fields */}
            {/* Add fields for profile update */}
            {/* Signature Image */}
            <div className="form-group">
              <label>Signature Image:</label>
              <input type="file" onChange={handleFileChange} />
            </div>
            <button type="button" className="save-button" onClick={handleSave}>
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
          <button className="change-password-button" onClick={() => setIsChangingPassword(true)}>
            Change Password
          </button>
        </>
      )}
      {isChangingPassword && (
        <div className="password-change">
          <h2>Change Password</h2>
          <form className="password-form">
            <div className="form-group">
              <label>Current Password:</label>
              <input
                type="password"
                name="currentPassword"
                value={passwordData.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="form-group">
              <label>New Password:</label>
              <input
                type="password"
                name="newPassword"
                value={passwordData.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <div className="form-group">
              <label>Confirm New Password:</label>
              <input
                type="password"
                name="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            <button type="button" onClick={handlePasswordSave}>Save Password</button>
            <button type="button" onClick={() => setIsChangingPassword(false)}>Cancel</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default UserProfile;
