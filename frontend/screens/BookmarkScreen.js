import {
  View,
  Text,
  FlatList,
  Image,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import useBookmarkedCooks from '../hooks/useBookmarkedCooks';
import { Skeleton } from 'moti/skeleton';
import Navbar from '../components/Navbar';
import FontAwesome from '@expo/vector-icons/FontAwesome';

const BookmarkScreen = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { theme } = useContext(ThemeContext);
  const { bookmarkedCooks, bookmarkLoading } = useBookmarkedCooks();

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    cardBorder: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
  };

  const renderCook = ({ item }) => (
    <TouchableOpacity
      onPress={() => navigation.navigate('CookProfile', { cookId: item.id })}
      className={`mx-4 my-2 p-4 rounded-xl shadow-lg ${themeStyles.cardBg} ${themeStyles.cardBorder}`}
    >
      <View className="flex-row items-center">
        <Image
          source={{ uri: item.image }}
          className="rounded-full"
          style={{ width: width * 0.2, height: width * 0.2 }}
          resizeMode="cover"
        />
        <View className="ml-6 flex-1">
          <Text className={`text-lg font-semibold ${themeStyles.textPrimary}`}>
            Chef {item.name}
          </Text>
          <Text className={`text-base flex-wrap ${themeStyles.textSecondary}`}>
            {item.cuisine}
          </Text>
          <Text className={`text-base ${themeStyles.textSecondary}`}>
            Experience: {item.experienceLevel} years
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  if (bookmarkLoading) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Navbar title="Bookmarked Chefs" />
        <View className="m-4">
          {[...Array(3)].map((_, index) => (
            <View
              key={index}
              className={`m-2 p-4 rounded-xl ${themeStyles.cardBg} ${themeStyles.cardBorder}`}
            >
              <View className="flex-row items-center">
                <Skeleton
                  colorMode={theme}
                  width={width * 0.15}
                  height={width * 0.15}
                  radius="round"
                />
                <View className="ml-4 flex-1">
                  <Skeleton colorMode={theme} width={150} height={20} />
                  <View style={{ height: 8 }} />
                  <Skeleton colorMode={theme} width={200} height={16} />
                  <View style={{ height: 8 }} />
                  <Skeleton colorMode={theme} width={120} height={16} />
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
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="Bookmarked Chefs" />
      {bookmarkedCooks.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          <FontAwesome
            name="star-o"
            size={64}
            color={theme === 'dark' ? 'white' : 'gray'}
            style={{ marginBottom: 16 }}
          />
          <Text className={`text-lg ${themeStyles.textPrimary}`}>
            No bookmarked chefs yet
          </Text>
        </View>
      ) : (
        <FlatList
          data={[...bookmarkedCooks].reverse()}
          renderItem={renderCook}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

export default BookmarkScreen;
