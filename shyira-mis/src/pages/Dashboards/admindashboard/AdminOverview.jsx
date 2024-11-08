import React, { useEffect, useState } from 'react';
import axios from 'axios';
//import './contentCss/overview.css';

const DashboardOverview = () => {
  const [lastName, setLastName] = useState('');
  const [userCount, setUserCount] = useState(0);
  const [positionCount, setPositionCount] = useState(0);
  const [roleCount, setRoleCount] = useState(0);
  const [error, setError] = useState(null);


  useEffect(() => {
    const fetchUserData = async () => {
      // Get the current tab's ID from sessionStorage
      const currentTab = sessionStorage.getItem('currentTab');

      if (!currentTab) {
        console.error('No tab ID found in sessionStorage');
        return;
      }

      // Retrieve the token using the current tab ID
      const token = sessionStorage.getItem(`token_${currentTab}`);

      console.log('Token:', token); // Debug log to check if the token is correctly retrieved

      if (!token) {
        console.error('No token found for the current tab');
        return;
      }

      try {
        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/users/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        console.log('Response status:', response.status); // Debug log

        if (response.ok) {
          const data = await response.json();
          console.log('User data:', data); // Debug log
          const lastName = ` ${data.lastName}`;
          setLastName(lastName);
        } else {
          console.error('Failed to fetch user data');
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };
 
    const fetchDashboardStats = async () => {
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
 
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/positions/dashboard/stats`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

    if (response.status === 200) {
      setUserCount(response.data.userCount);
      setPositionCount(response.data.positionCount);
      setRoleCount(response.data.roleCount);
    } else {
      console.error('Failed to fetch dashboard stats');
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
  }
};

fetchUserData();
fetchDashboardStats();
}, []);

  return (
    <div className="overview-content">
      <div className="welcome-nav">
      <h1>Welcome back,{lastName}!</h1>
      </div>
     

      {/* Overview Sections */}
      <section className="overview-section">

        <h2>Truck Overview</h2>
       
        <p>Here you can find essential logistic information relevant to hospital operations.</p>
        {/* Add relevant widgets and summaries here */}
        <div className="logistic-overview-widgets">
          <div className="widget">
            <h3>Number of users you have registered:</h3>
            <p>View and manage users of shyira MIS.</p>
            {/* Example: Display a number */}
            <label>{userCount}</label>
          </div>
          <div className="widget">
            <h3>Number of position provided in shyira MIS</h3>
            <p>Check the  positions of shyira MIS hospital .</p>
            {/* numver of  verified request but doestn't approved*/}
            <label>{positionCount}</label>

          </div>
          <div className="widget">
            <h3>Number of role in SHYIRA MIS</h3>
            <p>Here is the number of role has been approved in Shyira MIS .</p>
            {/* Example: Display upcoming delivery schedules */}
            <label htmlFor="">{roleCount}</label>
          </div>
        </div>
      </section>

      {/* Additional Sections */}
      <section className="additional-section">
        <h2>Additional Information</h2>
        <p>Explore more functionalities and resources available in the admin dashboard.</p>
        {/* Add more informative sections or links */}
        <ul>
          <li>View All user's infomartion </li>
          <li>Manage user datails</li>
          <li>Manage System's data</li>
        </ul>
      </section>
    </div>
  );
};


export default DashboardOverview;
