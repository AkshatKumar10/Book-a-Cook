import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { FontAwesome5, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Navbar from '../components/Navbar';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useCallback, useContext, useState } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { removeUserToken } from '../utils/api';
import { useUser } from '../hooks/useUser';
import SnackbarComponent from '../components/SnackbarComponent';
import { Skeleton } from 'moti/skeleton';

const ProfileScreen = () => {
  const { user, userLoading, refresh: refreshProfile } = useUser();
  const navigation = useNavigation();
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  const handleSignOut = async () => {
    try {
      await removeUserToken();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'UserSignIn' }],
        }),
      );
    } catch (error) {
      console.error('Sign out error:', error);
      setSnackbarMessage('Failed to sign out. Please try again.');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    iconColor: theme === 'dark' ? 'white' : 'black',
    borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    buttonBg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200',
  };

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, []),
  );

  if (userLoading) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Navbar title="Profile" />
        <View className="flex-1 px-4">
          <View className="flex items-center mt-10">
            <Skeleton colorMode={theme} width={96} height={96} radius="round" />
            <View style={{ height: 12 }} />
            <Skeleton colorMode={theme} width={120} height={20} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width={160} height={16} />
          </View>
          <ScrollView
            className="flex-1 mt-10"
            contentContainerStyle={{ paddingBottom: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {[...Array(6)].map((_, index) => (
              <View
                key={index}
                className={`flex-row items-center justify-between p-3 border-b ${themeStyles.borderColor}`}
              >
                <View className="flex-row items-center gap-4">
                  <Skeleton
                    colorMode={theme}
                    width={36}
                    height={36}
                    radius="round"
                  />
                  <Skeleton colorMode={theme} width="60%" height={20} />
                </View>
                <Skeleton
                  colorMode={theme}
                  width={20}
                  height={20}
                  radius="round"
                />
              </View>
            ))}
          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="Profile" />
      <View className="flex items-center mt-10">
        {user?.profileImage ? (
          <Image
            source={{ uri: user.profileImage }}
            className={`w-24 h-24 rounded-full border ${themeStyles.borderColor}`}
          />
        ) : (
          <FontAwesome
            name="user-circle"
            size={100}
            color={themeStyles.iconColor}
          />
        )}
        <Text
          className={`font-bold text-center text-lg ${themeStyles.textPrimary}`}
        >
          {user?.username}
        </Text>
        <Text className={`text-center text-base ${themeStyles.textSecondary}`}>
          {user?.email}
        </Text>
      </View>
      <ScrollView
        className="flex-1 mt-10"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          onPress={() => navigation.navigate('EditProfileScreen')}
          className={`flex-row items-center p-3 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-9 h-9 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
          >
            <Ionicons name="person" size={20} color={themeStyles.iconColor} />
          </View>
          <Text className={`flex-1 text-lg ${themeStyles.textPrimary}`}>
            Edit Profile Info
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={themeStyles.iconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('CookList')}
          className={`flex-row items-center p-3 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-9 h-9 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
          >
            <MaterialCommunityIcons
              name="chef-hat"
              size={20}
              color={themeStyles.iconColor}
            />
          </View>
          <Text className={`flex-1 text-lg ${themeStyles.textPrimary}`}>
            Chefs
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={themeStyles.iconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('MyBookings')}
          className={`flex-row items-center p-3 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-9 h-9 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
          >
            <FontAwesome5
              name="calendar-alt"
              size={20}
              color={themeStyles.iconColor}
            />
          </View>
          <Text className={`flex-1 text-lg ${themeStyles.textPrimary}`}>
            Bookings
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={themeStyles.iconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('mailto:bookachef@gmail.com')}
          className={`flex-row items-center p-3 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-9 h-9 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
          >
            <FontAwesome5
              name="phone"
              size={20}
              color={themeStyles.iconColor}
            />
          </View>
          <Text className={`flex-1 text-lg ${themeStyles.textPrimary}`}>
            Contact Us
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={themeStyles.iconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleTheme}
          className={`flex-row items-center p-3 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-9 h-9 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
          >
            <MaterialIcons
              name={theme === 'dark' ? 'light-mode' : 'dark-mode'}
              size={20}
              color={themeStyles.iconColor}
            />
          </View>
          <Text className={`flex-1 text-lg ${themeStyles.textPrimary}`}>
            {theme === 'dark'
              ? 'Switch to Light Theme'
              : 'Switch to Dark Theme'}
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={themeStyles.iconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignOut}
          className={`flex-row items-center p-3 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-9 h-9 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
          >
            <MaterialIcons
              name="logout"
              size={20}
              color={themeStyles.iconColor}
            />
          </View>
          <Text className={`flex-1 text-lg ${themeStyles.textPrimary}`}>
            Sign Out
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={themeStyles.iconColor}
          />
        </TouchableOpacity>
      </ScrollView>
      <SnackbarComponent
        visible={snackbarVisible}
        onDismiss={() => setSnackbarVisible(false)}
        message={snackbarMessage}
        type={snackbarType}
      />
    </SafeAreaView>
  );
};

export default ProfileScreen;
