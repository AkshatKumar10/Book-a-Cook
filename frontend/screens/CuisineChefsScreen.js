import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  useWindowDimensions,
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useContext, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemeContext } from '../context/ThemeContext';
import { Skeleton } from 'moti/skeleton';
import AntDesign from '@expo/vector-icons/AntDesign';
import { StatusBar } from 'expo-status-bar';
import useCuisineCooks from '../hooks/useCuisineCooks';
import Navbar from '../components/Navbar';

export default function CuisineChefsScreen() {
  const { width, height } = useWindowDimensions();
  const route = useRoute();
  const navigation = useNavigation();
  const { cuisine } = route.params;
  const { theme } = useContext(ThemeContext);
  const { chefs, chefsLoading } = useCuisineCooks(cuisine);
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
    empty: theme === 'dark' ? '#ffffff' : '#000000',
    loadingColor: theme === 'dark' ? '#60a5fa' : '#38bdf8',
    experienceLevel: theme === 'dark' ? 'text-yellow-300' : 'text-yellow-500',
  };

  if (chefsLoading) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Navbar title={`${cuisine} Chefs`} />
        <FlatList
          data={[...Array(6)]}
          keyExtractor={(_, i) => i.toString()}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
          renderItem={() => (
            <View style={{ flex: 1, marginHorizontal: 4, marginTop: 12 }}>
              <Skeleton
                colorMode={theme}
                width="100%"
                height={height * 0.2}
                radius={10}
              />
              <View style={{ height: 12 }} />
              <Skeleton colorMode={theme} width="70%" height={20} radius={10} />
              <View style={{ height: 8 }} />
              <Skeleton colorMode={theme} width="50%" height={20} radius={10} />
            </View>
          )}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title={`${cuisine} Chefs`} />

      {chefs.length === 0 ? (
        <View className="items-center justify-center flex-1">
          <AntDesign name="frown" size={80} color={themeStyles.empty} />
          <Text
            className={`text-center mt-2 ${themeStyles.textNoResults} text-xl`}
          >
            No chefs found for {cuisine} cuisine
          </Text>
        </View>
      ) : (
        <FlatList
          data={chefs}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            marginBottom: 20,
          }}
          contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 20 }}
          renderItem={({ item: cook }) => (
            <View style={{ marginTop: 10, width: width * 0.45 }}>
              <View
                className="rounded-xl overflow-hidden"
                style={{ width: '100%', height: height * 0.2 }}
              >
                {!imageLoadedState[cook.id] && (
                  <Skeleton
                    colorMode={theme}
                    width="100%"
                    height="100%"
                    radius={10}
                  />
                )}
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('CookProfile', { cookId: cook.id })
                  }
                >
                  <Image
                    source={{ uri: cook.image }}
                    style={{ width: '100%', height: '100%' }}
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
                className={`text-base font-semibold ${themeStyles.experienceLevel}`}
              >
                {cook.experienceLevel} yrs experience
              </Text>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}
