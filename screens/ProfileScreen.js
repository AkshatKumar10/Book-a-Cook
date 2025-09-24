import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import {
  FontAwesome5,
  MaterialIcons,
  Ionicons,
  AntDesign,
} from '@expo/vector-icons';
import { Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Navbar from '../components/Navbar';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();
  const { theme, toggleTheme } = useContext(ThemeContext);

  const user = auth.currentUser;
  const routeFullName = route?.params?.fullName;
  const routeEmail = route?.params?.email;

  const fullName = routeFullName || user?.displayName || 'Guest';
  const email = routeEmail || user?.email || 'guest@example.com';

  const handleSignOut = async () => {
    try {
      await signOut(auth);
      navigation.navigate('SignIn');
    } catch (error) {
      console.error('Sign out error:', error);
      Alert.alert('Error', 'Failed to sign out. Please try again.');
    }
  };

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    iconColor: theme === 'dark' ? 'white' : 'black',
    borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    buttonBg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200',
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="Profile" />
      <View className="flex items-center mt-10">
        <FontAwesome
          name="user-circle"
          size={100}
          color={themeStyles.iconColor}
        />
        <Text
          className={`font-bold text-center text-lg ${themeStyles.textPrimary}`}
        >
          {fullName}
        </Text>
        <Text className={`text-center text-base ${themeStyles.textSecondary}`}>
          {email}
        </Text>
      </View>
      <ScrollView
        className="flex-1 mt-10"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditProfileScreen', {
              fullName,
              email,
            })
          }
          className={`flex-row items-center p-4 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-8 h-8 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
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
          onPress={() => navigation.navigate('MyBookings')}
          className={`flex-row items-center p-4 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-8 h-8 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
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
          className={`flex-row items-center p-4 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-8 h-8 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
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
          onPress={() => navigation.navigate('HowItWorks')}
          className={`flex-row items-center p-4 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-8 h-8 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
          >
            <AntDesign
              name="info-circle"
              size={20}
              color={themeStyles.iconColor}
            />
          </View>
          <Text className={`flex-1 text-lg ${themeStyles.textPrimary}`}>
            How It Works
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={themeStyles.iconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('FAQScreen')}
          className={`flex-row items-center p-4 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-8 h-8 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
          >
            <MaterialIcons
              name="live-help"
              size={20}
              color={themeStyles.iconColor}
            />
          </View>
          <Text className={`flex-1 text-lg ${themeStyles.textPrimary}`}>
            FAQ
          </Text>
          <Ionicons
            name="chevron-forward"
            size={20}
            color={themeStyles.iconColor}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleTheme}
          className={`flex-row items-center p-4 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-8 h-8 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
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
          className={`flex-row items-center p-4 border-b ${themeStyles.borderColor}`}
        >
          <View
            className={`w-8 h-8 items-center justify-center ${themeStyles.buttonBg} rounded-full mr-4`}
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
    </SafeAreaView>
  );
};

export default ProfileScreen;
