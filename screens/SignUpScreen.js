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
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ThemeContext } from '../context/ThemeContext';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const [fullName, setFullName] = useState('');
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
    inputPlaceholder: theme === 'dark' ? '#9ca3af' : '#6b7280',
  };

  const handleSubmit = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Error', 'Please fill all fields');
      return;
    }

    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      await updateProfile(userCredential.user, {
        displayName: fullName,
      });
      navigation.navigate('HomeTabs');
    } catch (error) {
      let errorMessage = 'An error occurred during sign up';
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'This email is already registered';
          break;
        case 'auth/invalid-email':
          errorMessage = 'Invalid email format';
          break;
        case 'auth/weak-password':
          errorMessage = 'Password should be at least 6 characters';
          break;
      }
      Alert.alert('Sign Up Failed', errorMessage);
    } finally {
      setLoading(false);
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
            Create your
          </Text>
          <Text className={`text-5xl font-bold ${themeStyles.textAccent}`}>
            Account
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
                Full Name
              </Text>
              <TextInput
                className={`p-4 ${themeStyles.inputBg} ${themeStyles.inputText} rounded-2xl mb-7`}
                placeholder="Enter name"
                value={fullName}
                onChangeText={(text) => setFullName(text)}
                autoCapitalize="words"
                editable={!loading}
                placeholderTextColor={themeStyles.inputPlaceholder}
              />
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
                onPress={handleSubmit}
                className={`rounded-full py-3 ${themeStyles.buttonBg} mt-20 ${loading ? 'opacity-50' : ''}`}
                disabled={loading}
              >
                <Text
                  className={`font-bold text-center text-xl ${themeStyles.buttonText}`}
                >
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
              <View className="flex-row justify-center mt-8">
                <Text className={`font-semibold ${themeStyles.textSecondary}`}>
                  Already have an account?
                </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('SignIn')}
                  disabled={loading}
                >
                  <Text
                    className={`font-semibold ml-2 ${themeStyles.textAccent}`}
                  >
                    Sign In
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
