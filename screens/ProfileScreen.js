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
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Navbar from '../components/Navbar';

const ProfileScreen = ({ route }) => {
  const navigation = useNavigation();

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

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Navbar title="Profile" />
      <View className="flex items-center mt-10">
        <FontAwesome name="user-circle" size={100} color="black" />
        <Text className="font-bold text-gray-900 text-center text-lg">
          {fullName}
        </Text>
        <Text className="text-gray-600 text-center text-base">{email}</Text>
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
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="w-8 h-8 items-center justify-center bg-gray-200 rounded-full mr-4">
            <Ionicons name="person" size={20} color="black" />
          </View>
          <Text className="flex-1 text-lg text-gray-700">
            Edit Profile Info
          </Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('MyBookings')}
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="w-8 h-8 items-center justify-center bg-gray-200 rounded-full mr-4">
            <FontAwesome5 name="calendar-alt" size={20} color="black" />
          </View>
          <Text className="flex-1 text-lg text-gray-700">Bookings</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL('mailto:bookachef@gmail.com')}
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="w-8 h-8 items-center justify-center bg-gray-200 rounded-full mr-4">
            <FontAwesome5 name="phone" size={20} color="black" />
          </View>
          <Text className="flex-1 text-lg text-gray-700">Contact Us</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('HowItWorks')}
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="w-8 h-8 items-center justify-center bg-gray-200 rounded-full mr-4">
            <AntDesign name="infocirlce" size={20} color="black" />
          </View>
          <Text className="flex-1 text-lg text-gray-700">How It Works</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('FAQScreen')}
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="w-8 h-8 items-center justify-center bg-gray-200 rounded-full mr-4">
            <MaterialIcons name="live-help" size={20} color="black" />
          </View>
          <Text className="flex-1 text-lg text-gray-700">FAQ</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignOut}
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="w-8 h-8 items-center justify-center bg-gray-200 rounded-full mr-4">
            <MaterialIcons name="logout" size={20} color="black" />
          </View>
          <Text className="flex-1 text-lg text-gray-700">Sign Out</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;
