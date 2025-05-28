import React from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Navbar from '../components/Navbar';

export default function CuisineDetails() {
  const { width, height } = useWindowDimensions();
  const route = useRoute();
  const { cuisine, cooks } = route.params;

  const specialties = cooks.reduce((acc, cook) => {
    return [...acc, ...cook.specialties];
  }, []);

  return (
    <SafeAreaView className="flex-1">
      <Navbar title={cuisine} />
      <ScrollView
        className="flex-1 px-6  pt-6"
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <View className="flex-row flex-wrap justify-between">
          {specialties.length > 0 ? (
            specialties.map((specialty, index) => (
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
