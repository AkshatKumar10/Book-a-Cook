import { useEffect, useState } from 'react';

export default function useCuisinesData() {
  const [cuisines, setCuisines] = useState([]);
  const [cuisineLoading, setCuisineLoading] = useState(true);

  useEffect(() => {
    const fetchCuisines = async () => {
      try {
        const response = await fetch(
          'https://6835f99c664e72d28e3f81bd.mockapi.io/Cuisine',
        );
        const data = await response.json();
        setCuisines(data);
      } catch (error) {
        console.error('Failed to fetch cuisines:', error);
      } finally {
        setCuisineLoading(false);
      }
    };

    fetchCuisines();
  }, []);

  return { cuisines, cuisineLoading };
}
