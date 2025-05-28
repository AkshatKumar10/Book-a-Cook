import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  fetchSignInMethodsForEmail,
} from 'firebase/auth';
import { auth } from '../firebase';

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-brown-100">
        <View className="px-16 mt-16">
          <Text className="text-5xl mb-3 font-bold text-yellow-600 ">
            Hello
          </Text>
          <Text className="text-5xl font-bold text-yellow-600">Sign in!</Text>
        </View>
        <View
          className="bg-white"
          style={{
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            height: '70%',
            marginTop: 'auto',
          }}
        >
          <KeyboardAwareScrollView
            style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
            keyboardShouldPersistTaps="handled"
          >
            <View className="form space-y-2 px-8 pt-8">
              <Text className="text-gray-700 ml-2 text-xl mb-3">
                Email Address
              </Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
                placeholder="Enter email"
                value={email}
                onChangeText={(text) => setEmail(text)}
                keyboardType="email-address"
                autoCapitalize="none"
                editable={!loading}
              />
              <Text className="text-gray-700 ml-2 text-xl mb-3">Password</Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
                placeholder="Enter password"
                value={password}
                secureTextEntry
                onChangeText={(text) => setPassword(text)}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={handleForgotPassword}
                className="self-end mb-5"
                disabled={loading}
              >
                <Text className="text-gray-700 mt-4 text-xl">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleSubmit}
                className={`rounded-full py-3 bg-amber-700 mt-20 ${
                  loading ? 'opacity-50' : ''
                }`}
                disabled={loading}
              >
                <Text className="text-gray-900 font-bold text-center text-xl">
                  {loading ? 'Signing In...' : 'Sign In'}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-center mt-4">
              <Text className="text-slate-950 font-semibold">
                Don't have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                disabled={loading}
              >
                <Text className="text-yellow-600 font-semibold mb-10 ml-2">
                  Sign Up
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
