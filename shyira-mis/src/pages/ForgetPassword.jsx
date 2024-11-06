import { useState } from 'react';
import axios from 'axios';
import './stylingpages/Forgetpassword.css'; // Import CSS for styling

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState(''); // New state for message type

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/api/forgot-password', { email });
      setMessage(response.data);
      setMessageType('success'); // Set message type to success
    } catch (error) {
      console.error(error);
      setMessage('Error sending reset link.');
      setMessageType('error'); // Set message type to error
    }
  };

  return (
    <div className="forget-password-container">
      <h1>Forgot Password</h1>
      <label htmlFor="">Enter your login email address to receive a password reset link</label>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          required
        />
        <button type="submit">Get Reset Link</button>
      </form>
      {message && (
        <p className={messageType === 'success' ? 'success-message' : 'error-message'}>
          {message}
        </p>
      )}
    </div>
  );
};

export default ForgotPassword;