import { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const EditProfileScreen = ({ route }) => {
  const { width, height } = Dimensions.get('window');
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

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

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    textLabel: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    textInput: theme === 'dark' ? 'text-white' : 'text-gray-800',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    inputBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    placeholder: theme === 'dark' ? '#9ca3af' : '#9ca3af',
    iconColor: theme === 'dark' ? 'gray' : 'gray',
    buttonText: theme === 'dark' ? 'text-white' : 'text-white',
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="Edit Profile" />
      <View className="flex-1 p-6 space-y-5">
        <Text className={`mb-2 font-medium ${themeStyles.textLabel}`}>
          Full Name
        </Text>
        <View
          className={`flex-row items-center border ${themeStyles.border} rounded-xl px-4 py-1 ${themeStyles.inputBg}`}
        >
          <Ionicons
            name="person-outline"
            size={20}
            color={themeStyles.iconColor}
            className="mr-2"
          />
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            placeholder="Your full name"
            className={`flex-1 ${themeStyles.textInput}`}
            placeholderTextColor={themeStyles.placeholder}
          />
        </View>
        <Text className={`mb-2 font-medium mt-8 ${themeStyles.textLabel}`}>
          Email
        </Text>
        <View
          className={`flex-row items-center border ${themeStyles.border} rounded-xl px-4 py-1 ${themeStyles.inputBg}`}
        >
          <Ionicons
            name="mail-outline"
            size={20}
            color={themeStyles.iconColor}
            className="mr-2"
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            placeholder="you@example.com"
            keyboardType="email-address"
            className={`flex-1 ${themeStyles.textInput}`}
            placeholderTextColor={themeStyles.placeholder}
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
            <Text
              className={`text-xl font-semibold tracking-wide ${themeStyles.buttonText}`}
            >
              Save Changes
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default EditProfileScreen;
