import { useCallback, useEffect, useState } from 'react';
import { getUser } from '../utils/api';

export const useUser = () => {
  const [user, setUser] = useState(null);
  const [userLoading, setUserLoading] = useState(true);

  const fetchUser = useCallback(async () => {
    setUserLoading(true);
    try {
      const response = await getUser();
      setUser(response.user);
    } catch (err) {
      console.error('Error fetching user data:', err);
    } finally {
      setUserLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, []);

  return { user, userLoading, refresh: fetchUser };
};
