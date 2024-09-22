import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../logisticdashboard/contentCss/overview.css';

const DashboardOverview = () => {
  const [lastName, setLastName] = useState('');
  const [requestCount, setRequestCount] = useState(0);
  const [approvedCount, setApprovedCount] = useState(0);
  const [verifiedCount , setverifiedCount] = useState(0);
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
        const response = await fetch('http://localhost:5000/api/users/profile', {
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
        const response = await axios.get('http://localhost:5000/api/approve/dashboard/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.status === 200) {
          setRequestCount(response.data.requestCount);
          setApprovedCount(response.data.approvedCount);
          setverifiedCount(response.data.verifiedCount);
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
      <h1>Welcome back: {lastName}</h1>
      </div>
      <section className="overview-section">
        <h2>Here are user's Overview:</h2>

        <p>Here you can find essential logistic information relevant to hospital operations.</p>
        <div className="logistic-overview-widgets">
          <div className="widget">
            <h3>Number of requisition you sent waited to be verified</h3>
           <label htmlFor="">{requestCount}</label> 
          </div>
         
          <div className="widget">
            <h3>Number of verified Requisition for Item</h3>
            <label htmlFor="">{verifiedCount}</label>
          </div>

          <div className="widget">
            <h3>Number of Approved Requisition for Item</h3>
            <label htmlFor=""> {approvedCount}</label>
          </div>
        </div>
      </section>

      <section className="additional-section">
        <h2>Additional Information</h2>
        <p>Explore more functionalities and resources available in the Navigation bar on your dashboard.</p>
        <ul>
          <li>View All items available to request</li>
          <li>Check your requisition status</li>
          <li>Manage your account details</li>
        </ul>
      </section>
    </div>
  );
};

export default DashboardOverview;
