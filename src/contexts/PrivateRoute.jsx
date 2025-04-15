import React from 'react';
import { Navigate } from 'react-router-dom';
import { useStateContext } from '../contexts/ContextProvider';

const PrivateRoute = ({ element, allowedRoles }) => {
  const { user, token } = useStateContext();
  console.log('Token in PrivateRoute:', token);
  console.log('User:', user);

  // Check if user has any of the allowed roles
  const hasAllowedRole = user && user.role && allowedRoles.includes(user.role.name);
  console.log('Has Allowed Role:', hasAllowedRole);

  return hasAllowedRole ? element : <Navigate to="/unauthorized" replace />;
};

export default PrivateRoute;
