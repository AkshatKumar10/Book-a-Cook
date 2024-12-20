// HowItWorksScreen.js
import React from "react";
import { View, Text, ScrollView } from "react-native";
import Icon from "react-native-vector-icons/FontAwesome";

const steps = [
  {
    id: 1,
    title: "Find a Cook",
    description: "Browse through our list of talented cooks.",
    icon: "search",
  },
  {
    id: 2,
    title: "Select a Cook",
    description: "Click on the cook you want to know more about.",
    icon: "user",
  },
  {
    id: 3,
    title: "Book Now",
    description: "If you like the cook, click on 'Book Now'.",
    icon: "calendar-check-o",
  },
  {
    id: 4,
    title: "Select Address",
    description:
      "Enter your address so the cook can reach you for meal preparation.",
    icon: "map-marker",
  },
  {
    id: 5,
    title: "Select Date & Time",
    description: "Choose your preferred date and time for the meal.",
    icon: "clock-o",
  },
  {
    id: 6,
    title: "Choose Cuisine",
    description: "Select the cuisine type you want to enjoy.",
    icon: "pot-food",
  },
  {
    id: 7,
    title: "Lunch or Dinner",
    description: "Choose between lunch and dinner.",
    icon: "cutlery",
  },
  {
    id: 8,
    title: "Confirm & Pay",
    description: "Review your order and make the payment.",
    icon: "credit-card",
  },
];

const HowItWorksScreen = () => {
  return (
    <View className="flex-1 bg-white">
      <ScrollView className="mt-3">
        {steps.map((step) => (
          <View
            key={step.id}
            className="bg-gray-100 rounded-lg shadow-md p-4 mb-4"
          >
            <View className="flex-row items-center">
              <Icon name={step.icon} size={30} color="brown" />
              <Text className="text-xl font-semibold ml-3">{step.title}</Text>
            </View>
            <Text className="text-gray-600 mt-2">{step.description}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

export default HowItWorksScreen;
