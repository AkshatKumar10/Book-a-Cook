import { useState, useEffect } from 'react';
import { getCooks } from '../utils/api.js';

const useCooksData = () => {
  const [cooksData, setCooksData] = useState([]);
  const [cooksDataLoading, setCooksDataLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchCooks = async () => {
    setCooksDataLoading(true);
    try {
      const response = await getCooks();
      setCooksData(response);
    } catch (error) {
      console.error('Error fetching cook data:', error);
    } finally {
      setCooksDataLoading(false);
    }
  };

  useEffect(() => {
    fetchCooks();
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    await fetchCooks();
    setRefreshing(false);
  };

  return { cooksData, cooksDataLoading, refreshing, refresh };
};

export default useCooksData;
