import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  useWindowDimensions,
  RefreshControl,
} from 'react-native';
import { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import useCooksData from '../hooks/useCooksData';
import { Skeleton } from 'moti/skeleton';
import { AntDesign } from '@expo/vector-icons';
import Navbar from '../components/Navbar';

export default function CookListScreen() {
  const { height } = useWindowDimensions();
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { cooksData, cooksDataLoading, refresh, refreshing } = useCooksData();
  const [imageLoadedState, setImageLoadedState] = useState({});

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    textAccent: theme === 'dark' ? 'text-red-300' : 'text-red-500',
    iconColor: theme === 'dark' ? 'white' : 'black',
    loadingColor: theme === 'dark' ? '#60a5fa' : '#38bdf8',
    empty: theme === 'dark' ? '#ffffff' : '#000000',
    cardBackground: theme === 'dark' ? '#1c1c1c' : '#f9f9f9',
    tagBackground: theme === 'dark' ? '#333' : '#e2e8f0',
    tagText: theme === 'dark' ? 'text-white' : 'text-gray-700',
  };

  const handleImageLoad = (id) => {
    setImageLoadedState((prev) => ({ ...prev, [id]: true }));
  };

  const renderCookItem = ({ item }) => (
    <TouchableOpacity
      className="mb-4 rounded-xl overflow-hidden shadow-md"
      style={{ backgroundColor: themeStyles.cardBackground }}
      onPress={() => navigation.navigate('CookProfile', { cookId: item.id })}
    >
      <View style={{ width: '100%', height: height * 0.25 }}>
        {!imageLoadedState[item.id] && (
          <Skeleton colorMode={theme} width="100%" height="100%" radius={10} />
        )}
        <Image
          source={{ uri: item.image }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
          onLoad={() => handleImageLoad(item.id)}
        />
      </View>
      <View className="p-4">
        <Text className={`font-semibold text-xl ${themeStyles.textPrimary}`}>
          Chef {item.name}
        </Text>
        <Text className={`text-base ${themeStyles.textAccent}`}>
          {item.cuisine} cuisine
        </Text>
        <Text className={`text-sm mt-1 ${themeStyles.textSecondary}`}>
          {item.experienceLevel} yrs experience
        </Text>
        <View className="flex-row flex-wrap mt-2">
          {item.specialties?.map((spec, idx) => (
            <View
              key={idx}
              className={`px-2 py-1 mr-2 mb-2 rounded-full`}
              style={{ backgroundColor: themeStyles.tagBackground }}
            >
              <Text className={`text-sm ${themeStyles.tagText}`}>{spec}</Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );

  if (cooksDataLoading) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <Navbar title="All Chefs" />
        <View className="px-2 py-2">
          {[...Array(3)].map((_, index) => (
            <View
              key={index}
              className="mb-4 rounded-xl overflow-hidden shadow-md"
              style={{ backgroundColor: themeStyles.cardBackground }}
            >
              <Skeleton
                colorMode={theme}
                width="100%"
                height={height * 0.25}
                radius={10}
              />
              <View className="p-4">
                <Skeleton colorMode={theme} width="60%" height={24} />
                <View style={{ height: 8 }} />
                <Skeleton colorMode={theme} width="50%" height={20} />
                <View style={{ height: 8 }} />
                <Skeleton colorMode={theme} width="40%" height={16} />
                <View className="flex-row flex-wrap mt-2 gap-2">
                  {[...Array(3)].map((_, idx) => (
                    <Skeleton
                      key={idx}
                      colorMode={theme}
                      width={80}
                      height={24}
                      radius={12}
                    />
                  ))}
                </View>
              </View>
            </View>
          ))}
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <Navbar title="All Chefs" />
      {cooksData.length === 0 ? (
        <View className="flex-1 justify-center items-center">
          <AntDesign name="frown" size={80} color={themeStyles.empty} />
          <Text className={`mt-2 text-xl ${themeStyles.textSecondary}`}>
            No chefs found
          </Text>
        </View>
      ) : (
        <FlatList
          data={cooksData}
          renderItem={renderCookItem}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={{ paddingHorizontal: 8, paddingVertical: 10 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              tintColor={theme === 'dark' ? 'white' : 'black'}
            />
          }
        />
      )}
    </SafeAreaView>
  );
}
