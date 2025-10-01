import { useEffect, useState } from 'react';
import { getUser } from '../utils/api';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      setUserLoading(true);
      try {
        const response = await getUser();
        setUser(response.user);
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setUserLoading(false);
      }
    };
    fetchUser();
  }, []);

  return { user, userLoading };
};
