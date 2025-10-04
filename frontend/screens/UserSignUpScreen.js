import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  BackHandler,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Keyboard,
} from 'react-native';
import { useState, useContext, useEffect } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  registerUser,
  storeUserToken,
  updateUserFcmToken,
} from '../utils/api.js';
import { getFcmToken } from '../utils/fcmUtils.js';
import SnackbarComponent from '../components/SnackbarComponent.js';

export default function UserSignUpScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { theme } = useContext(ThemeContext);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    formContainer: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    textAccent: theme === 'dark' ? 'text-amber-500' : 'text-amber-700',
    buttonBg: theme === 'dark' ? 'bg-amber-600' : 'bg-amber-700',
    buttonText: theme === 'dark' ? 'text-white' : 'text-white',
    inputBg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200',
    inputText: theme === 'dark' ? 'text-white' : 'text-gray-900',
    inputPlaceholder: theme === 'dark' ? '#9ca3af' : '#6b7280',
  };

  useEffect(() => {
    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        return true;
      },
    );
    return () => backHandler.remove();
  }, []);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const userData = {
        username: fullName,
        email,
        password,
      };
      const response = await registerUser(userData);
      await storeUserToken(response.token);
      const fcmToken = await getFcmToken();
      if (fcmToken) {
        await updateUserFcmToken({ fcmToken });
      }
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
        behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: 'center',
            paddingHorizontal: 32,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className={`rounded-xl py-6 mx-4 mb-4`}>
            <Text
              className={`text-3xl font-extrabold ${themeStyles.textAccent} text-center tracking-wide`}
            >
              Join as a User!
            </Text>
            <Text
              className={`text-lg ${themeStyles.textSecondary} text-center mt-2`}
            >
              Create your account to book cooks
            </Text>
          </View>
          <Text className={`text-lg mb-2 ${themeStyles.textPrimary}`}>
            Full Name
          </Text>
          <TextInput
            className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-xl mb-4`}
            placeholder="Enter name"
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
            editable={!loading}
            placeholderTextColor={themeStyles.inputPlaceholder}
          />
          <Text className={`text-lg mb-2 ${themeStyles.textPrimary}`}>
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
          <Text className={`text-lg mb-2 ${themeStyles.textPrimary}`}>
            Password
          </Text>
          <View
            className={`flex-row items-center ${themeStyles.inputBg} rounded-xl mb-12 pr-4`}
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
              {loading ? 'Signing Up...' : 'Sign Up'}
            </Text>
          </TouchableOpacity>
          <View className="flex-row justify-center mt-4">
            <Text className={`text-lg ${themeStyles.textSecondary}`}>
              Already have an account?
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('UserSignIn')}
              disabled={loading}
            >
              <Text
                className={`text-lg font-semibold ml-2 ${themeStyles.textAccent}`}
              >
                Sign In
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
