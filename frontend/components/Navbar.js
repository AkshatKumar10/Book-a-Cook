import { View, Text, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useContext, useState, useEffect } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({ title, onBackPress, cook, onBookmarkToggle }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const bookmarkColor = cook?.isBookmarked
    ? '#ff0000'
    : theme === 'dark'
      ? 'white'
      : 'black';

  return (
    <View
      className={`relative flex-row items-center justify-center py-2 ${theme === 'dark' ? 'bg-black' : 'bg-gray-100'}`}
    >
      <TouchableOpacity onPress={handleBackPress} className="absolute left-4">
        <Feather
          name="arrow-left"
          size={25}
          color={theme === 'dark' ? 'white' : 'black'}
        />
      </TouchableOpacity>

      <Text
        className={`text-xl font-semibold ${theme === 'dark' ? 'text-white' : 'text-gray-800'}`}
      >
        {title}
      </Text>

      {cook && (
        <TouchableOpacity
          onPress={onBookmarkToggle}
          className="absolute right-4"
        >
          <FontAwesome
            name={cook.isBookmarked ? 'bookmark' : 'bookmark-o'}
            size={25}
            color={bookmarkColor}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Navbar;
