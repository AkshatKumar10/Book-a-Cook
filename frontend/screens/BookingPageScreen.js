import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Platform,
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
import { WebView } from 'react-native-webview';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import useCooksData from '../hooks/useCooksData';
import useCook from '../hooks/useCook';
import { getUserToken } from '../utils/api';
import { useWindowDimensions } from 'react-native';
import SnackbarComponent from '../components/SnackbarComponent';
import { Skeleton } from 'moti/skeleton';
import useDebounce from '../hooks/useDebounce';
import mapHtml from '../components/MapComponent';

export default function BookingPageScreen() {
  const { params } = useRoute();
  const { cookId, isDiscounted = false } = params || {};
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { width } = useWindowDimensions();
  const webViewRef = useRef(null);

  const isSpecificCook = !!cookId;
  const { cooksData, cooksDataLoading } = useCooksData();
  const { cook: specificCook, cookLoading } = useCook(cookId);

  const [mealType, setMealType] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState('');
  const [selectedCook, setSelectedCook] = useState(null);
  const [matchingCooks, setMatchingCooks] = useState([]);
  const [showCookList, setShowCookList] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [marker, setMarker] = useState(null);
  const [address, setAddress] = useState('');
  const [isTouchingMap, setIsTouchingMap] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const debouncedSearchQuery = useDebounce(searchQuery, 500);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
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
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    selectedCard: theme === 'dark' ? 'border-orange-500' : 'border-orange-300',
  };

  const uniqueCuisines = cooksDataLoading
    ? []
    : [
        ...new Set(cooksData.flatMap((cook) => cook.cuisine.split(', '))),
      ].sort();

  const renderCookCard = ({ item: cook }) => {
    const isSelected = selectedCook?.id === cook.id;
    return (
      <TouchableOpacity
        onPress={() => {
          setSelectedCook(cook);
          setShowCookList(false);
        }}
        className={`rounded-lg p-3 mr-3 ${isSelected ? themeStyles.selectedCard : ''}`}
        style={{
          width: width * 0.4,
          borderWidth: 2,
          borderColor: isSelected ? 'orange' : 'transparent',
        }}
      >
        <Image
          source={{ uri: cook.image }}
          style={{ width: '100%', height: 80, borderRadius: 8 }}
          resizeMode="cover"
        />
        <Text className={`font-semibold mt-2 ${themeStyles.textPrimary}`}>
          Chef {cook.name}
        </Text>
        <Text className={`text-sm ${themeStyles.textSecondary}`}>
          {cook.cuisine.split(', ').join(', ')}
        </Text>
        <Text className={`text-sm font-medium ${themeStyles.textAccent}`}>
          {cook.experienceLevel} yrs exp.
        </Text>
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    const initCook = async () => {
      if (isSpecificCook ? cookLoading : cooksDataLoading) {
        setIsLoading(true);
        return;
      }

      try {
        const token = await getUserToken();
        if (!token) {
          Alert.alert('Auth Required', 'Please log in to book.', [
            { text: 'OK', onPress: () => navigation.navigate('Login') },
          ]);
          return;
        }

        if (isSpecificCook && specificCook) {
          const primaryCuisine = specificCook.cuisine.split(', ')[0];
          setSelectedCuisine(primaryCuisine);
          setSelectedCook(specificCook);
          setMatchingCooks([specificCook]);
          setShowCookList(false);
        } else if (!isSpecificCook && cooksData.length > 0) {
          const defaultCuisine = uniqueCuisines[0] || '';
          setSelectedCuisine(defaultCuisine);
          const defaultCooks = cooksData
            .filter((cook) => cook.cuisine.split(', ').includes(defaultCuisine))
            .sort((a, b) => b.experienceLevel - a.experienceLevel);
          setMatchingCooks(defaultCooks);
          if (defaultCooks.length > 0) {
            setSelectedCook(defaultCooks[0]);
            setShowCookList(defaultCooks.length > 1);
          }
        }
      } catch (error) {
        console.error('Init error:', error);
        setSnackbarMessage('Failed to load data. Please try again.');
        setSnackbarType('Error');
        setSnackbarVisible(true);
      } finally {
        setIsLoading(false);
      }
    };

    initCook();
  }, [isSpecificCook, specificCook, cookLoading, cooksData, cooksDataLoading]);

  useEffect(() => {
    if (debouncedSearchQuery.trim()) {
      fetchSuggestions();
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [debouncedSearchQuery]);

  useFocusEffect(
    useCallback(() => {
      if (!selectedDate && !selectedTime && !mealType) {
        setGuestCount(2);
        setSelectedDate('');
        setSelectedTime('');
        setMealType(null);
        setMarker(null);
        setAddress('');
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
      }
      setTimePickerVisibility(false);
      setDatePickerVisibility(false);
    }, []),
  );

  const bangalore = {
    minLat: 12.8345,
    minLon: 77.502,
    maxLat: 13.1395,
    maxLon: 77.709,
  };

  const fetchSuggestions = async () => {
    setIsSearching(true);
    try {
      const { minLat, minLon, maxLat, maxLon } = bangalore;
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(debouncedSearchQuery)}&bounded=1&viewbox=${minLon},${maxLat},${maxLon},${minLat}&limit=5`,
        {
          headers: {
            'User-Agent': 'BookAChefApp/1.0 (contact: bookachef@gmail.com)',
          },
        },
      );
      setSuggestions(response.data || []);
      setShowSuggestions(response.data.length > 0);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      setSnackbarMessage(
        'Failed to fetch location suggestions. Please try again.',
      );
      setSnackbarType('Error');
      setSnackbarVisible(true);
      setSuggestions([]);
      setShowSuggestions(false);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelectSuggestion = (suggestion) => {
    const latitude = parseFloat(suggestion.lat);
    const longitude = parseFloat(suggestion.lon);
    setSearchQuery(suggestion.display_name);
    setShowSuggestions(false);
    const jsCode = `
      map.setView([${latitude}, ${longitude}], 20);
      true;
    `;
    webViewRef.current.injectJavaScript(jsCode);
  };

  const handleCuisineChange = (itemValue) => {
    if (isSpecificCook) return;
    setSelectedCuisine(itemValue);
    const matching = cooksData
      .filter((cook) => cook.cuisine.split(', ').includes(itemValue))
      .sort((a, b) => b.experienceLevel - a.experienceLevel);
    setMatchingCooks(matching);
    if (matching.length > 0) {
      setSelectedCook(matching[0]);
      setShowCookList(matching.length > 1);
    } else {
      setSelectedCook(null);
      setShowCookList(false);
    }
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

  const cookPrice = selectedCook?.pricing?.perDish || 0;
  const discountedPrice = isDiscounted ? cookPrice * 0.9 : cookPrice;
  const totalAmount = guestCount * discountedPrice;

  const handleNext = () => {
    if (
      !selectedCook ||
      !mealType ||
      !selectedDate ||
      !selectedTime ||
      !selectedCuisine ||
      !marker ||
      !address
    ) {
      setSnackbarMessage('Please fill in all fields and select a location.');
      setSnackbarType('Error');
      setSnackbarVisible(true);
      return;
    }
    navigation.navigate('CheckoutPageScreen', {
      cookId: selectedCook.id,
      cookName: selectedCook.name,
      cookImage: selectedCook.image,
      selectedCuisine,
      mealType,
      guestCount,
      selectedDate,
      selectedTime,
      cookPrice,
      totalAmount,
      isDiscounted,
      address,
    });
  };

  const showTimePicker = () => {
    setTimePickerVisibility(true);
  };

  const hideTimePicker = () => setTimePickerVisibility(false);

  const timeRestrictions = {
    Italian: { start: 10, end: 20 },
    Indian: { start: 11, end: 21 },
    Vegan: { start: 9, end: 21 },
    Mexican: { start: 9, end: 22 },
    Chinese: { start: 11, end: 22 },
    French: { start: 9, end: 21 },
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
    const { start = 0, end = 24 } = timeRestrictions[selectedCuisine] || {};
    const startTotalMinutes = start * 60;
    const endTotalMinutes = end * 60;

    if (
      selectedTotalMinutes < startTotalMinutes ||
      selectedTotalMinutes > endTotalMinutes
    ) {
      setSnackbarMessage(
        `Please select a time between ${start} AM and ${end} PM.`,
      );
      setSnackbarType('Error');
      setSnackbarVisible(true);
      hideTimePicker();
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

  const fetchAddress = async (lat, lng) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`,
        {
          headers: {
            'User-Agent': 'BookAChefApp/1.0 (contact: bookachef@gmail.com)',
          },
        },
      );
      const address = response.data.display_name || 'Unknown address';
      setAddress(address);
    } catch (error) {
      console.error('Error fetching address:', error);
      setAddress('Unable to fetch address');
      setSnackbarMessage('Failed to fetch address. Please try again.');
      setSnackbarType('Error');
      setSnackbarVisible(true);
    }
  };

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.type === 'marker') {
      setMarker({ latitude: data.lat, longitude: data.lng });
      fetchAddress(data.lat, data.lng);
    }
  };

  if (isLoading || cooksDataLoading || (isSpecificCook && cookLoading)) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Navbar title="Booking Page" />
        <ScrollView
          className="px-4 pb-6 pt-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          <View className="mb-6">
            <Skeleton colorMode={theme} width="50%" height={20} />
            <View style={{ height: 8 }} />
            <View
              className={`flex-row items-center border ${themeStyles.borderColor} rounded-lg px-4 py-2 justify-between`}
            >
              <Skeleton colorMode={theme} width={40} height={40} radius={20} />
              <Skeleton colorMode={theme} width={40} height={20} />
              <Skeleton colorMode={theme} width={40} height={40} radius={20} />
            </View>
          </View>
          <View className="mb-6">
            <Skeleton colorMode={theme} width={120} height={20} />
            <View style={{ height: 8 }} />
            <View
              className={`flex-row items-center justify-between border ${themeStyles.borderColor} rounded-lg px-4 py-2`}
            >
              <Skeleton colorMode={theme} width="50%" height={40} />
              <Skeleton
                colorMode={theme}
                width={24}
                height={24}
                radius={12}
                style={{ marginLeft: 8 }}
              />
            </View>
          </View>
          <View className="mb-6">
            <Skeleton colorMode={theme} width={120} height={20} />
            <View style={{ height: 8 }} />
            <View
              className={`flex-row items-center justify-between border ${themeStyles.borderColor} rounded-lg px-4 py-2`}
            >
              <Skeleton colorMode={theme} width="50%" height={40} />
              <Skeleton
                colorMode={theme}
                width={24}
                height={24}
                radius={12}
                style={{ marginLeft: 8 }}
              />
            </View>
          </View>
          <View className="mb-6">
            <Skeleton colorMode={theme} width={120} height={20} />
            <View style={{ height: 8 }} />
            <View
              className={`flex-row items-center justify-between border ${themeStyles.borderColor} rounded-lg px-4 py-2`}
            >
              <Skeleton colorMode={theme} width="85%" height={40} />
              <Skeleton
                colorMode={theme}
                width={24}
                height={24}
                radius={12}
                style={{ marginLeft: 8 }}
              />
            </View>
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width="100%" height={300} radius={8} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width="100%" height={20} />
          </View>
          <View className="mb-6">
            <Skeleton colorMode={theme} width={120} height={20} />
            <View style={{ height: 8 }} />
            <Skeleton colorMode={theme} width="100%" height={40} radius={8} />
          </View>
          <View className="mb-6">
            <Skeleton colorMode={theme} width={120} height={20} />
            <View style={{ height: 8 }} />
            <View className={`flex-row items-center p-3 rounded-lg`}>
              <Skeleton
                colorMode={theme}
                width={48}
                height={48}
                radius="round"
              />
              <View className="flex-1 ml-3">
                <Skeleton colorMode={theme} width="60%" height={20} />
                <View style={{ height: 8 }} />
                <Skeleton colorMode={theme} width="50%" height={16} />
              </View>
              <Skeleton colorMode={theme} width={24} height={24} radius={12} />
            </View>
          </View>
          <View className="mb-6 p-4 rounded-lg border border-gray-50">
            <Skeleton colorMode={theme} width={140} height={20} />
            <View style={{ height: 8 }} />
            <View className="flex-row justify-between items-center">
              <Skeleton colorMode={theme} width={120} height={16} />
              <Skeleton colorMode={theme} width={80} height={16} />
            </View>
            <View style={{ height: 8 }} />
            <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-300 dark:border-gray-700">
              <Skeleton colorMode={theme} width={120} height={16} />
              <Skeleton colorMode={theme} width={80} height={20} />
            </View>
          </View>
          <View className="mb-6">
            <Skeleton colorMode={theme} width={120} height={20} />
            <View style={{ height: 8 }} />
            <View className="flex-row gap-2">
              <View className="flex-1">
                <Skeleton
                  colorMode={theme}
                  width="100%"
                  height={40}
                  radius={8}
                />
              </View>
              <View className="flex-1">
                <Skeleton
                  colorMode={theme}
                  width="100%"
                  height={40}
                  radius={8}
                />
              </View>
            </View>
          </View>
          <View className="self-center">
            <Skeleton colorMode={theme} width={180} height={20} />
          </View>
          <View style={{ height: 16 }} />
          <Skeleton
            colorMode={theme}
            width="100%"
            height={48}
            radius={8}
            style={{ marginBottom: 40 }}
          />
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="Booking Page" />
      <ScrollView
        className="px-4 pb-6 pt-4"
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isTouchingMap}
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

        <View className="mb-6">
          <Text
            className={`text-lg font-medium mb-2 ${themeStyles.textPrimary}`}
          >
            Select Location:
          </Text>
          <View
            className={`flex-row items-center border ${themeStyles.borderColor} rounded-lg px-4 py-2 mb-3`}
          >
            <TextInput
              placeholder="Enter location (e.g., Bangalore, India)"
              className={`flex-1 ${themeStyles.textPrimary}`}
              value={searchQuery}
              onChangeText={(text) => {
                setSearchQuery(text);
                setShowSuggestions(true);
              }}
              placeholderTextColor={themeStyles.placeholderColor}
            />
            <TouchableOpacity
              onPress={() => {
                if (!searchQuery.trim()) {
                  setSnackbarMessage('Please enter a location to search.');
                  setSnackbarType('Error');
                  setSnackbarVisible(true);
                }
              }}
              disabled={isSearching}
            >
              <Feather
                name="search"
                size={24}
                color={
                  isSearching
                    ? themeStyles.placeholderColor
                    : themeStyles.iconColor
                }
              />
            </TouchableOpacity>
          </View>
          {showSuggestions && (
            <View
              className={`border ${themeStyles.borderColor} rounded-lg ${themeStyles.cardBg} mb-3`}
              style={{
                maxHeight: 160,
              }}
            >
              {suggestions.length > 0 ? (
                <FlatList
                  data={suggestions}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectSuggestion(item)}
                      className="p-3 border-b border-gray-200 dark:border-gray-700"
                    >
                      <Text className={themeStyles.textSecondary}>
                        {item.display_name}
                      </Text>
                    </TouchableOpacity>
                  )}
                  keyExtractor={(item) => item.place_id.toString()}
                  nestedScrollEnabled={true}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <Text className={`p-3 ${themeStyles.textHint}`}>
                  No results in Bangalore
                </Text>
              )}
            </View>
          )}

          <View
            onTouchStart={() => setIsTouchingMap(true)}
            onTouchEnd={() => setIsTouchingMap(false)}
            className={`border ${themeStyles.borderColor} rounded-lg overflow-hidden`}
          >
            <WebView
              ref={webViewRef}
              source={{ html: mapHtml }}
              style={{ height: 300, width: '100%' }}
              onMessage={handleWebViewMessage}
              javaScriptEnabled={true}
              domStorageEnabled={true}
            />
          </View>
          <Text className="text-sm mt-2">
            {address ? (
              <Text className="text-orange-600 font-medium">{address}</Text>
            ) : (
              <Text className={themeStyles.textHint}>
                Search for a location and tap on the map to select your exact
                location
              </Text>
            )}
          </Text>
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

        {!isSpecificCook && (
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
                <Picker.Item label="Select Cuisine" value="" />
                {uniqueCuisines.map((cuisine) => (
                  <Picker.Item key={cuisine} label={cuisine} value={cuisine} />
                ))}
              </Picker>
            </View>
          </View>
        )}

        {isSpecificCook && specificCook?.cuisine && (
          <View className="mb-6">
            <Text
              className={`text-base font-medium mb-2 ${themeStyles.textPrimary}`}
            >
              Cuisines:
            </Text>
            <View className="flex-row flex-wrap gap-2">
              <Text className={`text-lg ${themeStyles.textAccent}`}>
                {specificCook.cuisine.split(', ').join(' • ')}
              </Text>
            </View>
          </View>
        )}

        {selectedCuisine && (
          <View className="mb-6">
            <Text
              className={`text-lg font-medium mb-2 ${themeStyles.textPrimary}`}
            >
              {isSpecificCook ? 'Selected Cook:' : 'Select Cook:'}
            </Text>
            {selectedCook && (
              <View
                className={`flex-row items-center p-3 rounded-lg ${themeStyles.cardBg} mb-2`}
              >
                <Image
                  source={{ uri: selectedCook.image }}
                  className="w-12 h-12 rounded-full mr-3"
                />
                <View className="flex-1">
                  <Text className={`font-semibold ${themeStyles.textPrimary}`}>
                    Chef {selectedCook.name}
                  </Text>
                  <Text className={`text-sm ${themeStyles.textSecondary}`}>
                    {selectedCuisine}
                  </Text>
                </View>
                {!isSpecificCook && (
                  <TouchableOpacity
                    onPress={() => setShowCookList(!showCookList)}
                    className="p-2"
                  >
                    <Feather
                      name={showCookList ? 'chevron-up' : 'chevron-down'}
                      size={20}
                      color={themeStyles.iconColor}
                    />
                  </TouchableOpacity>
                )}
              </View>
            )}
            {showCookList && !isSpecificCook && matchingCooks.length > 1 && (
              <View>
                <Text className={`text-sm ${themeStyles.textHint} mb-2`}>
                  Choose from available chefs:
                </Text>
                <FlatList
                  horizontal
                  data={matchingCooks}
                  renderItem={renderCookCard}
                  keyExtractor={(item) => item.id}
                  showsHorizontalScrollIndicator={false}
                />
              </View>
            )}
            {matchingCooks.length === 0 && (
              <Text className={`text-sm ${themeStyles.textHint}`}>
                No cooks available for this cuisine.
              </Text>
            )}
          </View>
        )}

        <View className="mb-6 p-4 rounded-lg border border-gray-300">
          <Text
            className={`text-lg font-semibold mb-2 ${themeStyles.textPrimary}`}
          >
            Pricing Details
          </Text>

          <View className="flex-row justify-between items-center mb-1">
            <Text className={`text-base ${themeStyles.textSecondary}`}>
              Price per guest:
            </Text>
            <View className="flex-row items-center">
              <Text
                className={`text-base font-bold ${themeStyles.textPrimary}`}
              >
                ₹{discountedPrice.toFixed(0)}
              </Text>
              {isDiscounted && (
                <Text
                  className={`ml-2 ${themeStyles.discountText} font-medium`}
                >
                  (10% off)
                </Text>
              )}
            </View>
          </View>

          <View className="flex-row justify-between items-center mt-2 pt-2 border-t border-gray-300 dark:border-gray-700">
            <Text className={`text-base ${themeStyles.textSecondary}`}>
              Total Amount:
            </Text>
            <Text className={`text-lg font-bold ${themeStyles.textPrimary}`}>
              ₹{totalAmount.toFixed(0)}
            </Text>
          </View>
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
      <SnackbarComponent
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </SafeAreaView>
  );
}
