import { View, Text, TouchableOpacity } from 'react-native';
import { useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { removeCookToken } from '../utils/api';

export default function CookDashboardScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    textAccent: theme === 'dark' ? 'text-amber-500' : 'text-amber-700',
    buttonBg: theme === 'dark' ? 'bg-amber-600' : 'bg-amber-700',
    buttonText: 'text-white',
  };

  const handleLogout = async () => {
    await removeCookToken();
    navigation.navigate('Welcome');
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View className="flex-1 justify-center items-center">
        <Text className={`text-3xl font-extrabold ${themeStyles.textAccent}`}>
          Cook Dashboard
        </Text>
        <Text className={`text-lg ${themeStyles.textSecondary} mt-2`}>
          Manage your cooking services here
        </Text>
        <TouchableOpacity
          onPress={handleLogout}
          className={`py-3 ${themeStyles.buttonBg} rounded-xl mt-8 px-8`}
        >
          <Text className={`text-center text-lg font-bold ${themeStyles.buttonText}`}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}