import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  useWindowDimensions,
  Alert,
  BackHandler,
  TextInput,
} from 'react-native';
import { useCallback, useState, useContext } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useCooksData from '../hooks/useCooksData';
import { SafeAreaView } from 'react-native-safe-area-context';
import useCuisinesData from '../hooks/useCuisineData';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ThemeContext } from '../context/ThemeContext';
import { Skeleton } from 'moti/skeleton';
import { StatusBar } from 'expo-status-bar';
import Feather from '@expo/vector-icons/Feather';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const { cooksData, allCooksPricing, loading } = useCooksData();
  const { cuisines, loading: cuisinesLoading } = useCuisinesData();
  const { theme } = useContext(ThemeContext);
  const [searchQuery, setSearchQuery] = useState('');
  const [imageLoadedState, setImageLoadedState] = useState({});
  const handleImageLoad = (id) => {
    setImageLoadedState((prev) => ({ ...prev, [id]: true }));
  };

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    textAccent: theme === 'dark' ? 'text-red-300' : 'text-red-400',
    textNoResults: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    iconColor: theme === 'dark' ? 'white' : 'black',
    searchBg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200',
    searchIconColor: theme === 'dark' ? '#f4a8a8' : '#f87171',
    searchText: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    searchPlaceholder: theme === 'dark' ? '#f4a8a8' : '#f87171',
    buttonBg: theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200',
    buttonText: theme === 'dark' ? 'text-white' : 'text-black',
    loadingColor: theme === 'dark' ? '#60a5fa' : '#38bdf8',
    empty: theme === 'dark' ? '#ffffff' : '#000000',
  };

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

  if (loading || cuisinesLoading) {
    return (
      <SafeAreaView
        className={`flex-1 ${themeStyles.container}`}
        style={{ padding: 16 }}
      >
        <ScrollView showsVerticalScrollIndicator={false}>
          <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
          <View className="flex-row items-center mb-4 gap-8">
            <Skeleton colorMode={theme} width={40} height={40} radius="round" />
            <Skeleton colorMode={theme} width={'60%'} height={30} />
          </View>
          <View className="mb-6">
            <Skeleton colorMode={theme} width="100%" height={40} radius={20} />
          </View>
          <View className="mb-4">
            <Skeleton colorMode={theme} width={'60%'} height={30} />
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {[...Array(3)].map((_, i) => (
              <View key={i} style={{ marginBottom: 20, marginRight: 16 }}>
                <Skeleton
                  colorMode={theme}
                  width={width * 0.4}
                  height={height * 0.2}
                  radius={10}
                />
                <View style={{ height: 12 }} />
                <Skeleton
                  colorMode={theme}
                  width={width * 0.35}
                  height={20}
                  radius={10}
                />
                <View style={{ height: 8 }} />
                <Skeleton
                  colorMode={theme}
                  width={width * 0.3}
                  height={20}
                  radius={10}
                />
                <View style={{ height: 8 }} />
                <Skeleton
                  colorMode={theme}
                  width={width * 0.1}
                  height={20}
                  radius={10}
                />
              </View>
            ))}
          </ScrollView>
          <View style={{ height: 10 }} />
          <Skeleton colorMode={theme} width={'55%'} height={30} />
          <View style={{ height: 14 }} />
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              marginBottom: 20,
            }}
          >
            {[...Array(4)].map((_, i) => (
              <View
                key={i}
                style={{
                  width: (width - 48) / 2,
                  marginBottom: 20,
                  borderRadius: 10,
                }}
              >
                <Skeleton
                  colorMode={theme}
                  width="100%"
                  height={height * 0.2}
                  radius={10}
                />
                <View style={{ height: 12 }} />
                <Skeleton
                  colorMode={theme}
                  width="70%"
                  height={20}
                  radius={10}
                />
              </View>
            ))}
          </View>
          <View style={{ height: 10 }} />
          <Skeleton colorMode={theme} width={'50%'} height={30} />
          <View style={{ flexDirection: 'row', width: '100%', gap: 16 }}>
            <View style={{ width: '60%' }}>
              <View style={{ height: 24 }} />
              <Skeleton colorMode={theme} width="100%" height={150} />
              <View style={{ height: 16 }} />
              <Skeleton colorMode={theme} width="53%" height={30} radius={20} />
            </View>
            <View style={{ width: '35%' }}>
              <Skeleton
                colorMode={theme}
                width="100%"
                height={200}
                radius={20}
              />
            </View>
          </View>
          <View style={{ height: 30 }} />
          <Skeleton colorMode={theme} width={'100%'} height={60} />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View className="flex-row items-center px-4 py-2 justify-between">
        <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
          <FontAwesome
            name="user-circle"
            size={30}
            color={themeStyles.iconColor}
          />
        </TouchableOpacity>
        <Text
          className={`font-bold ${themeStyles.textAccent} text-center text-3xl`}
        >
          BookAChef
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Bookmark')}>
          <Feather
            name="bookmark"
            size={25}
            color={themeStyles.bookmarkColor}
          />
          {/* <Icon name="bell" size={width * 0.06} color={themeStyles.iconColor} /> */}
        </TouchableOpacity>
      </View>
      <View className="px-4 py-2">
        <View
          className={`flex-row items-center px-3 ${themeStyles.searchBg} rounded-full`}
        >
          <AntDesign
            name="search1"
            size={20}
            color={themeStyles.searchIconColor}
          />
          <TextInput
            className={`flex-1 px-4 py-3 text-base ${themeStyles.searchText}`}
            placeholder="Search for chefs or cuisines..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            placeholderTextColor={themeStyles.searchPlaceholder}
            selectionColor={themeStyles.searchIconColor}
          />
        </View>
      </View>
      <ScrollView
        className="flex-1 px-2"
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <View>
          <Text
            className={`font-bold text-2xl mt-4 pl-2 mb-2 ${themeStyles.textPrimary}`}
          >
            Recommended Chefs
          </Text>
          {filteredCooks.length === 0 && searchQuery ? (
            <View className="items-center justify-center mt-4">
              <AntDesign name="frown" size={80} color={themeStyles.empty} />
              <Text
                className={`ml-2 text-center mt-2 ${themeStyles.textNoResults} text-xl`}
              >
                No chefs found for "{searchQuery}"
              </Text>
            </View>
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
                    {!imageLoadedState[cook.id] && (
                      <Skeleton
                        colorMode={theme}
                        width="100%"
                        height={'100%'}
                        radius={10}
                      />
                    )}
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
                        onLoad={() => handleImageLoad(cook.id)}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text
                    className={`font-semibold mt-2 text-lg ${themeStyles.textPrimary}`}
                  >
                    Chef {cook.name}
                  </Text>
                  <Text className={`text-base ${themeStyles.textAccent}`}>
                    {cook.cuisine} cuisine
                  </Text>
                  <Text
                    className={`text-base font-semibold ${themeStyles.textAccent}`}
                  >
                    ({cook.rating})
                  </Text>
                </View>
              ))}
            </ScrollView>
          )}
        </View>
        <View className="mt-4">
          <Text
            className={`font-bold text-2xl mt-4 px-2 mb-2 ${themeStyles.textPrimary}`}
          >
            Popular Cuisines
          </Text>
          {filteredCuisines.length === 0 && searchQuery ? (
            <View className="items-center justify-center mt-4">
              <AntDesign name="frown" size={80} color={themeStyles.empty} />
              <Text
                className={`ml-2 text-center mt-2 ${themeStyles.textNoResults} text-xl`}
              >
                No cuisines found for "{searchQuery}"
              </Text>
            </View>
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
                  <View
                    style={{
                      width: '100%',
                      height: height * 0.2,
                      borderRadius: width * 0.02,
                      overflow: 'hidden',
                    }}
                  >
                    {!imageLoadedState[item.cuisine] && (
                      <Skeleton
                        colorMode={theme}
                        width="100%"
                        height="100%"
                        radius={10}
                      />
                    )}
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
                        onLoad={() => handleImageLoad(item.cuisine)}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text
                    className={`font-semibold text-xl mt-2 ${themeStyles.textPrimary}`}
                  >
                    {item.cuisine}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>
        <View className="mt-4 mb-6">
          <Text
            className={`font-bold text-2xl px-2 mb-2 ${themeStyles.textPrimary}`}
          >
            Special Offers
          </Text>
          <View className="flex-row px-2 items-center justify-between">
            <View className="w-[60%] pr-2">
              <Text className={`text-lg ${themeStyles.textAccent}`}>
                Limited Time Offer
              </Text>
              <Text
                className={`font-semibold text-xl ${themeStyles.textPrimary}`}
              >
                10% off on your first booking
              </Text>
              <Text className={`text-lg ${themeStyles.textAccent} mb-2`}>
                Book a chef today and enjoy a discount on your first meal.
              </Text>
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('BookingPageScreen', {
                    pricing: allCooksPricing || {},
                    cuisine: Object.keys(allCooksPricing)[0] || 'North Indian',
                    isDiscounted: true,
                  })
                }
                className={`${themeStyles.buttonBg} py-2 px-4 rounded-full mt-2 self-start`}
              >
                <Text
                  className={`font-semibold text-base text-center ${themeStyles.buttonText}`}
                >
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
