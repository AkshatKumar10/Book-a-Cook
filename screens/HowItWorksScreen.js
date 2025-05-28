import {
  View,
  Text,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { FontAwesome5, Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import Navbar from '../components/Navbar';

const steps = [
  {
    id: 1,
    title: 'Find a Chef',
    description: 'Browse through our list of talented chefs.',
    icon: 'search',
    iconLibrary: 'FontAwesome5',
  },
  {
    id: 2,
    title: 'Select a Chef',
    description: 'Click on the chef you want to know more about.',
    icon: 'user',
    iconLibrary: 'FontAwesome5',
  },
  {
    id: 3,
    title: 'Book Now',
    description: "If you like the chef, click on 'Book Now'.",
    icon: 'calendar-check',
    iconLibrary: 'FontAwesome5',
  },
  {
    id: 4,
    title: 'Select Address',
    description:
      'Enter your address so the chef can reach you for meal preparation.',
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
  const { theme } = useContext(ThemeContext);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    iconColor: theme === 'dark' ? '#DAA520' : '#8B4513',
    shadowColor: theme === 'dark' ? '#FFFFFF' : '#000000',
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#000000' : '#FFFFFF'}
      />
      <Navbar title="How It Works" onBackPress={() => navigation.goBack()} />
      <ScrollView
        contentContainerStyle={{ padding: width * 0.05, paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {steps.map((step) => (
          <View
            key={step.id}
            className={`rounded-xl shadow-md p-4 mb-4 ${themeStyles.cardBg}`}
            style={{
              shadowColor: themeStyles.shadowColor,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: theme === 'dark' ? 0.2 : 0.1,
              shadowRadius: 4,
              elevation: 2,
            }}
          >
            <View className="flex-row items-center">
              {step.iconLibrary === 'FontAwesome5' ? (
                <FontAwesome5
                  name={step.icon}
                  size={20}
                  color={themeStyles.iconColor}
                />
              ) : (
                <Ionicons
                  name={step.icon}
                  size={20}
                  color={themeStyles.iconColor}
                />
              )}
              <Text
                className={`ml-3 text-lg font-semibold ${themeStyles.textPrimary}`}
              >
                {step.title}
              </Text>
            </View>
            <Text className={`mt-2 text-base ${themeStyles.textSecondary}`}>
              {step.description}
            </Text>
          </View>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default HowItWorksScreen;
