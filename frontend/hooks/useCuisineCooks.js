import { useState, useEffect } from 'react';
import { getCooksByCuisine } from '../utils/api.js';

const useCuisineCooks = (cuisine) => {
  const [chefs, setChefs] = useState([]);
  const [chefsLoading, setChefsLoading] = useState(true);

  useEffect(() => {
    const fetchCuisineCooks = async () => {
      if (!cuisine) {
        setChefsLoading(false);
        return;
      }

      setChefsLoading(true);
      try {
        const response = await getCooksByCuisine(cuisine);
        setChefs(response);
        setChefsLoading(false);
      } catch (err) {
        console.error('Error fetching cuisine cooks:', err);
        setChefsLoading(false);
      }
    };

    fetchCuisineCooks();
  }, [cuisine]);

  return { chefs, chefsLoading };
};

export default useCuisineCooks;
