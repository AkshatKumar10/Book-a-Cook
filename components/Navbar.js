import { View, Text, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Navbar = ({ title, onBackPress }) => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    text: theme === 'dark' ? 'text-white' : 'text-gray-800',
    iconColor: theme === 'dark' ? 'white' : 'black',
  };

  return (
    <View className={`relative flex-row items-center justify-center py-2 ${themeStyles.container}`}>
      <TouchableOpacity onPress={handleBackPress} className="absolute left-4">
        <Feather name="arrow-left" size={25} color={themeStyles.iconColor} />
      </TouchableOpacity>
      <Text className={`text-xl font-semibold ${themeStyles.text}`}>{title}</Text>
    </View>
  );
};

export default Navbar;