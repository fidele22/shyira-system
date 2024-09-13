import React, { useEffect, useState } from 'react';
import axios from 'axios';
import logo from '../../../Component/image/land.jpg'
//import './contentCss/overview.css';

const DashboardOverview = () => {
  const [userName, setUserName] = useState('');
  const [requestCount, setRequestCount] = useState(0);
  const [requestVerifiedCount, setRequestVerifiedCount] = useState(0);
  const [requestApprovedCount, setRequestApprovedCount] = useState(0);

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem('token');
      console.log('Token:', token); // Debug log

      if (!token) {
        console.error('No token found');
        return;
      }

      try {
        const response = await fetch('http://localhost:5000/api/users/profile', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status); // Debug log

        if (response.ok) {
          const data = await response.json();
          console.log('User data:', data); // Debug log
          const fullName = `${data.lastName}`;
          setUserName(fullName);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

 // count requisition from different users
    const fetchRequestCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/UserRequest/count');
        if (response.ok) {
          const data = await response.json();
          setRequestCount(data.count);
        } else {
          console.error('Failed to fetch request count');
        }
      } catch (error) {
        console.error('Error fetching request count:', error);
      }
    };

    const fetchItemVerifiedCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/forwardedrequests/count-verified-item');
        if (response.ok) {
          const data = await response.json();
          setRequestVerifiedCount(data.count);
        } else {
          console.error('Failed to fetch request count');
        }
      } catch (error) {
        console.error('Error fetching request count:', error);
      }
    };
    const fetchItemApprovedCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/countrequisitions/number');
        if (response.ok) {
          const data = await response.json();
          setRequestApprovedCount(data.count);
        } else {
          console.error('Failed to fetch request count');
        }
      } catch (error) {
        console.error('Error fetching request count:', error);
      }
    };
 
    fetchUserData();
    fetchRequestCount();
    fetchItemVerifiedCount();
    fetchItemApprovedCount();
  }, []);

  return (
    <div className="logistic-0verview-content">
      <div className="welcome-nav">
      <h1>Welcome back,{userName}!</h1>
      </div>
     

      {/* Overview Sections */}
      <section className="logistic-overview-section">

        <h2>Truck Overview</h2>
       
        <p>Here you can find essential logistic information relevant to hospital operations.</p>
        {/* Add relevant widgets and summaries here */}
        <div className="logistic-overview-widgets">
          <div className="widget">
            <h3>Number of user's requisition for item waited to verified:</h3>
            <p>View and manage requisition from hospital departments.</p>
            {/* Example: Display a number */}
            <label>{requestCount}</label>
          </div>
          <div className="widget">
            <h3>Number of user's requisition for item waited to be approved</h3>
            <p>Check the  status of hospital requisition verified but not approved.</p>
            {/* numver of  verified request but doestn't approved*/}
            <label>{requestVerifiedCount}</label>

          </div>
          <div className="widget">
            <h3>Number of user's requisition approved for item waited to be signed as recieved</h3>
            <p>Here is the number of requisition has been approved but doesn't signed as recieved by user .</p>
            {/* Example: Display upcoming delivery schedules */}
            <label htmlFor="">{requestApprovedCount}</label>
          </div>
        </div>
      </section>

      {/* Additional Sections */}
      <section className="additional-section">
        <h2>Additional Information</h2>
        <p>Explore more functionalities and resources available in the logistic dashboard.</p>
        {/* Add more informative sections or links */}
        <ul>
          <li>View All Requests</li>
          <li>Inventory Management</li>
          <li>Reports and Analytics</li>
        </ul>
      </section>
    </div>
  );
};

export default DashboardOverview;
