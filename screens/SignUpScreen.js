import { View, Text, TouchableOpacity, Alert, TextInput } from 'react-native';
import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../firebase';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

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
    <SafeAreaView className="flex-1">
      <View className="flex-1 bg-brown-100">
        <View className="px-16 mt-16">
          <Text className="text-5xl mb-3 font-bold text-yellow-600">
            Create your
          </Text>
          <Text className="text-5xl font-bold text-yellow-600">Account</Text>
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
              <Text className="text-gray-700 ml-2 text-xl mb-3">Full Name</Text>
              <TextInput
                className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
                placeholder="Enter name"
                value={fullName}
                onChangeText={(text) => setFullName(text)}
                autoCapitalize="words"
                editable={!loading}
              />
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
                onPress={handleSubmit}
                className={`rounded-full py-3 bg-amber-700 mt-20 ${
                  loading ? 'opacity-50' : ''
                }`}
                disabled={loading}
              >
                <Text className="text-gray-900 font-bold text-center text-xl">
                  {loading ? 'Signing Up...' : 'Sign Up'}
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row justify-center mt-4">
              <Text className="text-slate-950 font-semibold">
                Already have an account?
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                disabled={loading}
              >
                <Text className="text-yellow-600 font-semibold mb-10 ml-2">
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </View>
    </SafeAreaView>
  );
}
