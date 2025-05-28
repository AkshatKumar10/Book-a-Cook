import { useState, useEffect } from 'react';
import axios from 'axios';

const useCooksData = () => {
  const [cooksData, setCooksData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCooks = async () => {
      try {
        const response = await axios.get(
          'https://6835f99c664e72d28e3f81bd.mockapi.io/Cook',
        );
        setCooksData(response.data);
      } catch (error) {
        console.error('Error fetching cook data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCooks();
  }, []);

  const allCooksPricing = cooksData.reduce((acc, cook) => {
    const cuisineType = cook.cuisine;
    const pricingMatch = cook.pricing.match(/Rs (\d+)/);
    const pricing = pricingMatch ? parseInt(pricingMatch[1]) : 0;
    acc[cuisineType] = {
      cook: cook.name,
      price: pricing,
      rating: cook.rating,
      image: cook.image,
    };
    return acc;
  }, {});

  return { cooksData, allCooksPricing, loading };
};

export default useCooksData;
