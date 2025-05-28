import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useContext } from 'react';
import Navbar from '../components/Navbar';
import useCooksData from '../hooks/useCooksData';
import { ThemeContext } from '../context/ThemeContext';

const CookProfileScreen = () => {
  const { params: { cook } = {} } = useRoute();
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { cooksData } = useCooksData();
  const { theme } = useContext(ThemeContext);

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
    const allCooksPricing = cooksData.reduce((acc, currentCook) => {
      const pricingMatch = currentCook.pricing?.match(/\d+/);
      const price = pricingMatch ? parseInt(pricingMatch[0]) : 0;
      acc[currentCook.cuisine] = {
        cook: currentCook.name,
        price: price,
        rating: currentCook.rating,
        image: currentCook.image,
      };
      return acc;
    }, {});

    navigation.navigate('BookingPage', {
      cook: cook.name,
      cuisine: cook.cuisine,
      pricing: allCooksPricing,
    });
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#000000' : '#F3F4F6'} // Matches bg-gray-100
      />
      <Navbar title="Chef Profile" />
      <ScrollView contentContainerStyle={{ paddingBottom: 10 }}>
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
          <Text className={`text-center ${themeStyles.textAccent}`}>
            {cook.cuisine} Cuisine Expert
          </Text>
            <Text className={`text-center ${themeStyles.textAccent}`}>
            {cook.rating}
          </Text>
        </View>
        <View>
          <Text className={`font-bold text-2xl ml-6 mt-6 ${themeStyles.textPrimary}`}>
            Bio
          </Text>
            <Text className={`text-lg mx-6 mt-2 ${themeStyles.textSecondary}`}>
              {cook.bio}
            </Text>
        </View>
        <View className="mt-6">
          <Text className={`font-bold text-2xl ml-6 ${themeStyles.textPrimary}`}>
            Specialties
          </Text>
          <View className="flex-row flex-wrap ml-6 mt-4">
            {cook.specialties.map((specialty, index) => (
              <View
                key={index}
                className={`rounded-full py-2 px-3 mr-3 mb-2 ${themeStyles.specialtyBg} ${themeStyles.specialtyBorder}`}
                style={{ alignSelf: 'flex-start' }}
              >
                <Text className={`text-base font-semibold ${themeStyles.specialtyText}`}>
                  {specialty.name}
                </Text>
              </View>
            ))}
          </View>
        </View>
        <View className="mt-6 px-6">
          <Text className={`font-bold text-2xl ${themeStyles.textPrimary}`}>
            Experience
          </Text>
          <Text className={`text-lg mt-1 ${themeStyles.textSecondary}`}>
            {cook.yearsOfExperience}
          </Text>
        </View>
        <View className="mt-6 px-6">
          <Text className={`font-bold text-2xl ${themeStyles.textPrimary}`}>
            Services
          </Text>
          <Text className={`text-lg mt-1 ${themeStyles.textSecondary}`}>
            {cook.services.join(', ')}
          </Text>
        </View>
        <View className="mt-6 px-6">
          <Text className={`font-bold text-2xl ${themeStyles.textPrimary}`}>
            Pricing
          </Text>
          <Text className={`text-lg mt-1 ${themeStyles.textSecondary}`}>
            {cook.pricing}
          </Text>
        </View>
        <View className="mt-6 px-6">
          <Text className={`font-bold text-2xl ${themeStyles.textPrimary}`}>
            Availability
          </Text>
          <Text className={`text-lg mt-1 mb-8 ${themeStyles.textSecondary}`}>
            {cook.availability}
          </Text>
        </View>
        <View className="px-6 mb-8">
          <TouchableOpacity
            onPress={handleBookNow}
            className={`rounded-full shadow-lg overflow-hidden ${themeStyles.buttonBg} py-4`}
          >
            <Text className={`font-bold text-lg text-center ${themeStyles.buttonText}`}>
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CookProfileScreen;