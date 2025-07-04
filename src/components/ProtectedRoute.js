import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const { currentUser } = useAuth();
  
  // Try to get user data from localStorage as fallback for non-Firebase auth
  const localUser = localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null;
  
  // Use Firebase user if available, otherwise use localStorage user
  const userType = localStorage.getItem('userType');
  console.log('Current user type from localStorage:', userType);
  
  const user = currentUser ? {
    id: currentUser.uid,
    email: currentUser.email,
    userType: userType || 'customer' // Get user type from localStorage
  } : localUser;
  
  console.log('Protected Route - User:', user);

  if (!user) {
    // Redirect to Firebase login if no user is found
    return <Navigate to="/firebase-auth" state={{ from: location }} replace />;
  }

  // Special cases - allow both customer and admin access to these pages
  if (location.pathname === '/ai-recommendation' || location.pathname === '/cart') {
    return children;
  }
  
  // Admin routes can only be accessed by direct URL
  if (location.pathname.startsWith('/admin')) {
    // Check if user is admin
    if (user.userType !== 'admin') {
      return <Navigate to="/" replace />;
    }
    // Admin user accessing admin route directly - allow access
    return children;
  }
  
  // If we don't have user type information yet, fetch it from the server
  if (currentUser && (!user.userType || user.userType === 'customer')) {
    // This would normally fetch user data from your backend
    // For now, we'll just use a default role
    if (!localStorage.getItem('userType')) {
      localStorage.setItem('userType', 'customer');
    }
  }

  if (!allowedRoles.includes(user.userType)) {
    // Redirect to appropriate dashboard based on user type
    if (user.userType === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;