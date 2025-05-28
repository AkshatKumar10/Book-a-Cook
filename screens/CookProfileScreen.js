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
import { useNavigation } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import useCooksData from '../hooks/useCooksData';

const CookProfileScreen = ({ route }) => {
  const { cook } = route.params;
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { cooksData } = useCooksData();

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
    <SafeAreaView className="flex-1 bg-gray-100">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
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
          <Text className="font-semibold text-3xl">Chef {cook.name}</Text>
          <Text className="text-lg text-red-400">
            {cook.cuisine} Cuisine Expert
          </Text>
          <Text className="text-lg text-red-400">{cook.rating}</Text>
        </View>
        <Text className="font-bold text-2xl ml-4 mt-6">Bio</Text>
        <Text className="text-lg mx-4 mt-2">{cook.bio}</Text>
        <View className="mt-6">
          <Text className="font-bold text-2xl ml-4">Specialties</Text>
          <View className="flex-row flex-wrap ml-4 mt-2">
            {cook.specialties.map((specialty, index) => (
              <View
                key={index}
                className="bg-[#f9f7f7] border rounded-full py-2 px-3 mr-3 mb-2"
                style={{ alignSelf: 'flex-start' }}
              >
                <Text className="text-base font-semibold text-gray-900">
                  {specialty.name}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View className="mt-6 px-4">
          <Text className="font-bold text-2xl ">Experience</Text>
          <Text className="text-lg  mt-1">{cook.yearsOfExperience}</Text>
        </View>

        <View className="mt-6 px-4">
          <Text className="font-bold text-2xl ">Services</Text>
          <Text className="text-lg  mt-1">{cook.services.join(', ')}</Text>
        </View>

        <View className="mt-6 px-4">
          <Text className="font-bold text-2xl ">Pricing</Text>
          <Text className="text-lg  mt-1">{cook.pricing}</Text>
        </View>

        <View className="mt-6 px-4">
          <Text className="font-bold text-2xl ">Availability</Text>
          <Text className="text-lg mt-1 mb-8">{cook.availability}</Text>
        </View>

        <View className="px-4 mb-8">
          <TouchableOpacity
            onPress={handleBookNow}
            className="rounded-full shadow-lg overflow-hidden bg-orange-700 py-4"
          >
            <Text className="font-bold text-white text-lg ml-2 text-center">
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default CookProfileScreen;
