import { useContext } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import { formatDate } from '../utils/formatDate';

export default function CheckoutPageScreen() {
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
    isDiscounted = false,
    address,
  } = params || {};

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-700',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-900',
    textAccent: theme === 'dark' ? 'text-red-300' : 'text-red-400',
    buttonBg: theme === 'dark' ? 'bg-orange-600' : 'bg-orange-700',
    buttonText: theme === 'dark' ? 'text-white' : 'text-white',
    borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    discountText: theme === 'dark' ? 'text-green-400' : 'text-green-500',
  };

  const originalAmount = isDiscounted ? totalAmount / 0.9 : totalAmount;
  const discountAmount = isDiscounted ? originalAmount * 0.1 : 0;
  const finalAmount = isDiscounted ? totalAmount : originalAmount;

  const handleProceedToPayment = () => {
    navigation.navigate('PaymentScreen', {
      cookId,
      mealType,
      guestCount,
      selectedDate,
      selectedTime,
      selectedCuisine,
      totalAmount: finalAmount,
      cookName,
      cookImage,
      address
    });
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="Checkout" onBackPress={() => navigation.goBack()} />
      <ScrollView className="px-4 py-6" showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
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
          <Text className={`text-lg text-red-300 w-1/5`}>Meal Type</Text>
          <Text className={`text-lg ${themeStyles.textSecondary} flex-1 pl-12`}>
            {mealType}
          </Text>
        </View>

        <View className="flex-row justify-between items-start border-b border-red-100 py-4">
          <Text className={`text-lg text-red-300 w-1/5`}>Number of Guests</Text>
          <Text className={`text-lg ${themeStyles.textSecondary} flex-1 pl-12`}>
            {guestCount}
          </Text>
        </View>

        <View className="flex-row justify-between items-center border-b border-red-100 py-4">
          <Text className={`text-lg text-red-300 w-1/5`}>Date</Text>
          <Text className={`text-lg ${themeStyles.textSecondary} flex-1 pl-12`}>
            {formatDate(selectedDate)}
          </Text>
        </View>

        <View className="flex-row justify-between items-center border-b border-red-100 py-4">
          <Text className={`text-lg text-red-300 w-1/5`}>Time</Text>
          <Text className={`text-lg ${themeStyles.textSecondary} flex-1 pl-12`}>
            {selectedTime}
          </Text>
        </View>

        <View className="flex-row justify-between items-start py-4">
          <Text className={`text-lg text-red-300 w-1/5`}>Location</Text>
          <Text className={`text-lg ${themeStyles.textSecondary} flex-1 pl-12`}>
            {address}
          </Text>
        </View>

        <Text
          className={`text-xl mt-6 font-semibold ${themeStyles.textPrimary}`}
        >
          Payment Summary
        </Text>

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
          onPress={handleProceedToPayment}
          className={`${themeStyles.buttonBg} py-4 rounded-lg items-center`}
        >
          <Text className={`text-lg font-medium ${themeStyles.buttonText}`}>
            Proceed to Pay ₹{finalAmount.toFixed(2)}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
