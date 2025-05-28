import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '../components/Navbar';

const EditProfileScreen = ({ route }) => {
  const { width, height } = Dimensions.get('window');
  const navigation = useNavigation();

  const { fullName: initialFullName = '', email: initialEmail = '' } =
    route.params;

  const [fullName, setFullName] = useState(initialFullName);
  const [email, setEmail] = useState(initialEmail);

  const handleSave = () => {
    if (!fullName.trim() || !email.trim()) {
      Alert.alert('Error', 'Please fill in all fields.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address.');
      return;
    }
    if (fullName === initialFullName && email === initialEmail) {
      Alert.alert('No Changes', 'No changes to save.');
      return;
    }
    Alert.alert('Profile Updated', 'Your profile details have been updated.', [
      {
        text: 'OK',
        onPress: () => navigation.navigate('Profile', { fullName, email }),
      },
    ]);
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Navbar
        title="Edit Profile"
        onBackPress={() => {
          navigation.navigate('Profile');
        }}
      />

      <View className="flex-1 p-6 space-y-5">
        <Text className="mb-2 text-gray-700 font-medium">Full Name</Text>
        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-1 bg-white">
          <Ionicons
            name="person-outline"
            size={20}
            color="gray"
            className="mr-2"
          />
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your full name"
            className="flex-1 text-gray-800"
            placeholderTextColor="#9ca3af"
          />
        </View>

        <Text className="mb-2 text-gray-700 font-medium mt-8">Email</Text>
        <View className="flex-row items-center border border-gray-300 rounded-xl px-4 py-1 bg-white">
          <Ionicons
            name="mail-outline"
            size={20}
            color="gray"
            className="mr-2"
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            className="flex-1 text-gray-800"
            placeholderTextColor="#9ca3af"
            autoCapitalize="none"
          />
        </View>
        <TouchableOpacity
          onPress={handleSave}
          className="rounded-xl shadow-lg overflow-hidden mt-6"
        >
          <LinearGradient
            colors={['#4c8bf5', '#3f51b5']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            className="p-4 items-center"
          >
            <Text className="text-white text-xl font-semibold tracking-wide">
              Save Changes
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
