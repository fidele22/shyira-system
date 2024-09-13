import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './hodprofile.css';

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Get the current tab's ID from sessionStorage
        const currentTab = sessionStorage.getItem('currentTab');

        if (!currentTab) {
          setError('No tab ID found in sessionStorage');
          return;
        }

        // Retrieve the token using the current tab ID
        const token = sessionStorage.getItem(`token_${currentTab}`);
        if (!token) {
          setError('Token not found');
          return;
        }

        // Use Axios to fetch user profile
        const response = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        setUser(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
        setError('Invalid token or unable to fetch profile data');
      }
    };

    fetchUserProfile();
  }, []);

  if (error) return <p>{error}</p>;
  if (!user) return <p>Loading...</p>;

  return (
    <div className='hod-profile'>
      <h1>{user.firstName} {user.lastName}</h1>
      <label>Email</label>
      <p>{user.email}</p>

      <label>Phone number</label>
      <p>{user.phone}</p>

      <label>Position</label>
      <p>{user.positionName}</p>

      <label>Service</label>
      <p>{user.serviceName}</p>

      <label>Department</label>
      <p>{user.departmentName}</p>

      <label>Your Signature</label>
      {user.signature && <img src={`http://localhost:5000/${user.signature}`} alt="Signature" />}

      <div className="edit-profile">
        <button className='edit-profile-btn'>Edit profile</button>
      </div>
    </div>
  );
};

export default UserProfile;
