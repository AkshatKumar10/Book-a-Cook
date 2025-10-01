import { useState, useEffect } from 'react';
import { getCookById } from '../utils/api';

const useCook = (cookId) => {
  const [cook, setCook] = useState(null);
  const [cookLoading, setCookLoading] = useState(true);

  useEffect(() => {
    const fetchCook = async () => {
      if (!cookId) return;

      setCookLoading(true);
      try {
        const response = await getCookById(cookId);
        setCook(response);
      } catch (error) {
        console.error('Error fetching cook data:', error);
      } finally {
        setCookLoading(false);
      }
    };

    fetchCook();
  }, [cookId]);

  return { cook, cookLoading };
};

export default useCook;