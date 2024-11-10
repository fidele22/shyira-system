import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 
import axios from 'axios';
import Notification from './Dashboards/ModelMessage/notification'
import './stylingpages/loginForm.css'; // Adjust your CSS file path

const AuthForm = () => {
  const [isSignUp, setIsSignUp] = useState(false); // State to track whether it's sign-up or sign-in
  
  const handleSignUpClick = () => {
    setIsSignUp(true);
  };

  const handleSignInClick = () => {
    setIsSignUp(false);
  };

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});

  // Add state for password visibility toggle
const [showPassword, setShowPassword] = useState(false);

// Toggle function
const togglePasswordVisibility = () => {
  setShowPassword(!showPassword);
};

  const navigate = useNavigate();

  const validateLoginForm = () => {
    const newErrors = {};
    if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    if (password.length < 1) {
      newErrors.password = 'Password required';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateLoginForm()) {
      try {
        const res = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/login`, { email, password });
        console.log('Login response:', res.data); // Check what is returned
        const { token, role } = res.data;
  
        // Generate a unique key for the current tab (optional, can store token directly in sessionStorage)
        const tabId = Date.now() + Math.random().toString(36);
  
        // Save the token in sessionStorage instead of localStorage
        sessionStorage.setItem(`token_${tabId}`, token);
        
        // Save the tab ID for reference in other parts of the app
        sessionStorage.setItem('currentTab', tabId);
  
        // Redirect to the appropriate dashboard based on role
        if (role === 'admin') {
          navigate('/admin-dashboard');
        } else if (role === 'LOGISTIC') {
          navigate('/LOGISTIC');
        } else if (role === 'ACCOUNTANT') {
          navigate('/ACCOUNTANT');
        } else if (role === 'DAF') {
          navigate('/DAF');
        } else if (role === 'DG') {
          navigate('/DG');
        } else if (role === 'HOD') {
          navigate('/HOD');
        } else {
          navigate('/');
        }
      } catch (err) {
        console.error('Login error:', err);
        alert('Invalid email or password');
      }
    }
  };
  

  // Registration logic
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    positionName: '',
    serviceName: '',
    departmentName: '',
    phone: '',
    email: '',
    signature: null,
    password: '',
    confirmPassword: '',
  });

  const [registerErrors, setRegisterErrors] = useState({});
  const [departments, setDepartments] = useState([]);
  const [services, setServices] = useState([]);
  const [positions, setPositions] = useState([]);

  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState(''); // State for error message

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/departments`);
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };
    fetchDepartments();
  }, []);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/services`);
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };
    fetchServices();
  }, []);

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/positions`);
        setPositions(response.data);
      } catch (error) {
        console.error('Error fetching positions:', error);
      }
    };
    fetchPositions();
  }, []);

  const validateRegisterForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) {
      newErrors.firstName = 'First name is required';
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name is required';
    }
    if (!formData.positionName.trim()) {
      newErrors.positionName = 'Position is required';
    }
    if (!formData.departmentName.trim()) {
      newErrors.departmentName = 'Department is required';
    }
    if (!formData.serviceName.trim()) {
      newErrors.serviceName = 'Service is required';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = 'Phone number must be 10 digits';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.password.trim()) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long';
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = 'Confirm Password is required';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.signature) {
      newErrors.signature = 'Signature is required';
    }

    setRegisterErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'signature' ? files[0] : value,
    });
  };

  const handleSubmitRegister = async (e) => {
    e.preventDefault();
    if (validateRegisterForm()) {
      try {
        const formDataToSend = new FormData();
        for (const key in formData) {
          formDataToSend.append(key, formData[key]);
        }

        const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/api/users/register`, formDataToSend, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        console.log('User registered:', response.data);
        sessionStorage.setItem('token', response.data.token);

        setSuccessMessage('Registration successful!');  
        
        setFormData({
          firstName: '',
          lastName: '',
          positionName: '',
          serviceName: '',
          departmentName: '',
          phone: '',
          email: '',
          signature: null,
          password: '',
          confirmPassword: '',
        });
      } catch (error) {
        console.error('Error registering user:', error);

        setErrorMessage('Registration failed. Please try again.');
      }
    }
  };

  const closeNotification = () => {
    setSuccessMessage('');
    setErrorMessage('');
  };

  return (
    <div className={`container ${isSignUp ? 'right-panel-active' : ''}`} id="container">
      {/* {login form} */}
      <div className="form-container sign-in-container">
        <form onSubmit={handleSubmit}>
          <h1>Login</h1>
          <span>Use your account</span>
          <input type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Email address'  />
          {errors.email && <p className="error">{errors.email}</p>}

          <input  type={showPassword ? 'text' : 'password'} value={password} onChange={(e) => setPassword(e.target.value)} placeholder='Password'   />
          <span onClick={togglePasswordVisibility} className="password-view-login">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
    </span>
          {errors.password && <p className="error">{errors.password}</p>}

          <a href="/forgot-password">Forgot your password?</a>
          
          <button className='login-btn'>Login</button>
          <p>If you don't have an account? <Link to="#" onClick={handleSignUpClick}>Sign Up</Link></p>
        </form>
      </div>
      {/* {sign up form} */}
      <div className="form-container sign-up-container">
        <form onSubmit={handleSubmitRegister}>
          <h1>Register</h1>
          <span>Use your email for registration</span>
          <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} placeholder='First name'/>
          {registerErrors.firstName && <p className="error">{registerErrors.firstName}</p>}

          <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} placeholder='Last name' />
          {registerErrors.lastName && <p className="error">{registerErrors.lastName}</p>}
          
          <select name="positionName" value={formData.positionName} onChange={handleChange}>
            <option value="">Select Position</option>
            {positions.map((position) => (
              <option key={position._id} value={position.name}>{position.name}</option>
            ))}
          </select>
          {registerErrors.positionName && <p className="error">{registerErrors.positionName}</p>}

          <select name="serviceName" value={formData.serviceName} onChange={handleChange} >
            <option value="">Select Service</option>
            {services.map((service) => (
              <option key={service._id} value={service.name}>{service.name}</option>
            ))}
          </select>
          {registerErrors.serviceName && <p className="error">{registerErrors.serviceName}</p>}
          
          <select name="departmentName" value={formData.departmentName} onChange={handleChange} >
            <option value="">Select Department</option>
            {departments.map((department) => (
              <option key={department._id} value={department.name}>{department.name}</option>
            ))}
          </select>
          {registerErrors.departmentName && <p className="error">{registerErrors.departmentName}</p>}

          <input type="text" name="phone" value={formData.phone} onChange={handleChange} placeholder='Phone number'  />
          {registerErrors.phone && <p className="error">{registerErrors.phone}</p>}

          <h5>Signature</h5>
          <input type="file" name="signature" onChange={handleChange}  />
          {registerErrors.signature && <p className="error">{registerErrors.signature}</p>}

          <input type="text" name="email" value={formData.email} onChange={handleChange} placeholder='Email address'  />
          {registerErrors.email && <p className="error">{registerErrors.email}</p>}

          <input  type={showPassword ? 'text' : 'password'} name="password" value={formData.password} onChange={handleChange} placeholder='Password'  />
          <span onClick={togglePasswordVisibility} className="password-view-signup">
            {showPassword ? <FaEyeSlash /> : <FaEye />}
           </span>
          {registerErrors.password && <p className="error">{registerErrors.password}</p>}
      
          <input type={showPassword ? 'text' : 'password'} name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} placeholder='Confirm Password'  />
          <span onClick={togglePasswordVisibility} className="password-view-signup">
          {showPassword ? <FaEyeSlash /> : <FaEye />}
       </span>

          {registerErrors.confirmPassword && <p className="error">{registerErrors.confirmPassword}</p>}

          <button className='register-btn' type="submit">Register</button>

          <p>If already have an account? Please <Link to="#" onClick={handleSignInClick}>Login</Link></p>
        </form>
      </div>
     
      <div className="overlay-container">
        <div className="overlay">
          <div className="overlay-panel overlay-left">
            <h1>Welcome Back!</h1>
            <p>To keep connected with us please login with your personal info</p>
            <button className="ghost" onClick={handleSignInClick}>Login</button>
          </div>
          <div className="overlay-panel overlay-right">
            <h1>Hello,User!</h1>
            <p>Enter your personal details and start journey with us</p>
            <button className="ghost" onClick={handleSignUpClick}>Sign Up</button>
          </div>
        </div>
      </div>

{/* {notifation message} */}
{successMessage && (
        <Notification message={successMessage} onClose={closeNotification} type="success" />
      )}
      {errorMessage && (
        <Notification message={errorMessage} onClose={closeNotification} type="error" />
      )}

    </div>
  );
};

export default AuthForm;
