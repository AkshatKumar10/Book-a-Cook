import { useState, useEffect, useCallback } from 'react';
import { getCookProfile } from '../utils/api.js';

const useCookProfile = () => {
  const [data, setData] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setDataLoading(true);
    try {
      const response = await getCookProfile();
      setData(response);
    } catch (error) {
      console.error('Error fetching cook data:', error);
    } finally {
      setDataLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, dataLoading, refresh: fetchData };
};

export default useCookProfile;