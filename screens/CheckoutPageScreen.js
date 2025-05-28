import { useState } from 'react';
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
import Feather from '@expo/vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navbar from '../components/Navbar';

export default function CheckoutPageScreen({ route }) {
  const [showWebView, setShowWebView] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

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
  } = route.params;

  const originalAmount = isDiscounted ? totalAmount / 0.9 : totalAmount;
  const discountAmount = isDiscounted ? originalAmount * 0.1 : 0;
  const finalAmount = isDiscounted ? totalAmount : originalAmount;

  const formatDateTime = (dateStr, timeStr) => {
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
      <body style="background-color:#f2f2f2; display:flex; align-items:center; justify-content:center; height:100vh; margin:0;">
        <h3 style="text-align:center; color:#333;">
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
      <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
        <StatusBar barStyle="light-content" backgroundColor="#000000" />
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
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Navbar title="Checkout" onBackPress={() => navigation.goBack()} />
      {isLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#38bdf8" />
        </View>
      ) : (
        <>
          <ScrollView
            className="px-4 py-6"
            showsVerticalScrollIndicator={false}
          >
            <Text className="text-2xl font-bold">Order Summary</Text>

            <View className="mt-6 flex-row justify-between items-center">
              <View>
                <Text className="text-xl text-gray-700">Meal Type</Text>
                <Text className="text-lg text-red-400">{mealType}</Text>
              </View>
              <Text className="text-xl">{mealType}</Text>
            </View>

            <View className="mt-6 flex-row justify-between items-center">
              <View>
                <Text className="text-xl text-gray-700">Number of Guests</Text>
                <Text className="text-lg text-red-400">{guestCount}</Text>
              </View>
              <Text className="text-xl">{guestCount}</Text>
            </View>

            <View className="mt-6 flex-row justify-between items-center">
              <View>
                <Text className="text-xl text-gray-700">Date & Time</Text>
                <Text className="text-lg text-red-400">
                  {formattedDateTime}
                </Text>
              </View>
              <Text className="text-xl">{formattedDateTime}</Text>
            </View>

            <View className="mt-6 flex-row justify-between items-center">
              <View>
                <Text className="text-xl text-gray-700">Cuisine</Text>
                <Text className="text-lg text-red-400">{selectedCuisine}</Text>
              </View>
              <Text className="text-xl">{selectedCuisine}</Text>
            </View>

            <View className="mt-6 flex-row justify-between items-center">
              <View>
                <Text className="text-xl text-gray-700">Assigned Cook</Text>
                <Text className="text-lg text-red-400">Chef {cookName}</Text>
              </View>
              <Text className="text-xl">Chef {cookName}</Text>
            </View>

            <View className="mt-6">
              <Text className="text-xl text-gray-700">Address:</Text>
              <View className="">
                <Text className="text-red-400 text-lg">{address}</Text>
              </View>
            </View>

            <Text className="text-2xl font-bold mt-12">Payment Details</Text>

            <View className="mt-6">
              <View className="flex-row justify-between items-center">
                <Text className="text-xl">Subtotal</Text>
                <Text className="text-xl">₹{originalAmount.toFixed(2)}</Text>
              </View>
              {isDiscounted && (
                <>
                  <View className="flex-row justify-between items-center mt-2">
                    <Text className="text-xl text-green-500">
                      Discount (10%)
                    </Text>
                    <Text className="text-xl text-green-500">
                      -₹{discountAmount.toFixed(2)}
                    </Text>
                  </View>
                  <View className="border-t border-gray-300 mt-2 pt-2 flex-row justify-between items-center">
                    <Text className="text-xl font-bold">Total</Text>
                    <Text className="text-xl font-bold">
                      ₹{finalAmount.toFixed(2)}
                    </Text>
                  </View>
                </>
              )}
              {!isDiscounted && (
                <View className="border-t border-gray-300 mt-2 pt-2 flex-row justify-between items-center">
                  <Text className="text-xl font-bold">Total</Text>
                  <Text className="text-xl font-bold">
                    ₹{finalAmount.toFixed(2)}
                  </Text>
                </View>
              )}
            </View>
          </ScrollView>

          <View className="absolute bottom-0 left-0 right-0 px-4 py-4">
            <TouchableOpacity
              onPress={handlePayment}
              className="bg-orange-700 py-4 rounded-lg items-center"
            >
              <Text className="text-white text-lg font-medium">
                Confirm Order
              </Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}
