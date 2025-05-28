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
} from 'react-native';
import { useCallback } from 'react';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { LinearGradient } from 'expo-linear-gradient';
import { MaterialIcons } from '@expo/vector-icons';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import useCooksData from '../hooks/useCooksData';
import { SafeAreaView } from 'react-native-safe-area-context';
import useCuisinesData from '../hooks/useCuisineData';

export default function HomeScreen() {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const { cooksData, loading } = useCooksData();
  const { cuisines, loading: cuisinesLoading } = useCuisinesData();

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

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, []),
  );

  const services = [
    {
      id: 1,
      title: 'Event Catering',
      image: 'https://www.chefscater.com/static/sitefiles/blog/catering.png',
    },
    {
      id: 2,
      title: 'Cooking Classes',
      image:
        'https://www.staywithstylescottsdale.com/wp-content/uploads/2023/07/Featured-Image-7-Best-Cooking-Classes-in-Scottsdale-for-All-Ages-1024x512.jpg',
    },
  ];

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
          <FontAwesome name="user" size={width * 0.07} color="black" />
        </TouchableOpacity>
        <Text className="font-bold text-gray-900 text-center text-3xl pl-6">
          BookAChef
        </Text>
        <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
          {/* <Icon name="bell" size={width * 0.06} color="black" /> */}
        </TouchableOpacity>
      </View>
      <ScrollView
        className="flex-1 px-2"
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <View>
          <Text className="font-bold text-2xl mt-4 pl-2 mb-2">
            Recommended Cooks
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {cooksData.map((cook) => (
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
                    onPress={() => navigation.navigate('CookProfile', { cook })}
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
        </View>
        <View className="mt-4">
          <Text className="font-bold text-2xl mt-4 px-2 mb-2">
            Popular Cuisines
          </Text>

          {cuisinesLoading ? (
            <ActivityIndicator size="large" color="#38bdf8" />
          ) : (
            <View className="flex-row flex-wrap justify-between px-2">
              {cuisines.map((item, index) => (
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
                        cooks: cooksData.filter(
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
                  <Text className="font-semibold text-2xl mt-2">
                    {item.cuisine}
                  </Text>
                </View>
              ))}
            </View>
          )}
        </View>

        <View>
          <Text className="font-bold text-2xl mt-4 mb-2 ml-2">
            Cooking Services
          </Text>
          <View className="flex-row flex-wrap justify-between ml-2">
            {services.map((service) => (
              <View
                key={service.id}
                className="bg-white rounded-lg shadow-lg mb-6"
                style={{ width: width * 0.45 }}
              >
                <Image
                  source={{ uri: service.image }}
                  style={{
                    height: height * 0.15,
                    width: '100%',
                    borderTopLeftRadius: width * 0.02,
                    borderTopRightRadius: width * 0.02,
                  }}
                  resizeMode="cover"
                />
                <View className="p-2">
                  <Text className="font-semibold">{service.title}</Text>
                  <Text className="text-gray-600">Coming Soon</Text>
                </View>
              </View>
            ))}
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
