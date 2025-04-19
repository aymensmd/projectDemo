import { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import { useAuthCheck } from './useAuthCheck';
import { useRetryLogic } from './useRetryLogic';

export const useVacationPolling = (userId, interval = 30000) => {
  const [vacations, setVacations] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const isAuthenticated = useAuthCheck();
  const intervalRef = useRef(null);
  const isMounted = useRef(true);

  const fetchVacations = useCallback(async () => {
    if (!isAuthenticated || isLoading) return;

    try {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(`http://127.0.0.1:8000/api/vacations/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (isMounted.current) {
        setVacations(response.data);
      }
    } catch (error) {
      if (isMounted.current) {
        setError(error.response?.data?.message || error.message);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          window.location.href = '/login';
        }
      }
    } finally {
      if (isMounted.current) {
        setIsLoading(false);
      }
    }
  }, [userId, isLoading, isAuthenticated]);

  // Wrap fetchVacations with retry logic
  const { executeWithRetry } = useRetryLogic(fetchVacations);

  useEffect(() => {
    isMounted.current = true;

    // Initial fetch
    executeWithRetry();

    // Set up polling interval
    intervalRef.current = setInterval(executeWithRetry, interval);

    // Cleanup
    return () => {
      isMounted.current = false;
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [executeWithRetry, interval]);

  return {
    vacations,
    error,
    isLoading,
    refresh: executeWithRetry
  };
}; 