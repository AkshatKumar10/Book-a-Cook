import { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { RAZORPAY_KEY_ID } from '@env';
import { createBooking } from '../utils/api';

export default function CheckoutPageScreen() {
  const [showWebView, setShowWebView] = useState(false);
  const navigation = useNavigation();
  const { params } = useRoute();
  const { theme } = useContext(ThemeContext);

  const {
    cookId,
    mealType,
    guestCount,
    selectedDate,
    selectedTime,
    selectedCuisine,
    cookName,
    totalAmount,
    cookImage,
    // address,
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
    webViewBg: theme === 'dark' ? '#1F2937' : '#F2F2F2',
    webViewText: theme === 'dark' ? '#D1D5DB' : '#333333',
  };

  const originalAmount = isDiscounted ? totalAmount / 0.9 : totalAmount;
  const discountAmount = isDiscounted ? originalAmount * 0.1 : 0;
  const finalAmount = isDiscounted ? totalAmount : originalAmount;

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const razorpayHTML = `
    <html>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
        <script>
          window.onload = function() {
            var options = {
              key: "${RAZORPAY_KEY_ID}",
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
      const bookingData = {
        cookId,
        mealType,
        guestCount,
        selectedDate,
        selectedTime,
        selectedCuisine,
        totalAmount: finalAmount,
        paymentId: data.response.razorpay_payment_id,
      };
      createBooking(bookingData)
        .then(() => {
          Alert.alert(
            'Booking Created!',
            'Your booking is pending cook approval.',
          );
          navigation.reset({
            index: 0,
            routes: [{ name: 'HomeTabs', params: { screen: 'Home' } }],
          });
        })
        
        .catch((error) => {
          console.error('Error on payment', error);
          Alert.alert(
            'Payment Error',
            'Failed to create booking. Please contact support.',
          );
        });
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
    setTimeout(() => {
      setShowWebView(true);
    }, 500);
  };

  if (showWebView) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.webViewContainer}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
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
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="Checkout" onBackPress={() => navigation.goBack()} />
      <ScrollView className="px-4 py-6" showsVerticalScrollIndicator={false}>
        <Text className={`text-xl font-semibold ${themeStyles.textPrimary}`}>
          Cook
        </Text>
        <View className="mt-2 flex-row items-center gap-12">
          <Image
            source={{ uri: cookImage }}
            className="w-24 h-24 rounded-full"
          />
          <View>
            <Text className={`text-xl mt-2 ${themeStyles.textPrimary}`}>
              Chef {cookName}
            </Text>
            <Text className={`text-lg ${themeStyles.textAccent}`}>
              ID: {`${cookName.slice(0, 3).toUpperCase()}-${cookId.slice(-4)}`}
            </Text>
          </View>
        </View>

        <Text
          className={`mt-6 text-xl font-semibold ${themeStyles.textPrimary}`}
        >
          Booking Details
        </Text>

        <View className="mt-4 flex-row justify-between items-center border-b border-red-100 pb-4">
          <Text className={`text-lg text-red-300 w-1/5`}>Cuisine</Text>
          <Text className={`text-lg ${themeStyles.textSecondary} flex-1 pl-12`}>
            {selectedCuisine}
          </Text>
        </View>

        <View className="flex-row justify-between items-center border-b border-red-100 py-4">
          <Text className={`text-lg  text-red-300 w-1/5`}>Meal Type</Text>
          <Text className={`text-lg ${themeStyles.textSecondary} flex-1 pl-12`}>
            {mealType}
          </Text>
        </View>

        <View className="flex-row justify-between items-start border-b border-red-100 py-4">
          <Text className={`text-lg  text-red-300 w-1/5`}>
            Number of Guests
          </Text>
          <Text className={`text-lg ${themeStyles.textSecondary} flex-1 pl-12`}>
            {guestCount}
          </Text>
        </View>

        <View className="flex-row justify-between items-center border-b border-red-100 py-4">
          <Text className={`text-lg  text-red-300 w-1/5`}>Date</Text>
          <Text className={`text-lg ${themeStyles.textSecondary} flex-1 pl-12`}>
            {formatDate(selectedDate)}
          </Text>
        </View>

        <View className="flex-row justify-between items-center py-4">
          <Text className={`text-lg  text-red-300 w-1/5`}>Time</Text>
          <Text className={`text-lg ${themeStyles.textSecondary} flex-1 pl-12`}>
            {selectedTime}
          </Text>
        </View>
        <Text
          className={`text-xl mt-6 font-semibold ${themeStyles.textPrimary}`}
        >
          Payment Summary
        </Text>

        {/* <View className="mt-6">
          <Text className={`text-xl ${themeStyles.textPrimary}`}>Address</Text>
          <View>
            <Text className={`text-lg ${themeStyles.textAccent}`}>
              {address}
            </Text>
          </View>
        </View> */}

        <View className="mt-6">
          <View className="flex-row justify-between items-center">
            <Text className={`text-xl text-red-300 border-b`}>Subtotal</Text>
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
            <View className={`mt-2 pt-2 flex-row justify-between items-center`}>
              <Text className={`text-xl font-bold text-red-300`}>Total</Text>
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
            Pay ₹{finalAmount.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
