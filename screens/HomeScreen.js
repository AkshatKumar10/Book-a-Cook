import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  Alert,
  BackHandler,
  StatusBar,
  ActivityIndicator,
  TextInput,
} from 'react-native';
import { useCallback, useState } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useCooksData from '../hooks/useCooksData';
import { SafeAreaView } from 'react-native-safe-area-context';
import useCuisinesData from '../hooks/useCuisineData';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const { cooksData, allCooksPricing, loading } = useCooksData();
  const { cuisines, loading: cuisinesLoading } = useCuisinesData();
  const [searchQuery, setSearchQuery] = useState('');

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        Alert.alert('Exit App', 'Are you sure you want to exit?', [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Exit',
            style: 'destructive',
            onPress: () => BackHandler.exitApp(),
          },
        ]);
        return true;
      };
      setSearchQuery('');

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, []),
  );

  const filteredCooks = cooksData.filter(
    (cook) =>
      cook.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cook.cuisine.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredCuisines = cuisines.filter((cuisine) =>
    cuisine.cuisine.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#38bdf8" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <View className="flex-row items-center px-4 py-2">
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <FontAwesome name="user-circle" size={30} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-red-400 text-center text-3xl pl-6">
          BookAChef
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          {/* <Icon name="bell" size={width * 0.06} color="black" /> */}
        </TouchableOpacity>
      </View>
      <View className="px-4 py-2">
        <View className="flex-row items-center px-3 bg-gray-200 rounded-full">
          <AntDesign name="search1" size={20} color="#f87171" />
          <TextInput
            className=" flex-1  px-4 py-3 text-base text-gray-600"
            placeholder="Search for chefs or cuisines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            placeholderTextColor="#f87171"
            selectionColor="#f87171"
          />
        </View>
      </View>
      <ScrollView
        className="flex-1 px-2"
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <View>
          <Text className="font-bold text-2xl mt-4 pl-2 mb-2">
            Recommended Chefs
          </Text>
          {filteredCooks.length === 0 && searchQuery ? (
            <Text className="text-center text-gray-500 mt-4 text-xl">
              No chefs found for "{searchQuery}"
            </Text>
          ) : (
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {filteredCooks.map((cook) => (
                <View
                  key={cook.id}
                  style={{ padding: width * 0.015, width: width * 0.4 }}
                >
                  <View
                    className="rounded-xl overflow-hidden"
                    style={{
                      width: '100%',
                      height: height * 0.2,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate('CookProfile', { cook })
                      }
                    >
                      <Image
                        source={{ uri: cook.image }}
                        style={{
                          width: '100%',
                          height: '100%',
                        }}
                        resizeMode="cover"
                      />
                    </TouchableOpacity>
                  </View>
                  <Text className="font-semibold mt-2 text-lg">
                    Chef {cook.name}
                  </Text>
                  <Text className="text-base text-red-400">
                    {cook.cuisine} cuisine
                  </Text>
                  <Text className="text-base font-semibold text-red-400">
                    ({cook.rating})
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
        <View className="mt-4">
          <Text className="font-bold text-2xl mt-4 px-2 mb-2">
            Popular Cuisines
          </Text>
          {cuisinesLoading ? (
            <ActivityIndicator size="large" color="#38bdf8" />
          ) : filteredCuisines.length === 0 && searchQuery ? (
            <Text className="text-center text-gray-500 mt-4 text-xl">
              No cuisines found for "{searchQuery}"
            </Text>
          ) : (
            <View className="flex-row flex-wrap justify-between px-2">
              {filteredCuisines.map((item, index) => (
                <View
                  key={index}
                  className="rounded-xl mb-10"
                  style={{
                    width: width * 0.45,
                  }}
                >
                  <TouchableOpacity
                    style={{ width: '100%' }}
                    onPress={() =>
                      navigation.navigate('CuisineDetails', {
                        cuisine: item.cuisine,
                        cooks: filteredCooks.filter(
                          (cook) => cook.cuisine === item.cuisine,
                        ),
                      })
                    }
                  >
                    <Image
                      source={{ uri: item.image }}
                      style={{
                        width: '100%',
                        height: height * 0.2,
                        borderRadius: width * 0.02,
                      }}
                      resizeMode="cover"
                    />
                  </TouchableOpacity>
                  <Text className="font-semibold text-xl mt-2">
                    {item.cuisine}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <View className="mt-4 mb-6">
          <Text className="font-bold text-2xl px-2 mb-2">Special Offers</Text>
          <View className="flex-row px-2 items-center justify-between">
            <View className="w-[60%] pr-2">
              <Text className="text-red-500 text-lg">Limited Time Offer</Text>
              <Text className="font-semibold text-xl">
                10% off on your first booking
              </Text>
              <Text className="text-red-500 text-lg mb-2">
                Book a chef today and enjoy a discount on your first meal.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('BookNow', {
                    pricing: allCooksPricing,
                    isDiscounted: true,
                  })
                }
                className="bg-gray-200 py-2 px-4 rounded-full mt-2 self-start"
              >
                <Text className="text-black font-semibold text-base text-center">
                  Book Now
                </Text>
              </TouchableOpacity>
            </View>
            <View className="flex-1">
              <Image
                source={{
                  uri: 'https://static.vecteezy.com/system/resources/previews/002/098/887/large_2x/discount-special-offer-up-to-10-off-limited-time-label-template-design-illustration-vector.jpg',
                }}
                style={{
                  width: '100%',
                  height: height * 0.25,
                  borderRadius: 10,
                }}
                resizeMode="cover"
              />
            </View>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('HowItWorks')}
          className="rounded-lg shadow-lg overflow-hidden mx-2"
        >
          <LinearGradient
            colors={['#4c8bf5', '#3f51b5']}
            className="p-4 flex-row items-center justify-center"
          >
            <MaterialIcons name="info" size={30} color="white" />
            <Text className="font-bold text-white text-center text-xl">
              How It Works
            </Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
