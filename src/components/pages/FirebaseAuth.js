import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail
} from 'firebase/auth';
import { auth } from '../../firebase/config';
import { useAuth } from '../../context/AuthContext';
import { FaGoogle, FaEnvelope, FaLock, FaUser, FaEye, FaEyeSlash } from 'react-icons/fa';
import './FirebaseAuth.css';

const FirebaseAuth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [resetEmail, setResetEmail] = useState('');
  const [showResetForm, setShowResetForm] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo);
    }
  }, [currentUser, navigate, location]);
  
  const validateForm = () => {
    setError('');
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }
    
    // Password validation
    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return false;
    }
    
    // Additional validation for registration
    if (!isLogin) {
      if (!name.trim()) {
        setError('Please enter your name');
        return false;
      }
      
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return false;
      }
    }
    
    return true;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setLoading(true);
    setError('');
    
    try {
      if (isLogin) {
        // Login
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        // Register
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        
        // Save additional user data to MongoDB
        const response = await fetch('http://localhost:5000/api/firebase-auth/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name,
            email,
            firebaseUid: userCredential.user.uid,
            userType: 'customer'
          }),
        });
        
        if (!response.ok) {
          throw new Error('Failed to register user in database');
        }
        
        const userData = await response.json();
        // Store user type in localStorage
        localStorage.setItem('userType', userData.user.userType);
        console.log('User registered in MongoDB:', userData);
      }
      
      // Redirect to home page or previous page
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo);
    } catch (err) {
      console.error('Authentication error:', err);
      
      // Handle Firebase auth errors
      switch (err.code) {
        case 'auth/email-already-in-use':
          setError('This email is already registered');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/user-not-found':
        case 'auth/wrong-password':
          setError('Invalid email or password');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed login attempts. Please try again later');
          break;
        default:
          setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Save user data to MongoDB
      const response = await fetch('http://localhost:5000/api/firebase-auth/google-login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: userCredential.user.displayName,
          email: userCredential.user.email,
          firebaseUid: userCredential.user.uid
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to register Google user in database');
      }
      
      const userData = await response.json();
      // Store user type in localStorage
      localStorage.setItem('userType', userData.user.userType);
      console.log('Google user registered in MongoDB:', userData);
      
      // Redirect to home page or previous page
      const redirectTo = location.state?.from || '/';
      navigate(redirectTo);
    } catch (err) {
      console.error('Google sign-in error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  
  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (!resetEmail) {
      setError('Please enter your email address');
      return;
    }
    
    setLoading(true);
    setError('');
    
    try {
      await sendPasswordResetEmail(auth, resetEmail);
      setMessage('Password reset email sent! Check your inbox.');
      setShowResetForm(false);
    } catch (err) {
      console.error('Password reset error:', err);
      
      switch (err.code) {
        case 'auth/user-not-found':
          setError('No account found with this email');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        default:
          setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };
  
  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setError('');
    setMessage('');
  };
  
  const toggleResetForm = () => {
    setShowResetForm(!showResetForm);
    setError('');
    setMessage('');
  };
  
  return (
    <div className="firebase-auth-container">
      <div className="firebase-auth-card">
        <div className="firebase-auth-header">
          <h2>{isLogin ? 'Login' : 'Create Account'}</h2>
          <p>{isLogin ? 'Welcome back to Blaze Sports!' : 'Join Blaze Sports today!'}</p>
        </div>
        
        {error && <div className="firebase-auth-error">
          <i className="fas fa-exclamation-circle" style={{ fontSize: '1.2rem' }}></i>
          {error}
        </div>}
        {message && (
        <div className="firebase-auth-message">
          <i className="fas fa-check-circle" style={{ fontSize: '1.2rem' }}></i>
          {message}
        </div>
      )}
        
        {showResetForm ? (
          <form onSubmit={handleResetPassword} className="firebase-auth-form">
            <div className="form-group">
              <label htmlFor="resetEmail">
                <FaEnvelope className="input-icon" />
                Email
              </label>
              <input
                type="email"
                id="resetEmail"
                value={resetEmail}
                onChange={(e) => setResetEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <button 
              type="submit" 
              className="firebase-auth-button primary-button"
              disabled={loading}
            >
              {loading ? 'Sending...' : 'Reset Password'}
            </button>
            
            <button 
              type="button" 
              className="firebase-auth-button secondary-button"
              onClick={toggleResetForm}
            >
              Back to Login
            </button>
          </form>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="firebase-auth-form">
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="name">
                    <FaUser className="input-icon" />
                    Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    required={!isLogin}
                  />
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="email">
                  <FaEnvelope className="input-icon" />
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">
                  <FaLock className="input-icon" />
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              {!isLogin && (
                <div className="form-group">
                  <label htmlFor="confirmPassword">
                    <FaLock className="input-icon" />
                    Confirm Password
                  </label>
                  <div className="password-input-container">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="confirmPassword"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Confirm your password"
                      required={!isLogin}
                    />
                  </div>
                </div>
              )}
              
              <button 
                type="submit" 
                className="firebase-auth-button primary-button"
                disabled={loading}
              >
                {loading 
                  ? (isLogin ? 'Logging in...' : 'Creating account...') 
                  : (isLogin ? 'Login' : 'Create Account')}
              </button>
            </form>
            
            {isLogin && (
              <button 
                type="button" 
                className="forgot-password-link"
                onClick={toggleResetForm}
              >
                Forgot Password?
              </button>
            )}
            
            <div className="auth-divider">
              <span>OR</span>
            </div>
            
            <button 
              type="button" 
              className="firebase-auth-button google-button"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <FaGoogle className="google-icon" />
              {isLogin ? 'Login with Google' : 'Sign up with Google'}
            </button>
            
            <div className="auth-footer">
              <div className="auth-toggle">
                <span>{isLogin ? "Don't have an account?" : "Already have an account?"}</span>
                <button 
                  type="button" 
                  className="auth-toggle-link"
                  onClick={toggleAuthMode}
                >
                  {isLogin ? 'Sign Up' : 'Login'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default FirebaseAuth;
