import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Navbar from '../components/Navbar';

const steps = [
  {
    id: 1,
    title: 'Find a Cook',
    description: 'Browse through our list of talented cooks.',
    icon: 'search',
    iconLibrary: 'FontAwesome5',
  },
  {
    id: 2,
    title: 'Select a Cook',
    description: 'Click on the cook you want to know more about.',
    icon: 'user',
    iconLibrary: 'FontAwesome5',
  },
  {
    id: 3,
    title: 'Book Now',
    description: "If you like the cook, click on 'Book Now'.",
    icon: 'calendar-check',
    iconLibrary: 'FontAwesome5',
  },
  {
    id: 4,
    title: 'Select Address',
    description:
      'Enter your address so the cook can reach you for meal preparation.',
    icon: 'map-marker-alt',
    iconLibrary: 'FontAwesome5',
  },
  {
    id: 5,
    title: 'Select Date & Time',
    description: 'Choose your preferred date and time for the meal.',
    icon: 'clock',
    iconLibrary: 'FontAwesome5',
  },
  {
    id: 6,
    title: 'Choose Cuisine',
    description: 'Select the cuisine type you want to enjoy.',
    icon: 'utensils',
    iconLibrary: 'FontAwesome5',
  },
  {
    id: 7,
    title: 'Lunch or Dinner',
    description: 'Choose between lunch and dinner.',
    icon: 'utensil-spoon',
    iconLibrary: 'FontAwesome5',
  },
  {
    id: 8,
    title: 'Confirm & Pay',
    description: 'Review your order and make the payment.',
    icon: 'credit-card',
    iconLibrary: 'FontAwesome5',
  },
];

const HowItWorksScreen = () => {
  const { width } = Dimensions.get('window');
  const navigation = useNavigation();

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Navbar title="How It Works" onBackPress={() => navigation.goBack()} />

      <ScrollView
        contentContainerStyle={{ padding: width * 0.05, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {steps.map((step) => (
          <View
            key={step.id}
            className="bg-white rounded-xl shadow-md p-4 mb-4"
            style={{
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center">
              {step.iconLibrary === 'FontAwesome5' ? (
                <FontAwesome5 name={step.icon} size={20} color="#8B4513" />
              ) : (
                <Ionicons name={step.icon} size={20} color="#8B4513" />
              )}
              <Text className="ml-3 text-lg font-semibold text-gray-800">
                {step.title}
              </Text>
            </View>
            <Text className="mt-2 text-base text-gray-600">
              {step.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HowItWorksScreen;
