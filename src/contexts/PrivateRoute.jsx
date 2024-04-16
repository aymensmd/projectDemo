// PrivateRoute.jsx
import React, { createContext, useContext, useState } from 'react';

const PrivateRouteContext = createContext();

export const PrivateRouteProvider = ({ children }) => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedMenuItem, setSelectedMenuItem] = useState('dashboard');

  

  return (
    <PrivateRouteContext.Provider
      value={{
        collapsed,
        setCollapsed,
        selectedMenuItem,
        setSelectedMenuItem,
      }}
    >
      {children}
    </PrivateRouteContext.Provider>
  );
};

export const usePrivateRouteContext = () => {
  const context = useContext(PrivateRouteContext);
  if (!context) {
    throw new Error('usePrivateRouteContext must be used within a PrivateRouteProvider');
  }
  return context;
};
