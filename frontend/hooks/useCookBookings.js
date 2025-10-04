import { useState, useEffect } from 'react';
import { getCookBookings } from '../utils/api';

const useCookBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [cookBookingLoading, setCookBookingLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      setCookBookingLoading(true);
      const data = await getCookBookings();
      setBookings(data);
    } catch (error) {
      console.error('Error fetching cook bookings:', error);
    } finally {
      setCookBookingLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const refresh = async () => {
    setRefreshing(true);
    await fetchBookings();
    setRefreshing(false);
  };

  return { bookings, cookBookingLoading, refreshing, refresh };
};

export default useCookBookings;
