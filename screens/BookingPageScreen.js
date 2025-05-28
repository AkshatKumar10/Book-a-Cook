import { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  StatusBar,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import Navbar from '../components/Navbar';

export default function BookingPageScreen({ route }) {
  const { pricing, cook, cuisine } = route.params;
  const navigation = useNavigation();

  const validCuisine =
    cuisine && pricing[cuisine]
      ? cuisine
      : Object.keys(pricing)[0] || 'North Indian';
  const initialPricing = pricing[validCuisine] || {
    cook: 'Sanjay Kumar',
    price: 500,
    rating: 4.5,
    image: 'https://i.postimg.cc/d3b0kbcM/cook1-removebg-preview.png',
  };

  const [mealType, setMealType] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  const [address, setAddress] = useState('Select Address');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState(validCuisine);
  const [cookName, setCookName] = useState(initialPricing.cook);
  const [cookPrice, setCookPrice] = useState(initialPricing.price);
  const [cookRating, setCookRating] = useState(initialPricing.rating);
  const [cookImage, setCookImage] = useState(initialPricing.image);
  const [region, setRegion] = useState({
    latitude: 12.9716,
    longitude: 77.5946,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });
  const [marker, setMarker] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Permission Denied',
          'Location permission is required to select an address.',
        );
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  const handleMapPress = async (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    setMarker({ latitude, longitude });

    try {
      const location = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });
      if (location.length > 0) {
        const { street, city, region, postalCode, country } = location[0];
        const formattedAddress = `${street || ''}, ${city || ''}, ${region || ''}, ${postalCode || ''}, ${country || ''}`;
        setAddress(formattedAddress);
      } else {
        setAddress('Address not found');
      }
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Unable to fetch address');
    }
  };

  const handleCuisineChange = (itemValue) => {
    setSelectedCuisine(itemValue);
    setCookName(pricing[itemValue].cook);
    setCookPrice(pricing[itemValue].price);
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
      address === 'Select Address' ||
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
      address,
      selectedDate,
      selectedTime,
      selectedCuisine,
      cookName,
      totalAmount,
      cookRating,
      cookImage,
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
    const { start, end } = timeRestrictions[selectedCuisine];
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
    <SafeAreaView className="flex-1">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Navbar title="Booking Page" />
      <ScrollView
        className="px-4 pb-6 pt-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text className="text-lg font-medium">Select Address:</Text>
          <Text className="text-sm text-gray-500 mb-2">
            Tap on the map to select your address
          </Text>
          <View
            className="border border-gray-300 rounded-lg mb-2"
            style={{ height: 400, width: '100%' }}
          >
            <MapView
              style={{ flex: 1 }}
              region={region}
              onPress={handleMapPress}
              showsUserLocation={true}
            >
              {marker && (
                <Marker
                  coordinate={marker}
                  title="Selected Location"
                  description={address}
                />
              )}
            </MapView>
          </View>
          <View className="mt-2 p-3 border border-gray-300 rounded-md flex-row items-center">
            <Feather name="map-pin" size={18} color="black" className="mr-2" />
            <Text className="text-gray-800 text-base flex-1">{address}</Text>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">For how many people?</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-2 justify-between">
            <TouchableOpacity
              onPress={decrementGuests}
              className="border border-gray-300 rounded-full p-2"
            >
              <Text className="text-lg font-bold">−</Text>
            </TouchableOpacity>
            <Text className="text-lg font-medium">{guestCount}</Text>
            <TouchableOpacity
              onPress={incrementGuests}
              className="border border-gray-300 rounded-full p-2"
            >
              <Text className="text-lg font-bold">+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">Select Date:</Text>
          <TouchableOpacity
            onPress={showDatePicker}
            className="flex-row items-center border border-gray-300 rounded-lg px-4 py-2"
          >
            <TextInput
              placeholder="DD/MM/YYYY"
              className="flex-1 text-gray-700"
              editable={false}
              value={selectedDate}
            />
            <MaterialCommunityIcons
              name="calendar-month"
              size={24}
              color="black"
            />
          </TouchableOpacity>
        </View>

        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">Select Time:</Text>
          <TouchableOpacity
            onPress={showTimePicker}
            className="flex-row items-center border border-gray-300 rounded-lg px-4 py-2"
          >
            <TextInput
              placeholder="HH:MM AM/PM"
              className="flex-1 text-gray-700"
              value={selectedTime}
              editable={false}
            />
            <Feather name="clock" size={24} color="black" />
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
          <Text className="text-lg font-medium mb-2">Select Cuisine:</Text>
          <View className="border border-gray-300 rounded-lg">
            <Picker
              selectedValue={selectedCuisine}
              onValueChange={handleCuisineChange}
            >
              {Object.keys(pricing).map((cuisine) => (
                <Picker.Item key={cuisine} label={cuisine} value={cuisine} />
              ))}
            </Picker>
          </View>
        </View>

        <View className="mb-6 flex-row">
          <Text className="text-lg">
            Cook: <Text className="font-medium text-red-400">{cookName}</Text>
          </Text>
        </View>

        <Text className="text-lg font-medium mb-2">Choose Meal</Text>
        <View className="flex-row space-x-2 gap-5 mb-6">
          <TouchableOpacity
            onPress={() => setMealType('Lunch')}
            className={`flex-1 py-3 rounded-lg border ${
              mealType === 'Lunch'
                ? 'border-orange-500 bg-orange-100'
                : 'border-gray-300'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                mealType === 'Lunch' ? 'text-orange-700' : 'text-gray-700'
              }`}
            >
              Lunch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMealType('Dinner')}
            className={`flex-1 py-3 rounded-lg border ${
              mealType === 'Dinner'
                ? 'border-orange-500 bg-orange-100'
                : 'border-gray-300'
            }`}
          >
            <Text
              className={`text-center font-medium ${
                mealType === 'Dinner' ? 'text-orange-700' : 'text-gray-700'
              }`}
            >
              Dinner
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-center text-lg text-gray-500 mt-3">
          Need assistance?
          <Text
            className="text-orange-700 underline"
            onPress={handleContactSupport}
          >
            Contact Support
          </Text>
        </Text>

        <TouchableOpacity
          onPress={handleNext}
          className="mt-6 bg-orange-700 py-4 rounded-lg mb-10"
        >
          <Text className="text-center text-white font-medium">Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
