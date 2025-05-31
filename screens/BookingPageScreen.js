import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';

export default function BookingPageScreen() {
  const { params } = useRoute();
  const {
    pricing = {},
    cuisine = 'North Indian',
    isDiscounted = false,
  } = params || {};
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);

  const validCuisine =
    cuisine && pricing?.[cuisine]
      ? cuisine
      : Object.keys(pricing)[0] || 'North Indian';
  const initialPricing = pricing?.[validCuisine] || {
    cook: 'Sanjay Kumar',
    price: 500,
    rating: 4.5,
    image: 'https://i.postimg.cc/d3b0kbcM/cook1-removebg-preview.png',
  };

  const [mealType, setMealType] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState(validCuisine);
  const [cookName, setCookName] = useState(initialPricing.cook);
  const [cookPrice, setCookPrice] = useState(
    isDiscounted ? initialPricing.price * 0.9 : initialPricing.price,
  );
  const [cookRating, setCookRating] = useState(initialPricing.rating);
  const [cookImage, setCookImage] = useState(initialPricing.image);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-700',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-800',
    textAccent: theme === 'dark' ? 'text-red-300' : 'text-red-400',
    textSupport: theme === 'dark' ? 'text-orange-500' : 'text-orange-700',
    textHint: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    buttonBg: theme === 'dark' ? 'bg-orange-600' : 'bg-orange-700',
    buttonText: theme === 'dark' ? 'text-white' : 'text-white',
    borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    mealSelectedBg: theme === 'dark' ? 'bg-orange-900' : 'bg-orange-100',
    mealSelectedBorder:
      theme === 'dark' ? 'border-orange-400' : 'border-orange-500',
    mealSelectedText: theme === 'dark' ? 'text-orange-400' : 'text-orange-700',
    iconColor: theme === 'dark' ? '#D1D5DB' : '#000000',
    pickerBg: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    discountText: theme === 'dark' ? 'text-green-400' : 'text-green-500',
    placeholderColor: theme === 'dark' ? '#D1D5DB' : '#6B7280',
  };

  useFocusEffect(
    React.useCallback(() => {
      setGuestCount(2);
      setSelectedDate('');
      setSelectedTime('');
      setSelectedCuisine(validCuisine);
      setCookName(initialPricing.cook);
      setCookPrice(
        isDiscounted ? initialPricing.price * 0.9 : initialPricing.price,
      );
      setCookRating(initialPricing.rating);
      setCookImage(initialPricing.image);
      setTimePickerVisibility(false);
      setDatePickerVisibility(false);
      setMealType(null);
    }, []),
  );

  const handleCuisineChange = (itemValue) => {
    setSelectedCuisine(itemValue);
    setCookName(pricing[itemValue].cook);
    setCookPrice(
      isDiscounted ? pricing[itemValue].price * 0.9 : pricing[itemValue].price,
    );
    setCookRating(pricing[itemValue].rating);
    setCookImage(pricing[itemValue].image);
  };

  const incrementGuests = () => setGuestCount((prev) => prev + 1);

  const decrementGuests = () =>
    setGuestCount((prev) => (prev > 1 ? prev - 1 : prev));

  const handleContactSupport = () => {
    const email = 'bookachef@gmail.com';
    const subject = 'Support Request';
    const body = '';
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    Linking.openURL(mailtoLink).catch((err) =>
      console.error('Error opening email client', err),
    );
  };

  const calculateTotalAmount = (guestCount, cookPrice) =>
    guestCount * cookPrice;

  const totalAmount = calculateTotalAmount(guestCount, cookPrice);

  const handleNext = () => {
    if (
      !mealType ||
      !guestCount ||
      !selectedDate ||
      !selectedTime ||
      !selectedCuisine ||
      !cookName
    ) {
      Alert.alert(
        'Error',
        'Please fill in all fields, including the address, before proceeding to checkout.',
      );
      return;
    }
    navigation.navigate('CheckoutPageScreen', {
      mealType,
      guestCount,
      selectedDate,
      selectedTime,
      selectedCuisine,
      cookName,
      totalAmount,
      cookRating,
      cookImage,
      isDiscounted,
    });
  };

  const showTimePicker = () => {
    if (!selectedDate) {
      Alert.alert(
        'Date Required',
        'Please select a date before choosing a time.',
      );
      return;
    }
    setTimePickerVisibility(false);
    setTimeout(() => setTimePickerVisibility(true), 100);
  };

  const hideTimePicker = () => setTimePickerVisibility(false);

  const timeRestrictions = {
    'North Indian': { start: 10, end: 20 },
    'South Indian': { start: 11, end: 21 },
    Chinese: { start: 12, end: 22 },
    Western: { start: 9, end: 21 },
  };

  const handleConfirmTime = (time) => {
    const formattedTime = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
    const selectedHour = time.getHours();
    const selectedMinute = time.getMinutes();
    const selectedTotalMinutes = selectedHour * 60 + selectedMinute;
    const { start, end } = timeRestrictions[selectedCuisine] || {
      start: 0,
      end: 24,
    };
    const startTotalMinutes = start * 60;
    const endTotalMinutes = end * 60;

    if (
      selectedTotalMinutes < startTotalMinutes ||
      selectedTotalMinutes > endTotalMinutes
    ) {
      Alert.alert(
        'Time Selection Error',
        `For ${selectedCuisine} cuisine, please select a time between ${start} AM and ${end} PM.`,
      );
      return;
    }

    setSelectedTime(formattedTime);
    hideTimePicker();
  };

  const showDatePicker = () => setDatePickerVisibility(true);

  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirmDate = (date) => {
    const formattedDate = date.toLocaleDateString();
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="Booking Page" />
      <ScrollView
        className="px-4 pb-6 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text
            className={`text-lg font-medium mb-2 ${themeStyles.textPrimary}`}
          >
            For how many people?
          </Text>
          <View
            className={`flex-row items-center border ${themeStyles.borderColor} rounded-lg px-4 py-2 justify-between`}
          >
            <TouchableOpacity
              onPress={decrementGuests}
              className={`border ${themeStyles.borderColor} rounded-full p-2`}
            >
              <Text className={`text-lg font-bold ${themeStyles.textPrimary}`}>
                −
              </Text>
            </TouchableOpacity>
            <Text className={`text-lg font-medium ${themeStyles.textPrimary}`}>
              {guestCount}
            </Text>
            <TouchableOpacity
              onPress={incrementGuests}
              className={`border ${themeStyles.borderColor} rounded-full p-2`}
            >
              <Text className={`text-lg font-bold ${themeStyles.textPrimary}`}>
                +
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <Text
            className={`text-lg font-medium mb-2 ${themeStyles.textPrimary}`}
          >
            Select Date:
          </Text>
          <TouchableOpacity
            onPress={showDatePicker}
            className={`flex-row items-center border ${themeStyles.borderColor} rounded-lg px-4 py-2`}
          >
            <TextInput
              placeholder="DD/MM/YYYY"
              className={`flex-1 ${themeStyles.textPrimary}`}
              editable={false}
              value={selectedDate}
              placeholderTextColor={themeStyles.placeholderColor}
            />
            <MaterialCommunityIcons
              name="calendar-month"
              size={24}
              color={themeStyles.iconColor}
            />
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text
            className={`text-lg font-medium mb-2 ${themeStyles.textPrimary}`}
          >
            Select Time:
          </Text>
          <TouchableOpacity
            onPress={showTimePicker}
            className={`flex-row items-center border ${themeStyles.borderColor} rounded-lg px-4 py-2`}
          >
            <TextInput
              placeholder="HH:MM AM/PM"
              className={`flex-1 ${themeStyles.textPrimary}`}
              value={selectedTime}
              editable={false}
              placeholderTextColor={themeStyles.placeholderColor}
            />
            <Feather name="clock" size={24} color={themeStyles.iconColor} />
          </TouchableOpacity>
        </View>

        <DateTimePickerModal
          isVisible={isDatePickerVisible}
          mode="date"
          onConfirm={handleConfirmDate}
          onCancel={hideDatePicker}
          is24Hour={false}
          minimumDate={new Date(new Date().setDate(new Date().getDate() + 1))}
        />
        <DateTimePickerModal
          isVisible={isTimePickerVisible}
          mode="time"
          onConfirm={handleConfirmTime}
          onCancel={hideTimePicker}
          is24Hour={false}
        />

        <View className="mb-6">
          <Text
            className={`text-lg font-medium mb-2 ${themeStyles.textPrimary}`}
          >
            Select Cuisine:
          </Text>
          <View
            className={`border ${themeStyles.borderColor} rounded-lg ${themeStyles.pickerBg}`}
          >
            <Picker
              selectedValue={selectedCuisine}
              onValueChange={handleCuisineChange}
              style={{ color: theme === 'dark' ? '#D1D5DB' : '#000000' }}
            >
              {Object.keys(pricing).map((cuisine) => (
                <Picker.Item key={cuisine} label={cuisine} value={cuisine} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="mb-6 flex-row">
          <Text className={`text-lg ${themeStyles.textPrimary}`}>
            Cook:{' '}
            <Text className={`font-medium ${themeStyles.textAccent}`}>
              {cookName}
            </Text>
          </Text>
        </View>
        <View className="mb-6">
          <Text
            className={`text-lg font-medium mb-2 ${themeStyles.textPrimary}`}
          >
            Pricing Details:
          </Text>
          <Text className={`text-base ${themeStyles.textPrimary}`}>
            Price per guest:{' '}
            <Text className={`font-medium ${themeStyles.textSecondary}`}>
              ₹{cookPrice.toFixed(2)}
              {isDiscounted && (
                <Text className={themeStyles.discountText}>
                  {' '}
                  (10% discount applied)
                </Text>
              )}
            </Text>
          </Text>
          <Text className={`text-base ${themeStyles.textPrimary}`}>
            Total Amount:{' '}
            <Text className={`font-medium ${themeStyles.textSecondary}`}>
              ₹{totalAmount.toFixed(2)}
            </Text>
          </Text>
        </View>
        <Text className={`text-lg font-medium mb-2 ${themeStyles.textPrimary}`}>
          Choose Meal
        </Text>
        <View className="flex-row space-x-2 gap-5 mb-6">
          <TouchableOpacity
            onPress={() => setMealType('Lunch')}
            className={`flex-1 py-3 rounded-lg border ${
              mealType === 'Lunch'
                ? `${themeStyles.mealSelectedBorder} ${themeStyles.mealSelectedBg}`
                : themeStyles.borderColor
            }`}
          >
            <Text
              className={`text-center font-medium ${
                mealType === 'Lunch'
                  ? themeStyles.mealSelectedText
                  : themeStyles.textPrimary
              }`}
            >
              Lunch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMealType('Dinner')}
            className={`flex-1 py-3 rounded-lg border ${
              mealType === 'Dinner'
                ? `${themeStyles.mealSelectedBorder} ${themeStyles.mealSelectedBg}`
                : themeStyles.borderColor
            }`}
          >
            <Text
              className={`text-center font-medium ${
                mealType === 'Dinner'
                  ? themeStyles.mealSelectedText
                  : themeStyles.textPrimary
              }`}
            >
              Dinner
            </Text>
          </TouchableOpacity>
        </View>

        <Text className={`text-center text-lg ${themeStyles.textHint} mt-3`}>
          Need assistance?
          <Text
            className={`${themeStyles.textSupport} underline`}
            onPress={handleContactSupport}
          >
            {' Contact Support'}
          </Text>
        </Text>

        <TouchableOpacity
          onPress={handleNext}
          className={`mt-6 ${themeStyles.buttonBg} py-4 rounded-lg mb-10`}
        >
          <Text className={`text-center font-medium ${themeStyles.buttonText}`}>
            Next
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
