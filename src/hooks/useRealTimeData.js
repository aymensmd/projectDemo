import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

export const useRealTimeData = (endpoint, interval = 5000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('ACCESS_TOKEN');
      
      if (!token) {
        throw new Error('No authentication token');
      }

      const response = await axios.get(endpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      setData(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  }, [endpoint]);

  useEffect(() => {
    // Initial fetch
    fetchData();

    // Set up polling interval
    const intervalId = setInterval(fetchData, interval);

    // Cleanup
    return () => clearInterval(intervalId);
  }, [fetchData, interval]);

  return { data, loading, error, refresh: fetchData };
}; 