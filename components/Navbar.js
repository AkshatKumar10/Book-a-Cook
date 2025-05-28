import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';

const Navbar = ({ title, onBackPress }) => {
  const navigation = useNavigation();

  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress();
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="relative flex-row items-center justify-center py-2">
      <TouchableOpacity onPress={handleBackPress} className="absolute left-4">
        <Feather name="arrow-left" size={25} color="black" />
      </TouchableOpacity>
      <Text className="text-xl font-semibold text-gray-800">{title}</Text>
    </View>
  );
};

export default Navbar;
