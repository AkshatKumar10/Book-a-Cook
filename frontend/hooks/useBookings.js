import { useState, useEffect } from 'react';
import { getUserBookings } from '../utils/api';

const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [bookingLoading, setBookingLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      setBookingLoading(true);
      try {
        const data = await getUserBookings();
        setBookings(data);
      } catch (error) {
        console.error('Error fetching bookings', error);
      } finally {
        setBookingLoading(false);
      }
    };
    fetchBookings();
  }, []);

  return { bookings, bookingLoading };
};

export default useBookings;
