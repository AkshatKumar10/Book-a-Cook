import { useState, useEffect } from 'react';
import { getBookmarkedCooks } from '../utils/api';

const useBookmarkedCooks = () => {
  const [bookmarkedCooks, setBookmarkedCooks] = useState([]);
  const [bookmarkLoading, setBookmarkLoading] = useState(true);

  useEffect(() => {
    const fetchBookmarkedCooks = async () => {
      setBookmarkLoading(true);
      try {
        const cooks = await getBookmarkedCooks();
        setBookmarkedCooks(cooks);
      } catch (error) {
        console.error('Error fetching bookmarked cooks:', error);
      } finally {
        setBookmarkLoading(false);
      }
    };
    fetchBookmarkedCooks();
  }, []);

  return { bookmarkedCooks, bookmarkLoading };
};

export default useBookmarkedCooks;