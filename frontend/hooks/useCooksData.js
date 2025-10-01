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

  // const allCooksPricing = cooksData.reduce((acc, cook) => {
  //   const cuisineType = cook.cuisine;
  //   const pricing = cook.pricing || { perDish: 0, perHour: 0 };
  //   acc[cuisineType] = {
  //     cook: cook.name,
  //     price: pricing.perDish || 0,
  //     rating: cook.rating,
  //     image: cook.profileImage || cook.image,
  //   };
  //   return acc;
  // }, {});

  return { cooksData, cooksDataLoading };
};

export default useCooksData;
