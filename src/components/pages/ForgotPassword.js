import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState("");

  // Handle Form Submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError("Please enter your email address");
      return;
    }
    
    // Here you would typically call an API to send a reset link
    console.log("Reset password for:", email);
    
    // Show success message
    setIsSubmitted(true);
    setError("");
  };

  return (
    <div className="forgot-container">
      <div className="forgot-form">
        <h2>Reset Password</h2>
        <p className="subtitle">
          {!isSubmitted 
            ? "Enter your email and we'll send you a reset link" 
            : "Check your email for a reset link"}
        </p>
        
        {!isSubmitted ? (
          <form onSubmit={handleSubmit}>
            <div className="input-group">
              <input 
                type="email" 
                placeholder="Email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
              />
            </div>
            
            {error && <p className="error-message">{error}</p>}
            
            <button type="submit" className="btn-reset">
              Send Reset Link
            </button>
          </form>
        ) : (
          <div className="success-message">
            <div className="success-icon">✓</div>
            <p>We've sent a password reset link to <strong>{email}</strong></p>
            <p className="small-text">
              Didn't receive the email? Check your spam folder or 
              <button 
                type="button" 
                className="resend-button"
                onClick={() => handleSubmit({ preventDefault: () => {} })}
              >
                click here to resend
              </button>
            </p>
          </div>
        )}
        
        <button 
          className="back-btn" 
          onClick={() => navigate("/new-login")}
        >
          ← Back to Login
        </button>
      </div>
    </div>
  );
};

export default ForgotPassword;