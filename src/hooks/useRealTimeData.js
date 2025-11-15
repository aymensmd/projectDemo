import { useState, useEffect, useCallback } from 'react';
import axios from '../axios';

export const useRealTimeData = (url, interval = 30000) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPolling, setIsPolling] = useState(true);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const token = localStorage.getItem('ACCESS_TOKEN');
      const response = await axios.get(url, {
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      if (response.status === 200) {
        setData(Array.isArray(response.data) ? response.data : []);
      } else {
        throw new Error('Invalid response format');
      }
    } catch (err) {
      console.error(`Error fetching ${url}:`, err.response?.status, err.response?.data);
      setData([]);
      setError(null); // Don't display error UI
      setIsPolling(false);
    } finally {
      setLoading(false);
    }
  }, [url]);

  useEffect(() => {
    if (!isPolling) return;

    fetchData();
    const intervalId = setInterval(fetchData, interval);

    return () => clearInterval(intervalId);
  }, [fetchData, interval, isPolling]);

  const refresh = useCallback(() => {
    setIsPolling(true);
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refresh };
};