import { useState, useEffect } from 'react';
import { getCooks } from '../utils/api.js';

const useCooksData = () => {
  const [cooksData, setCooksData] = useState([]);
  const [cooksDataLoading, setCooksDataLoading] = useState(true);

  useEffect(() => {
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
    fetchCooks();
  }, []);

  return { cooksData, cooksDataLoading };
};

export default useCooksData;
