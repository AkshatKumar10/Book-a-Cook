import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";

const FAQScreen = () => {
  const faqs = [
    {
      question: "What types of cuisines can I book a cook for?",
      answer:
        "Our platform offers a variety of cuisines, including North Indian, Chinese, South Indian and more.",
    },
    {
      question: "How do I book a cook?",
      answer:
        'You can select their profile, and click on the "Book Now" button.',
    },
    {
      question: "What happens after I book a cook?",
      answer:
        "The cook will confirm your booking and you’ll receive a notification.",
    },
    {
      question: "How can I cancel a booking?",
      answer:
        'Go to "My Bookings," select the booking, and choose the "Cancel Booking" option.',
    },
    {
      question: "What if my cook doesn't show up?",
      answer:
        "In the rare event that your cook does not show up, please contact our support team immediately. We will assist you in finding a replacement cook or provide a full refund.",
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50 p-4">
      {faqs.map((faq, index) => (
        <View key={index} className="mb-6 p-4 bg-white rounded-lg shadow-md">
          <Text className="text-lg font-semibold text-gray-800">
            {faq.question}
          </Text>
          <Text className="text-base text-gray-600 mt-2">{faq.answer}</Text>
        </View>
      ))}
    </ScrollView>
  );
};

export default FAQScreen;
