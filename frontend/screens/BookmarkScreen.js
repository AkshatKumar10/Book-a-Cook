import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { useContext } from 'react';
import { ScrollView, View, Text, Image, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useBookmark } from '../context/BookmarkContext';

const BookmarkScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { bookmarkedCooks } = useBookmark();
  const navigation = useNavigation();

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-700',
    textNoResults: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="Saved" />
      <ScrollView className="px-4 mt-4" showsVerticalScrollIndicator={false}>
        {bookmarkedCooks.length === 0 ? (
          <View className="flex-1 justify-center items-center mt-10">
            <Text className={`text-xl ${themeStyles.textNoResults}`}>
              No bookmarked cooks
            </Text>
          </View>
        ) : (
          bookmarkedCooks.map((cook) => (
            <TouchableOpacity
              key={cook.id}
              className="mb-4"
              onPress={() => navigation.navigate('CookProfile', { cookId: cook.id })}
            >
              <View className="flex-row items-center">
                <Image
                  source={{ uri: cook.image }}
                  className="rounded-full mr-4"
                  style={{ width: 80, height: 80 }}
                />
                <View>
                  <Text
                    className={`font-semibold text-xl ${themeStyles.textPrimary}`}
                  >
                    Chef {cook.name}
                  </Text>
                  <Text className={`text-base ${themeStyles.textSecondary}`}>
                    {cook.cuisine} Cuisine
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default BookmarkScreen;
