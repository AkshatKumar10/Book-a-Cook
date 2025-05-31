import { createContext, useContext, useState } from 'react';

const BookmarkContext = createContext();

export const BookmarkProvider = ({ children }) => {
  const [bookmarkedCooks, setBookmarkedCooks] = useState([]);

  const toggleBookmark = (cook) => {
    setBookmarkedCooks((prev) => {
      const isBookmarked = prev.some((item) => item.id === cook.id);
      if (isBookmarked) {
        return prev.filter((item) => item.id !== cook.id);
      } else {
        return [...prev, cook];
      }
    });
  };

  const isBookmarked = (cookId) => {
    return bookmarkedCooks.some((item) => item.id === cookId);
  };

  return (
    <BookmarkContext.Provider
      value={{ bookmarkedCooks, toggleBookmark, isBookmarked }}
    >
      {children}
    </BookmarkContext.Provider>
  );
};

export const useBookmark = () => useContext(BookmarkContext);
