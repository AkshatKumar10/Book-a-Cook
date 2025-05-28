import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

export default function WelcomeScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-brown-100',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-yellow-950',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-slate-950',
    textAccent: theme === 'dark' ? 'text-amber-500' : 'text-yellow-600',
    buttonBg: theme === 'dark' ? 'bg-amber-600' : 'bg-amber-700',
    buttonText: theme === 'dark' ? 'text-white' : 'text-gray-900',
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#000000' : '#4A3728'} // Matches bg-brown-100
      />
      <View className="flex-1 flex justify-normal my-4">
        <View className="flex-row justify-center mt-20 mb-10">
          <Image
            source={require('../assets/splash-icon.png')}
            style={{ width: '90%', aspectRatio: 1, borderRadius: 70 }}
          />
        </View>
        <Text className={`font-bold text-2xl text-center ${themeStyles.textAccent} mt-12`}>
          Let's Get Started
        </Text>
        <Text className={`font-bold text-5xl text-center ${themeStyles.textPrimary} mt-4 mb-3`}>
          Book A Cook
        </Text>
        <View className="space-y-2">
          <TouchableOpacity
            onPress={() => navigation.navigate('SignUp')}
            className={`py-3 ${themeStyles.buttonBg} mx-7 rounded-full mb-4 mt-10`}
          >
            <Text className={`text-center text-xl font-bold ${themeStyles.buttonText}`}>
              Sign Up
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center">
            <Text className={`font-semibold ${themeStyles.textSecondary}`}>
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
              <Text className={`font-semibold mb-10 ml-2 ${themeStyles.textAccent}`}>
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}