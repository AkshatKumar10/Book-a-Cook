import { useState, useContext } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  useWindowDimensions,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import AntDesign from '@expo/vector-icons/AntDesign';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { Skeleton } from 'moti/skeleton';

export default function CuisineDetails() {
  const { width, height } = useWindowDimensions();
  const route = useRoute();
  const { cuisine, cooks } = route.params;
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
    searchBg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100',
    searchBorder: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    searchIconColor: theme === 'dark' ? '#f4a8a8' : '#f87171', // Lighter red for dark mode
    searchText: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    searchPlaceholder: theme === 'dark' ? '#f4a8a8' : '#f87171',
  };

  const specialties = cooks.reduce((acc, cook) => {
    return [...acc, ...cook.specialties];
  }, []);

  const filteredSpecialties = specialties.filter((specialty) =>
    specialty.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title={cuisine} />
      <View className="px-6 pt-2 pb-6">
        <View
          className={`flex-row items-center ${themeStyles.searchBg} ${themeStyles.searchBorder} rounded-lg px-3`}
        >
          <AntDesign
            name="search1"
            size={20}
            color={themeStyles.searchIconColor}
          />
          <TextInput
            className={`flex-1 pl-3 py-3 ${themeStyles.searchText}`}
            placeholder="Search for a dish..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            placeholderTextColor={themeStyles.searchPlaceholder}
            selectionColor={themeStyles.searchIconColor}
          />
        </View>
      </View>
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row flex-wrap justify-between">
          {filteredSpecialties.length > 0 ? (
            filteredSpecialties.map((specialty, index) => (
              <View
                key={index}
                className="rounded-xl mb-8"
                style={{ width: width * 0.435 }}
              >
                <View
                  style={{
                    width: '100%',
                    height: height * 0.2,
                    borderRadius: width * 0.02,
                    overflow: 'hidden',
                  }}
                >
                  {!imageLoadedState[specialty.id] && (
                    <Skeleton
                      colorMode={theme}
                      width="100%"
                      height="100%"
                      radius={10}
                    />
                  )}
                  <Image
                    source={{ uri: specialty.image }}
                    style={{
                      width: '100%',
                      height: '100%',
                    }}
                    resizeMode="cover"
                    onLoad={() => handleImageLoad(specialty.id)}
                  />
                </View>
                <Text
                  className={`font-semibold text-lg mt-2 ${themeStyles.textPrimary}`}
                >
                  {specialty.name}
                </Text>
              </View>
            ))
          ) : (
            <Text
              className={`text-center text-lg ${themeStyles.textSecondary}`}
            >
              No specialties found for {cuisine}.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
