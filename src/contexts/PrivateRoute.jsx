import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const { user, token } = useStateContext();

  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If no roles required, allow access
  if (allowedRoles.length === 0) {
    return children;
  }

  // Check if user has required role
  const userRole = user?.role?.name;
  if (!userRole || !allowedRoles.includes(userRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default PrivateRoute;