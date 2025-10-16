import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useContext,useState,useEffect } from 'react';
import Navbar from '../components/Navbar';
import useCook from '../hooks/useCook';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { getTime } from '../utils/getTime';
import { Skeleton } from 'moti/skeleton';
import SnackbarComponent from '../components/SnackbarComponent';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { bookmarkCook, unbookmarkCook } from '../utils/api';

const CookProfileScreen = () => {
  const route = useRoute();
  const cookId = route.params?.cookId;
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { cook, cookLoading } = useCook(cookId);
  const { theme } = useContext(ThemeContext);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-900',
    textAccent: theme === 'dark' ? 'text-red-300' : 'text-red-400',
    buttonBg: theme === 'dark' ? 'bg-orange-600' : 'bg-orange-700',
    buttonText: theme === 'dark' ? 'text-white' : 'text-white',
    specialtyBg: theme === 'dark' ? 'bg-gray-800' : 'bg-[#f9f7f7]',
    specialtyBorder: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    specialtyText: theme === 'dark' ? 'text-gray-200' : 'text-gray-900',
  };

  const handleBookNow = () => {
    navigation.navigate('BookingPageScreen', {
      cookId: cook.id,
      isDiscounted: false,
    });
  };

  useEffect(() => {
    if (cook?.id) {
      const fetchBookmarks = async () => {
        const storedBookmarks = JSON.parse(
          (await AsyncStorage.getItem('bookmarkedCooks')) || '[]',
        );
        setIsBookmarked(storedBookmarks.includes(cook.id));
      };
      fetchBookmarks();
    }
  }, [cook]);

  const handleBookmarkToggle = async () => {
    try {
      const storedBookmarks = JSON.parse(
        (await AsyncStorage.getItem('bookmarkedCooks')) || '[]',
      );

      if (isBookmarked) {
        const res = await unbookmarkCook(cook.id);
        const updatedBookmarks = storedBookmarks.filter((id) => id !== cook.id);
        await AsyncStorage.setItem(
          'bookmarkedCooks',
          JSON.stringify(updatedBookmarks),
        );
        setIsBookmarked(false);
        setSnackbarMessage(res?.message);
        setSnackbarType('success');
        setSnackbarVisible(true);
      } else {
        const res = await bookmarkCook(cook.id);
        storedBookmarks.push(cook.id);
        await AsyncStorage.setItem(
          'bookmarkedCooks',
          JSON.stringify(storedBookmarks),
        );
        setIsBookmarked(true);
        setSnackbarMessage(res?.message);
        setSnackbarType('success');
        setSnackbarVisible(true);
      }
    } catch (error) {
      console.error('Error toggling bookmark:', error);
      setSnackbarMessage(error.message);
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  if (cookLoading) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <ScrollView
          contentContainerStyle={{ paddingBottom: 10 }}
          showsVerticalScrollIndicator={false}
        >
          <Navbar title="Chef Profile" />
          <View className="items-center mt-4">
            <Skeleton
              colorMode={theme}
              width={width * 0.3}
              height={width * 0.3}
              radius="round"
            />
            <View style={{ height: 16 }} />
            <Skeleton colorMode={theme} width={150} height={24} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width={200} height={18} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width={120} height={20} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width={180} height={18} />
          </View>
          <View className="mt-6 pl-4">
            <Skeleton colorMode={theme} width="40%" height={24} />
            <View className="flex-row flex-wrap gap-2 mt-4">
              {[...Array(5)].map((_, index) => (
                <Skeleton
                  key={index}
                  colorMode={theme}
                  width={100}
                  height={32}
                  radius={16}
                />
              ))}
            </View>
          </View>
          <View className="mt-8 pl-4">
            <Skeleton colorMode={theme} width={120} height={24} />
            <View className="mb-4"></View>
            <Skeleton colorMode={theme} width="90%" height={60} />
          </View>
          <View className="mt-8 pl-4">
            <Skeleton colorMode={theme} width="50%" height={24} />
            <View className="mb-4"></View>
            <Skeleton colorMode={theme} width="80%" height={30} />
          </View>
          <View className="mt-8 pl-4">
            <Skeleton
              colorMode={theme}
              width={120}
              height={24}
              style={{ marginBottom: 16 }}
            />
            <View
              className={`flex-row justify-around items-center rounded-xl p-5`}
            >
              <View className="items-center">
                <Skeleton colorMode={theme} width={80} height={16} />
                <View className="mb-2"></View>
                <Skeleton colorMode={theme} width={60} height={24} />
              </View>
              <Skeleton colorMode={theme} width={2} height={48} />
              <View className="items-center">
                <Skeleton colorMode={theme} width={80} height={16} />
                <View className="mb-2"></View>
                <Skeleton colorMode={theme} width={60} height={24} />
              </View>
            </View>
          </View>
          <View className="px-6 mb-8 mt-10">
            <Skeleton colorMode={theme} width="100%" height={48} radius={24} />
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar
        title="Chef Profile"
        cook={{ ...cook, isBookmarked }}
        onBookmarkToggle={handleBookmarkToggle}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 10 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="items-center mt-4">
          <Image
            source={{ uri: cook.image }}
            className="rounded-full mb-4"
            style={{
              width: width * 0.3,
              height: width * 0.3,
            }}
            resizeMode="cover"
          />
          <Text className={`font-semibold text-3xl ${themeStyles.textPrimary}`}>
            Chef {cook.name}
          </Text>
          <Text className={`text-center px-16 mt-1 ${themeStyles.textAccent}`}>
            {cook.cuisine} Cuisine Expert
          </Text>
          <Text className={`text-lg mt-1 ${themeStyles.textSecondary}`}>
            {cook.experienceLevel} years of Experience
          </Text>
          <View className="flex-row items-center justify-center mt-1">
            <Text className={`text-base ${themeStyles.textSecondary}`}>
              📍 {cook.location}
            </Text>
            <Text className={`text-base ${themeStyles.textSecondary} mx-2`}>
              |
            </Text>
            <Text className={`text-base ${themeStyles.textSecondary}`}>
              {getTime(cook.createdAt)}
            </Text>
          </View>
        </View>
        <View className="mt-6">
          {cook.specialties && cook.specialties.length > 0 && (
            <>
              <Text
                className={`font-bold text-2xl ml-6 ${themeStyles.textPrimary}`}
              >
                Specialties
              </Text>
              <View className="flex-row flex-wrap ml-6 mt-4">
                {(typeof cook.specialties === 'string'
                  ? cook.specialties.split(',')
                  : cook.specialties
                ).map((specialty, index) => (
                  <View
                    key={index}
                    className={`rounded-full py-2 px-3 mr-3 mb-2 ${themeStyles.specialtyBg} ${themeStyles.specialtyBorder}`}
                    style={{ alignSelf: 'flex-start' }}
                  >
                    <Text
                      className={`text-base font-semibold ${themeStyles.specialtyText}`}
                    >
                      {typeof specialty === 'string'
                        ? specialty.trim()
                        : specialty.name}
                    </Text>
                  </View>
                ))}
              </View>
            </>
          )}
          <View>
            <Text
              className={`font-bold text-2xl ml-6 mt-6 ${themeStyles.textPrimary}`}
            >
              About
            </Text>
            <Text className={`text-lg mx-6 mt-2 ${themeStyles.textSecondary}`}>
              {cook.bio}
            </Text>
          </View>
        </View>
        <View className="mt-6 px-6">
          <Text className={`font-bold text-2xl ${themeStyles.textPrimary}`}>
            Services
          </Text>
          <Text className={`text-lg mt-1 ${themeStyles.textSecondary}`}>
            {cook.servicesOffered?.join(', ')}
          </Text>
        </View>
        <View className="mt-6 px-6">
          <Text
            className={`font-bold text-2xl mb-4 ${themeStyles.textPrimary}`}
          >
            Pricing
          </Text>
          <View
            className={`flex-row justify-around items-center rounded-xl p-5 ${theme === 'dark' ? 'bg-orange-600' : 'bg-yellow-400'} shadow-lg`}
          >
            <View className="items-center">
              <Text className="text-sm font-semibold text-white">Per Dish</Text>
              <Text className="text-xl font-bold text-white mt-1">
                ₹{cook.pricing?.perDish}
              </Text>
            </View>
            <View className="w-0.5 h-12 bg-white opacity-50" />
            <View className="items-center">
              <Text className="text-sm font-semibold text-white">Per Hour</Text>
              <Text className="text-xl font-bold text-white mt-1">
                ₹{cook.pricing?.perHour}
              </Text>
            </View>
          </View>
        </View>

        <View className="px-6 mb-8 mt-10">
          <TouchableOpacity
            onPress={handleBookNow}
            className={`rounded-full shadow-lg overflow-hidden ${themeStyles.buttonBg} py-4`}
          >
            <Text
              className={`font-bold text-lg text-center ${themeStyles.buttonText}`}
            >
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
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

export default CookProfileScreen;
