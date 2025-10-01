import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { loginUser, storeUserToken } from '../utils/api';
import SnackbarComponent from '../components/SnackbarComponent';

export default function UserSignInScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    textAccent: theme === 'dark' ? 'text-amber-500' : 'text-amber-700',
    buttonBg: theme === 'dark' ? 'bg-amber-600' : 'bg-amber-700',
    buttonText: 'text-white',
    inputBg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200',
    inputText: theme === 'dark' ? 'text-white' : 'text-gray-900',
    inputPlaceholder: theme === 'dark' ? '#9ca3af' : '#6b7280',
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const credentials = { email, password };
      const { token } = await loginUser(credentials);
      await storeUserToken(token);
      navigation.navigate('HomeTabs');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error.response?.data?.message;
      Keyboard.dismiss();
      setSnackbarMessage(errorMessage);
      setSnackbarType('error');
      setSnackbarVisible(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <View className="px-4 pt-4">
        <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
          <Ionicons
            name="arrow-back"
            size={28}
            color={theme === 'dark' ? '#fff' : '#000'}
          />
        </TouchableOpacity>
      </View>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 32,
          }}
          keyboardShouldPersistTaps="handled"
        >
          <View className={`rounded-xl py-6 mx-4 mb-4`}>
            <Text
              className={`text-3xl font-extrabold ${themeStyles.textAccent} text-center tracking-wide`}
            >
              Welcome Back, User!
            </Text>
            <Text
              className={`text-lg ${themeStyles.textSecondary} text-center mt-2`}
            >
              Sign in to book your favorite cooks
            </Text>
          </View>

          <Text className={`text-lg ${themeStyles.textPrimary}`}>
            Email Address
          </Text>
          <TextInput
            className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl mb-4`}
            placeholder="Enter email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            editable={!loading}
            placeholderTextColor={themeStyles.inputPlaceholder}
          />

          <Text className={`text-lg ${themeStyles.textPrimary}`}>Password</Text>
          <View
            className={`flex-row items-center ${themeStyles.inputBg} rounded-xl mb-10 pr-4`}
          >
            <TextInput
              className={`flex-1 p-4 ${themeStyles.inputText}`}
              placeholder="Enter password"
              value={password}
              secureTextEntry={!showPassword}
              onChangeText={setPassword}
              editable={!loading}
              placeholderTextColor={themeStyles.inputPlaceholder}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Ionicons
                name={showPassword ? 'eye' : 'eye-off'}
                size={24}
                color={theme === 'dark' ? '#fff' : '#000'}
              />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={handleSubmit}
            className={`py-3 ${themeStyles.buttonBg} rounded-xl ${loading ? 'opacity-50' : ''}`}
            disabled={loading}
          >
            <Text
              className={`text-center text-lg font-bold ${themeStyles.buttonText}`}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </Text>
          </TouchableOpacity>

          <View className="flex-row justify-center mt-4">
            <Text className={`text-lg ${themeStyles.textSecondary}`}>
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('UserSignUp')}
              disabled={loading}
            >
              <Text
                className={`text-lg font-semibold ml-2 ${themeStyles.textAccent}`}
              >
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <SnackbarComponent
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        type={snackbarType}
      />
    </SafeAreaView>
  );
}
