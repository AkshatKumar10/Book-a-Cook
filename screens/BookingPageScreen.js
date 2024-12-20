import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { Picker } from "@react-native-picker/picker";
import { useNavigation } from "@react-navigation/native";

export default function BookingPageScreen({ route }) {
  const { cook, pricing } = route.params;

  const [mealType, setMealType] = useState(null);
  const [guestCount, setGuestCount] = useState(2);
  const [address, setAddress] = useState("Select Address");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedCuisine, setSelectedCuisine] = useState("North Indian"); // State for selected cuisine
  const [cookName, setCookName] = useState(pricing[selectedCuisine].cook); // Set initial cook based on default cuisine
  const [cookPrice, setCookPrice] = useState(pricing[selectedCuisine].price); // Set initial price based on default cuisine

  // Update cook and price when cuisine changes
  const handleCuisineChange = (itemValue) => {
    setSelectedCuisine(itemValue);
    // Update cook name
    setCookName(pricing[itemValue].cook);
    setCookPrice(pricing[itemValue].price); // Update cook price
  };
  const navigation = useNavigation();
  const incrementGuests = () => {
    setGuestCount((prev) => prev + 1);
  };

  const handleContactSupport = () => {
    const email = "bookachef@gmail.com";
    const subject = "Support Request"; // Optional subject
    const body = ""; // Optional body content
    const mailtoLink = `mailto:${email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    Linking.openURL(mailtoLink).catch((err) =>
      console.error("Error opening email client", err)
    );
  };
  const calculateTotalAmount = (guestCount, cookPrice) => {
    return guestCount * cookPrice; // Calculate total based on guest count and selected cook's price
  };

  const totalAmount = calculateTotalAmount(guestCount, cookPrice);
  const handleNext = () => {
    // Validate all fields
    if (
      !mealType ||
      !guestCount ||
      !address ||
      !selectedDate ||
      !selectedTime ||
      !selectedCuisine ||
      !cookName
    ) {
      alert("Please fill in all fields before proceeding to checkout.");
      return;
    }

    // Navigate to CheckoutPageScreen if all fields are filled
    navigation.navigate("CheckoutPageScreen", {
      mealType,
      guestCount,
      address,
      selectedDate,
      selectedTime,
      selectedCuisine,
      cookName,
      totalAmount,
    });
  };

  const decrementGuests = () => {
    setGuestCount((prev) => (prev > 1 ? prev - 1 : prev));
  };

  const showTimePicker = () => {
    setTimePickerVisibility(false); // Reset before showing again
    setTimeout(() => {
      setTimePickerVisibility(true);
    }, 100); // Small delay to avoid race conditions
  };

  const hideTimePicker = () => {
    setTimePickerVisibility(false);
  };

  const timeRestrictions = {
    "North Indian": { start: 10, end: 20 }, // 10 AM to 8 PM
    "South Indian": { start: 11, end: 21 }, // 11 AM to 9 PM
    Chinese: { start: 12, end: 22 }, // 12 PM to 10 PM
    Western: { start: 9, end: 21 }, // 9 AM to 9 PM
  };

  const handleConfirmTime = (time) => {
    const formattedTime = time.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });

    const selectedHour = time.getHours();
    const selectedMinute = time.getMinutes();
    const selectedTotalMinutes = selectedHour * 60 + selectedMinute;

    // Get the allowed time range for the selected cuisine
    const { start, end } = timeRestrictions[selectedCuisine];
    const startTotalMinutes = start * 60;
    const endTotalMinutes = end * 60;

    // Check if the selected time is within the allowed range
    if (
      selectedTotalMinutes < startTotalMinutes ||
      selectedTotalMinutes > endTotalMinutes
    ) {
      Alert.alert(
        "Time Selection Error",
        `For ${selectedCuisine} cuisine, please select a time between ${start} AM and ${end} PM.`
      );
      return; // Exit the function if the time is not valid
    }

    setSelectedTime(formattedTime);
    hideTimePicker();
  };

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirmDate = (date) => {
    const formattedDate = date.toLocaleDateString();
    const today = new Date();
    setSelectedDate(formattedDate);
    hideDatePicker();
  };

  return (
    <View className="flex-1 bg-white">
      <ScrollView className="px-4 py-6">
        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">Select Address:</Text>
          <TouchableOpacity
            onPress={() => {
              const addressUrl =
                "https://www.google.com/maps/search/?api=1&query=Dayananda+Sagar+College+of+Engineering"; // Replace 'Your+Address' with the actual address or a variable containing the address
              Linking.openURL(addressUrl).catch((err) =>
                console.error("Error opening Google Maps", err)
              );
            }}
            className="flex-row items-center justify-between border border-gray-300 rounded-lg px-4 py-3"
          >
            <Text className="text-gray-700">{address}</Text>
            <MaterialCommunityIcons
              name="chevron-right"
              size={20}
              color="gray"
            />
          </TouchableOpacity>
        </View>

        {/* Guest Count */}
        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">For how many people?</Text>
          <View className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3 justify-between">
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

        {/* Date Picker */}
        <View className="mb-6">
          <Text className="text-lg font-medium mb-2">Select Date:</Text>
          <TouchableOpacity
            onPress={showDatePicker}
            className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3"
          >
            <TextInput
              placeholder="DD/MM/YYYY"
              className="flex-1 text-gray-700 h-10"
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
            className="flex-row items-center border border-gray-300 rounded-lg px-4 py-3"
          >
            <TextInput
              placeholder="HH:MM AM/PM"
              className="flex-1 text-gray-700 h-10"
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
          minimumDate={new Date()}
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
          <View className="border border-gray-300 rounded-lg px-4">
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

        {/* Display Cook's Name */}
        <View className="mb-6 flex-row">
          <Text className="text-lg mt-0.5">Cook:</Text>
          <Text className="text-2xl font-medium ml-2 ">{cookName}</Text>
        </View>

        <Text className="text-lg font-medium mb-2">Choose Meal</Text>
        <View className="flex-row space-x-2 gap-5 mb-6">
          <TouchableOpacity
            onPress={() => setMealType("Lunch")}
            className={`flex-1 py-3 rounded-lg border ${
              mealType === "Lunch"
                ? "border-orange-500 bg-orange-100"
                : "border-gray-300"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                mealType === "Lunch" ? "text-orange-700" : "text-gray-700"
              }`}
            >
              Lunch
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setMealType("Dinner")}
            className={`flex-1 py-3 rounded-lg border ${
              mealType === "Dinner"
                ? "border-orange-500 bg-orange-100"
                : "border-gray-300"
            }`}
          >
            <Text
              className={`text-center font-medium ${
                mealType === "Dinner" ? "text-orange-700" : "text-gray-700"
              }`}
            >
              Dinner
            </Text>
          </TouchableOpacity>
        </View>

        {/* Support Link */}
        <Text className="text-center text-lg text-gray-500 mt-3">
          Need assistance?
          <Text
            className="text-orange-700 underline"
            onPress={handleContactSupport}
          >
            Contact Support
          </Text>
        </Text>

        {/* Next Button */}
        <TouchableOpacity
          onPress={handleNext}
          className="mt-6 bg-orange-700 py-4 rounded-lg mb-10"
        >
          <Text className="text-center text-white font-medium">Next</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
