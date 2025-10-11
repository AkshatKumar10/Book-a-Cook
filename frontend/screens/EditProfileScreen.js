import { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useUser } from '../hooks/useUser';
import { updateUserProfile } from '../utils/api';
import SnackbarComponent from '../components/SnackbarComponent';
import { Keyboard } from 'react-native';
import { Skeleton } from 'moti/skeleton';

const EditProfileScreen = () => {
  const { user, userLoading } = useUser();
  const { theme } = useContext(ThemeContext);
  const [fullName, setFullName] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  useEffect(() => {
    if (user) {
      setFullName(user.username);
      setEmail(user.email);
    }
  }, [user]);

  const handleSave = async () => {
    if (fullName === user.username && email === user.email) {
      Keyboard.dismiss();
      setSnackbarMessage('No changes to save.');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return;
    }
    try {
      await updateUserProfile({ username: fullName, email });
      Keyboard.dismiss();
      setSnackbarMessage('Profile updated successfully');
      setSnackbarType('success');
      setSnackbarVisible(true);
    } catch (error) {
      console.error('Error updating profile:', error);
      Keyboard.dismiss();
      setSnackbarMessage('Failed to update profile');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    textLabel: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    textInput: theme === 'dark' ? 'text-white' : 'text-gray-800',
    border: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    inputBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    placeholder: theme === 'dark' ? '#9ca3af' : '#9ca3af',
    iconColor: theme === 'dark' ? 'gray' : 'gray',
    buttonText: theme === 'dark' ? 'text-white' : 'text-white',
  };

  if (userLoading) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Navbar title="Edit Profile" />
        <View className="flex-1 p-6 space-y-5">
          <Skeleton colorMode={theme} width={100} height={20} />
          <View className={`rounded-xl mb-6 mt-2`}>
            <Skeleton colorMode={theme} width="100%" height={40} />
          </View>
          <Skeleton colorMode={theme} width={80} height={20} />
          <View className={`rounded-xl mb-8 mt-2`}>
            <Skeleton colorMode={theme} width="100%" height={40} />
          </View>
          <Skeleton
            colorMode={theme}
            width="100%"
            height={55}
            radius={12}
            style={{ marginTop: 24 }}
          />
        </View>
      </SafeAreaView>
    );
  }

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
      <SnackbarComponent
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        type={snackbarType}
      />
    </SafeAreaView>
  );
};

export default EditProfileScreen;
