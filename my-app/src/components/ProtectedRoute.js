import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const location = useLocation();
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) {
    // Redirect to login if no user is found
    return <Navigate to="/new-login" state={{ from: location }} replace />;
  }

  // Special cases - allow both customer and admin access to these pages
  if (location.pathname === '/ai-recommendation' || location.pathname === '/cart') {
    return children;
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