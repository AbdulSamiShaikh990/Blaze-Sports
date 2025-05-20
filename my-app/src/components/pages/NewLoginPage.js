import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { login, signup } from '../../config/api';
import './NewLoginPage.css';

const NewLoginPage = () => {
  const navigate = useNavigate();
  const [isSignIn, setIsSignIn] = useState(true);
  const [userRole, setUserRole] = useState('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const toggleForm = () => {
    setIsSignIn(!isSignIn);
    setError('');
    setFormData({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
    if (isSignIn) {
        // Login
        const response = await login({
          email: formData.email,
          password: formData.password,
          userType: userRole // Send userType with login request
        });
        
        // Check if the logged-in user's type matches the selected role
        if (response.user.userType !== userRole) {
          setError(`Please login as ${response.user.userType}`);
          return;
        }

        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(response.user));
        localStorage.setItem('token', response.token);
        
        // Navigate based on user type
        if (response.user.userType === 'admin') {
          navigate('/admin/dashboard');
        } else if (response.user.userType === 'customer') {
          navigate('/');
        } else {
          navigate('/');
        }
    } else {
        // Signup with better error handling
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          return;
        }

        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          return;
        }

        if (!formData.name || !formData.email || !formData.password || !userRole) {
          setError('All fields are required');
          return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
          setError('Invalid email format');
          return;
        }

        console.log('Attempting to signup with:', {
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: userRole
        });

        const response = await signup({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          userType: userRole
        });

        console.log('Signup response:', response);

        if (response.message === 'User created successfully') {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);

          if (response.user.userType === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/');
      }
        } else {
          setError(response.message || 'Error during signup');
        }
      }
    } catch (err) {
      console.error('Error in handleSubmit:', err);
      setError(err.response?.data?.message || 'An error occurred during signup');
    }
  };

  // Handle Google Sign In
  const handleGoogleSignIn = () => {
    console.log("Sign in with Google");
  };

  // Apply CSS classes based on the form state
  useEffect(() => {
    const container = document.getElementById('container');
    if (isSignIn) {
      container.classList.add('sign-in');
      container.classList.remove('sign-up');
    } else {
      container.classList.add('sign-up');
      container.classList.remove('sign-in');
    }
  }, [isSignIn]);

  return (
    <div id="container" className="container">
      {error && <div className="error-message">{error}</div>}
      {/* FORM SECTION */}
      <div className="row">
        {/* SIGN UP */}
        <div className="col align-items-center flex-col sign-up">
          <div className="form-wrapper align-items-center">
            <div className="form sign-up">
              <div className="input-group">
                <i className='bx bxs-user'></i>
                <input 
                  type="text" 
                  name="name"
                  placeholder="Username" 
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <i className='bx bx-mail-send'></i>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <i className='bx bxs-lock-alt'></i>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <i className='bx bxs-lock-alt'></i>
                <input 
                  type="password" 
                  name="confirmPassword"
                  placeholder="Confirm password" 
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="role-selection">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={userRole === 'customer'}
                    onChange={(e) => setUserRole(e.target.value)}
                  />
                  Customer
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={userRole === 'admin'}
                    onChange={(e) => setUserRole(e.target.value)}
                  />
                  Admin
                </label>
              </div>
              <button type="submit" onClick={handleSubmit}>Sign up</button>
              <p>
                <span>Already have an account?</span>
                <span className="toggle-link" onClick={toggleForm}>
                  Sign in here
                </span>
              </p>
            </div>
          </div>
          <div className="social-list sign-up">
            <div className="google-bg" onClick={handleGoogleSignIn}>
              <i className='bx bxl-google'></i>
            </div>
          </div>
        </div>
        
        {/* SIGN IN */}
        <div className="col align-items-center flex-col sign-in">
          <div className="form-wrapper align-items-center">
            <div className="form sign-in">
              <div className="input-group">
                <i className='bx bx-mail-send'></i>
                <input 
                  type="email" 
                  name="email"
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="input-group">
                <i className='bx bxs-lock-alt'></i>
                <input 
                  type="password" 
                  name="password"
                  placeholder="Password" 
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="role-selection">
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="customer"
                    checked={userRole === 'customer'}
                    onChange={(e) => setUserRole(e.target.value)}
                  />
                  Customer
                </label>
                <label>
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={userRole === 'admin'}
                    onChange={(e) => setUserRole(e.target.value)}
                  />
                  Admin
                </label>
              </div>
              <button type="submit" onClick={handleSubmit}>Sign in</button>
              <p>
                <Link to="/forgot-password" className="forgot-link">Forgot password?</Link>
              </p>
              <p>
                <span>Don't have an account?</span>
                <span className="toggle-link" onClick={toggleForm}>
                  Sign up here
                </span>
              </p>
            </div>
          </div>
          <div className="social-list sign-in">
            <div className="google-bg" onClick={handleGoogleSignIn}>
              <i className='bx bxl-google'></i>
            </div>
          </div>
        </div>
      </div>
      
      {/* CONTENT SECTION */}
      <div className="row content-row">
        <div className="col align-items-center flex-col">
          <div className="text sign-in">
            <h2>Welcome</h2>
            <p>Sign in to explore more</p>
          </div>
        </div>
        
        <div className="col align-items-center flex-col">
          <div className="text sign-up">
            <h2>Join with us</h2>
            <p>Sign up to get started</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewLoginPage;
