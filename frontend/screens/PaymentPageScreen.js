import { useState, useContext } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { ThemeContext } from '../context/ThemeContext';
import { RAZORPAY_KEY_ID } from '@env';
import { createBooking } from '../utils/api';
import * as Animatable from 'react-native-animatable';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function PaymentPageScreen() {
  const [paymentStatus, setPaymentStatus] = useState('pending');
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
    totalAmount,
    address
  } = params || {};

  const themeStyles = {
    webViewContainer: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100',
    webViewBg: theme === 'dark' ? '#1F2937' : '#F2F2F2',
    webViewText: theme === 'dark' ? '#D1D5DB' : '#333333',
    successContainer: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    buttonBg: theme === 'dark' ? 'bg-orange-600' : 'bg-orange-700',
    buttonText: theme === 'dark' ? 'text-white' : 'text-white',
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
              amount: ${totalAmount * 100},
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
        totalAmount,
        address,
        paymentId: data.response.razorpay_payment_id,
      };
      createBooking(bookingData)
        .then(() => {
          setPaymentStatus('success');
        })
        .catch((error) => {
          console.error('Error on payment', error);
          setPaymentStatus('failed');
        });
    } else if (data.event === 'DISMISS') {
      setPaymentStatus('cancelled');
    }
  };

  const handleContinue = () => {
    if (paymentStatus === 'success') {
      navigation.reset({
        index: 0,
        routes: [{ name: 'HomeTabs', params: { screen: 'Home' } }],
      });
    } else {
      navigation.goBack();
    }
  };

  if (paymentStatus === 'pending') {
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
    <SafeAreaView className={`flex-1 ${themeStyles.successContainer}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <View className="flex-1 justify-center items-center px-4">
        {paymentStatus === 'success' && (
          <>
            <Animatable.View
              animation="bounceIn"
              duration={1000}
              className="mb-6"
            >
              <Text className="text-6xl">✅</Text>
            </Animatable.View>
            <Text className={`text-2xl font-bold ${themeStyles.textPrimary} mb-2`}>
              Booking Confirmed!
            </Text>
            <Text className={`text-lg ${themeStyles.textSecondary} text-center mb-8`}>
              Your booking is pending cook approval. You'll receive a confirmation soon.
            </Text>
          </>
        )}
        {paymentStatus === 'failed' && (
          <>
            <Animatable.View
              animation="shake"
              duration={1000}
              className="mb-6"
            >
              <Text className="text-6xl">❌</Text>
            </Animatable.View>
            <Text className={`text-2xl font-bold ${themeStyles.textPrimary} mb-2`}>
              Payment Failed
            </Text>
            <Text className={`text-lg ${themeStyles.textSecondary} text-center mb-8`}>
              Failed to create booking. Please contact support or try again.
            </Text>
          </>
        )}
        {paymentStatus === 'cancelled' && (
          <>
            <Animatable.View
              animation="shake"
              duration={1000}
              className="mb-6"
            >
              <Text className="text-6xl">⚠️</Text>
            </Animatable.View>
            <Text className={`text-2xl font-bold ${themeStyles.textPrimary} mb-2`}>
              Payment Cancelled
            </Text>
            <Text className={`text-lg ${themeStyles.textSecondary} text-center mb-8`}>
              The payment process was cancelled. You can try again anytime.
            </Text>
          </>
        )}
        <TouchableOpacity
          onPress={handleContinue}
          className={`${themeStyles.buttonBg} py-4 px-8 rounded-lg`}
        >
          <Text className={`text-lg font-medium ${themeStyles.buttonText}`}>
            {paymentStatus === 'success' ? 'Go to Home' : 'Try Again'}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}