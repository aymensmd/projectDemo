import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      const isAuth = !!token;
      setIsAuthenticated(isAuth);
      
      if (!isAuth) {
        navigate('/login');
      }
    };

    checkAuth();
    // Add event listener for storage changes
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, [navigate]);

  return isAuthenticated;
}; 