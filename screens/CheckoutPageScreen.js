import { useState, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  ScrollView,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';

export default function CheckoutPageScreen() {
  const [showWebView, setShowWebView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();
  const { params } = useRoute();
  const { theme } = useContext(ThemeContext);

  const {
    mealType,
    guestCount,
    selectedDate,
    selectedTime,
    selectedCuisine,
    cookName,
    totalAmount,
    cookRating,
    cookImage,
    address,
    isDiscounted = false,
  } = params || {};

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    webViewContainer: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-700',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-900',
    textAccent: theme === 'dark' ? 'text-red-300' : 'text-red-400',
    buttonBg: theme === 'dark' ? 'bg-orange-600' : 'bg-orange-700',
    buttonText: theme === 'dark' ? 'text-white' : 'text-white',
    borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    discountText: theme === 'dark' ? 'text-green-400' : 'text-green-500',
    loadingColor: theme === 'dark' ? '#60a5fa' : '#38bdf8',
    webViewBg: theme === 'dark' ? '#1F2937' : '#F2F2F2',
    webViewText: theme === 'dark' ? '#D1D5DB' : '#333333',
  };

  const originalAmount = isDiscounted ? totalAmount / 0.9 : totalAmount;
  const discountAmount = isDiscounted ? originalAmount * 0.1 : 0;
  const finalAmount = isDiscounted ? totalAmount : originalAmount;

  const formatDateTime = (dateStr, timeStr) => {
    if (!dateStr || !timeStr) return '';
    const [day, month, year] = dateStr.split('/').map(Number);

    const convertTo24Hour = (time12h) => {
      const [time, modifier] = time12h.toLowerCase().split(/(am|pm)/);
      let [hours, minutes] = time.split(':').map(Number);

      if (modifier === 'pm' && hours !== 12) hours += 12;
      if (modifier === 'am' && hours === 12) hours = 0;

      return `${hours.toString().padStart(2, '0')}:${minutes
        .toString()
        .padStart(2, '0')}`;
    };

    const time24 = convertTo24Hour(timeStr);
    const date = new Date(`${year}-${month}-${day}T${time24}`);

    return date.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const formattedDateTime = formatDateTime(selectedDate, selectedTime);

  const saveBooking = async () => {
    try {
      const newBooking = {
        id: Date.now(),
        createdAt: new Date().toISOString(),
        cook: {
          name: cookName,
          cuisine: selectedCuisine,
          rating: cookRating,
          image: cookImage,
        },
        status: 'upcoming',
        date: selectedDate,
        time: selectedTime,
        pricing: `₹${finalAmount.toFixed(2)}`,
        mealType,
        guestCount,
        discount: isDiscounted ? '10% off' : 'None',
      };
      const existingBookings = await AsyncStorage.getItem('bookings');
      const bookings = existingBookings ? JSON.parse(existingBookings) : [];
      bookings.push(newBooking);
      await AsyncStorage.setItem('bookings', JSON.stringify(bookings));
      navigation.reset({
        index: 1,
        routes: [
          { name: 'HomeTabs', params: { screen: 'Home' } },
          {
            name: 'HomeTabs',
            params: { screen: 'Bookings', params: { refresh: true } },
          },
        ],
      });
    } catch (error) {
      console.error('Error saving booking:', error);
    }
  };

  const razorpayHTML = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <script>
          window.onload = function() {
            var options = {
              key: "rzp_test_t86tDGCZODCoNY",
              amount: ${finalAmount * 100},
              currency: "INR",
              name: "BookACook",
              description: "Meal Payment",
              image: "https://i.imgur.com/3g7nmJC.jpg",
              handler: function(response) {
                window.ReactNativeWebView.postMessage(
                  JSON.stringify({ event: "SUCCESS", response })
                );
              },
              prefill: {
                name: "John",
                email: "user@example.com",
                contact: "9023415172",
              },
              theme: {
                color: "#53a20e",
              },
              modal: {
                ondismiss: function() {
                  window.ReactNativeWebView.postMessage(
                    JSON.stringify({ event: "DISMISS" })
                  );
                },
              },
            };
            var rzp = new Razorpay(options);
            rzp.open();
          };
        </script>
      </head>
      <body style="background-color:${themeStyles.webViewBg}; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
        <h3 style="text-align:center; color:${themeStyles.webViewText};">
          Redirecting to payment...
        </h3>
      </body>
    </html>
  `;

  const handleWebViewMessage = (event) => {
    const data = JSON.parse(event.nativeEvent.data);
    if (data.event === 'SUCCESS') {
      Alert.alert(
        'Payment Successful',
        'Thank you for your payment!\nYour booking is confirmed.',
      );
      saveBooking();
      setShowWebView(false);
    } else if (data.event === 'DISMISS') {
      Alert.alert(
        'Payment Cancelled',
        'The payment process was cancelled. You can try again anytime.',
      );
      setShowWebView(false);
    }
  };

  const handlePayment = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setShowWebView(true);
    }, 500);
  };

  if (showWebView) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.webViewContainer}`}>
        <StatusBar
          barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
          backgroundColor={theme === 'dark' ? '#000000' : '#FFFFFF'}
        />
        <WebView
          originWhitelist={['*']}
          source={{ html: razorpayHTML }}
          onMessage={handleWebViewMessage}
          style={{ flex: 1 }}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar
        barStyle={theme === 'dark' ? 'light-content' : 'dark-content'}
        backgroundColor={theme === 'dark' ? '#000000' : '#FFFFFF'}
      />
      <Navbar title="Checkout" onBackPress={() => navigation.goBack()} />
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color={themeStyles.loadingColor} />
        </View>
      ) : (
        <>
          <ScrollView
            className="px-4 py-6"
            showsVerticalScrollIndicator={false}
          >
            <Text className={`text-2xl font-bold ${themeStyles.textPrimary}`}>
              Order Summary
            </Text>

            <View className="mt-6 flex-row justify-between items-center">
              <View>
                <Text className={`text-xl ${themeStyles.textPrimary}`}>
                  Meal Type
                </Text>
                <Text className={`text-lg ${themeStyles.textAccent}`}>
                  {mealType}
                </Text>
              </View>
              <Text className={`text-xl ${themeStyles.textSecondary}`}>
                {mealType}
              </Text>
            </View>

            <View className="mt-6 flex-row justify-between items-center">
              <View>
                <Text className={`text-xl ${themeStyles.textPrimary}`}>
                  Number of Guests
                </Text>
                <Text className={`text-lg ${themeStyles.textAccent}`}>
                  {guestCount}
                </Text>
              </View>
              <Text className={`text-xl ${themeStyles.textSecondary}`}>
                {guestCount}
              </Text>
            </View>

            <View className="mt-6 flex-row justify-between items-center">
              <View>
                <Text className={`text-xl ${themeStyles.textPrimary}`}>
                  Date & Time
                </Text>
                <Text className={`text-lg ${themeStyles.textAccent}`}>
                  {formattedDateTime}
                </Text>
              </View>
              <Text className={`text-xl ${themeStyles.textSecondary}`}>
                {formattedDateTime}
              </Text>
            </View>

            <View className="mt-6 flex-row justify-between items-center">
              <View>
                <Text className={`text-xl ${themeStyles.textPrimary}`}>
                  Cuisine
                </Text>
                <Text className={`text-lg ${themeStyles.textAccent}`}>
                  {selectedCuisine}
                </Text>
              </View>
              <Text className={`text-xl ${themeStyles.textSecondary}`}>
                {selectedCuisine}
              </Text>
            </View>

            <View className="mt-6 flex-row justify-between items-center">
              <View>
                <Text className={`text-xl ${themeStyles.textPrimary}`}>
                  Assigned Cook
                </Text>
                <Text className={`text-lg ${themeStyles.textAccent}`}>
                  Chef {cookName}
                </Text>
              </View>
              <Text className={`text-xl ${themeStyles.textSecondary}`}>
                Chef {cookName}
              </Text>
            </View>

            <View className="mt-6">
              <Text className={`text-xl ${themeStyles.textPrimary}`}>
                Address
              </Text>
              <View>
                <Text className={`text-lg ${themeStyles.textAccent}`}>
                  {address}
                </Text>
              </View>
            </View>

            <Text
              className={`text-2xl font-bold mt-12 ${themeStyles.textPrimary}`}
            >
              Payment Details
            </Text>

            <View className="mt-6">
              <View className="flex-row justify-between items-center">
                <Text className={`text-xl ${themeStyles.textPrimary}`}>
                  Subtotal
                </Text>
                <Text className={`text-xl ${themeStyles.textSecondary}`}>
                  ₹{originalAmount.toFixed(2)}
                </Text>
              </View>
              {isDiscounted && (
                <>
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className={`text-xl ${themeStyles.discountText}`}>
                      Discount (10%)
                    </Text>
                    <Text className={`text-xl ${themeStyles.discountText}`}>
                      -₹{discountAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View
                    className={`border-t ${themeStyles.borderColor} mt-2 pt-2 flex-row justify-between items-center`}
                  >
                    <Text
                      className={`text-xl font-bold ${themeStyles.textPrimary}`}
                    >
                      Total
                    </Text>
                    <Text
                      className={`text-xl font-bold ${themeStyles.textSecondary}`}
                    >
                      ₹{finalAmount.toFixed(2)}
                    </Text>
                  </View>
                </>
              )}
              {!isDiscounted && (
                <View
                  className={`border-t ${themeStyles.borderColor} mt-2 pt-2 flex-row justify-between items-center`}
                >
                  <Text
                    className={`text-xl font-bold ${themeStyles.textPrimary}`}
                  >
                    Total
                  </Text>
                  <Text
                    className={`text-xl font-bold ${themeStyles.textSecondary}`}
                  >
                    ₹{finalAmount.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 px-4 py-4">
            <TouchableOpacity
              onPress={handlePayment}
              className={`${themeStyles.buttonBg} py-4 rounded-lg items-center`}
            >
              <Text className={`text-lg font-medium ${themeStyles.buttonText}`}>
                Confirm Order
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
