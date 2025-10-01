import { View, Text, Image, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-brown-100',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-yellow-950',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-slate-950',
    textAccent: theme === 'dark' ? 'text-amber-500' : 'text-yellow-600',
    userButtonBg: theme === 'dark' ? 'bg-amber-600' : 'bg-amber-700',
    cookButtonBg: theme === 'dark' ? 'bg-teal-600' : 'bg-teal-700',
    buttonText: theme === 'dark' ? 'text-white' : 'text-gray-900',
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View className="flex-1 flex justify-normal my-4">
        <View className="flex-row justify-center mt-20 mb-10">
          <Image
            source={require('../assets/splash-icon.png')}
            style={{ width: '90%', aspectRatio: 1, borderRadius: 70 }}
          />
        </View>
        <Text
          className={`font-bold text-2xl text-center ${themeStyles.textAccent} mt-12`}
        >
          Let's Get Started
        </Text>
        <Text
          className={`font-bold text-5xl text-center ${themeStyles.textPrimary} mt-4 mb-3`}
        >
          Book A Cook
        </Text>
        <Text className={`${themeStyles.textPrimary} text-center text-lg`}>
          Book a professional cook in minutes.
        </Text>
        <View className="space-y-2">
          <TouchableOpacity
            onPress={() => navigation.navigate('UserSignIn')}
            className={`py-3 ${themeStyles.userButtonBg} mx-7 rounded-full mb-2 mt-10`}
          >
            <Text
              className={`text-center text-xl font-bold ${themeStyles.buttonText}`}
            >
              Sign In / Sign Up as User
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate('CookSignIn')}
            className={`py-3 ${themeStyles.cookButtonBg} mx-7 rounded-full mb-10 mt-2`}
          >
            <Text
              className={`text-center text-xl font-bold ${themeStyles.buttonText}`}
            >
              Sign In / Sign Up as Cook
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
