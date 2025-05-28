import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  TextInput,
  StatusBar,
} from 'react-native';
import { useState, useContext } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { auth } from '../firebase';
import { ThemeContext } from '../context/ThemeContext';

export default function LoginScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-brown-100',
    formContainer: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-700',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-slate-950',
    textAccent: theme === 'dark' ? 'text-amber-500' : 'text-yellow-600',
    buttonBg: theme === 'dark' ? 'bg-amber-600' : 'bg-amber-700',
    buttonText: theme === 'dark' ? 'text-white' : 'text-gray-900',
    inputBg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100',
    inputText: theme === 'dark' ? 'text-white' : 'text-gray-700',
    inputPlaceholder: theme === 'dark' ? '#9ca3af' : '#6b7280', // gray-400/gray-500
  };

  const handleSubmit = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigation.navigate('HomeTabs');
    } catch (error) {
      let errorMessage = 'An error occurred during sign in';
      switch (error.code) {
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/user-not-found':
          errorMessage = 'No user found with this email. Please sign up first.';
          break;
        case 'auth/wrong-password':
          errorMessage = 'Incorrect password';
          break;
        case 'auth/too-many-requests':
          errorMessage = 'Too many attempts, please try again later';
          break;
      }
      Alert.alert('Sign In Failed', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email address first');
      return;
    }
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      if (methods.length === 0) {
        Alert.alert(
          'Email Not Found',
          'This email is not registered. Please sign up first.',
        );
        return;
      }
      await sendPasswordResetEmail(auth, email);
      Alert.alert(
        'Success',
        `A password reset link has been sent to ${email}. Please check your inbox.`,
      );
    } catch (error) {
      let errorMessage = 'Failed to send password reset email';
      if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email format';
      }
      Alert.alert('Error', errorMessage);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#000000' : '#4A3728'} // Matches bg-brown-100
      />
      <View className={`flex-1 ${themeStyles.container}`}>
        <View className="px-16 mt-16">
          <Text className={`text-5xl mb-3 font-bold ${themeStyles.textAccent}`}>
            Hello
          </Text>
          <Text className={`text-5xl font-bold ${themeStyles.textAccent}`}>
            Sign in!
          </Text>
        </View>
        <View
          className={themeStyles.formContainer}
          style={{
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            height: '70%',
            marginTop: 'auto',
          }}
        >
          <KeyboardAwareScrollView
            style={{ flex: 1 }}
            keyboardShouldPersistTaps="handled"
            enableOnAndroid={true}
            extraScrollHeight={100}
            showsVerticalScrollIndicator={false}
          >
            <View className="form space-y-2 px-8 pt-8">
              <Text className={`ml-2 text-xl mb-3 ${themeStyles.textPrimary}`}>
                Email Address
              </Text>
              <TextInput
                className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-2xl mb-7`}
                placeholder="Enter email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
                placeholderTextColor={themeStyles.inputPlaceholder}
              />
              <Text className={`ml-2 text-xl mb-3 ${themeStyles.textPrimary}`}>
                Password
              </Text>
              <TextInput
                className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-2xl`}
                placeholder="Enter password"
                value={password}
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                editable={!loading}
                placeholderTextColor={themeStyles.inputPlaceholder}
              />
              <TouchableOpacity
                onPress={handleForgotPassword}
                className="self-end mb-5"
                disabled={loading}
              >
                <Text className={`mt-4 text-xl ${themeStyles.textPrimary}`}>
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className={`rounded-full py-3 ${themeStyles.buttonBg} mt-20 ${loading ? 'opacity-50' : ''}`}
                disabled={loading}
              >
                <Text className={`font-bold text-center text-xl ${themeStyles.buttonText}`}>
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
              <View className="flex-row justify-center mt-4">
                <Text className={`font-semibold ${themeStyles.textSecondary}`}>
                  Don't have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SignUp')}
                  disabled={loading}
                >
                  <Text className={`font-semibold ml-2 ${themeStyles.textAccent}`}>
                    Sign Up
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}