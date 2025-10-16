import { View, Text, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { useBookmark } from '../context/BookmarkContext';

const Navbar = ({ title, onBackPress, showBookmark = false, cook }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { toggleBookmark, isBookmarked } = useBookmark();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const handleBookmarkPress = () => {
    if (cook) {
      toggleBookmark(cook);
    } else {
      navigation.navigate('Bookmark');
    }
  };

  const isCookBookmarked = cook && isBookmarked(cook.id);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    text: theme === 'dark' ? 'text-white' : 'text-gray-800',
    iconColor: theme === 'dark' ? 'white' : 'black',
    bookmarkColor: isCookBookmarked ? '#ff0000' : theme === 'dark' ? 'white' : 'black',
  };

  return (
    <View
      className={`relative flex-row items-center justify-center py-2 ${themeStyles.container}`}
    >
      <TouchableOpacity onPress={handleBackPress} className="absolute left-4">
        <Feather name="arrow-left" size={25} color={themeStyles.iconColor} />
      </TouchableOpacity>

      <Text className={`text-xl font-semibold ${themeStyles.text}`}>
        {title}
      </Text>

      {showBookmark && (
        <TouchableOpacity
          onPress={handleBookmarkPress}
          className="absolute right-4"
        >
          {isCookBookmarked ? (
            <FontAwesome name="bookmark" size={25} color={themeStyles.bookmarkColor} />
          ) : (
            <FontAwesome name="bookmark-o" size={25} color={themeStyles.bookmarkColor} />
          )}
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Navbar;
