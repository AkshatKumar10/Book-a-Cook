import { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  useWindowDimensions,
  StatusBar,
} from 'react-native';
import { useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';
import AntDesign from '@expo/vector-icons/AntDesign';

export default function CuisineDetails() {
  const { width, height } = useWindowDimensions();
  const route = useRoute();
  const { cuisine, cooks } = route.params;
  const [searchQuery, setSearchQuery] = useState('');

  const specialties = cooks.reduce((acc, cook) => {
    return [...acc, ...cook.specialties];
  }, []);

  const filteredSpecialties = specialties.filter((specialty) =>
    specialty.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Navbar title={cuisine} />
      <View className="px-6 pt-2 pb-6">
        <View className="flex-row items-center border border-gray-300 rounded-lg bg-gray-100 px-3">
          <AntDesign name="search1" size={20} color="#f87171" />
          <TextInput
            className="flex-1 pl-3 py-3 text-gray-600"
            placeholder="Search for a dish..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
            placeholderTextColor="#f87171"
            selectionColor="#f87171"
          />
        </View>
      </View>
      <ScrollView
        className="flex-1 px-6"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex-row flex-wrap justify-between">
          {filteredSpecialties.length > 0 ? (
            filteredSpecialties.map((specialty, index) => (
              <View
                key={index}
                className="rounded-xl mb-8"
                style={{ width: width * 0.435 }}
              >
                <Image
                  source={{ uri: specialty.image }}
                  style={{
                    width: '100%',
                    height: height * 0.2,
                    borderRadius: width * 0.02,
                  }}
                  resizeMode="cover"
                />
                <Text className="font-semibold text-lg mt-2">
                  {specialty.name}
                </Text>
              </View>
            ))
          ) : (
            <Text className="text-center text-lg text-gray-600">
              No specialties found for {cuisine}.
            </Text>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
