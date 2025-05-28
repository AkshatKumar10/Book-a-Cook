import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { ArrowLeftIcon } from 'react-native-heroicons/solid';
import Navbar from '../components/Navbar';

const FAQScreen = () => {
  const navigation = useNavigation();

  const [expanded, setExpanded] = useState({});

  const toggleFAQ = (index) => {
    setExpanded((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const faqs = [
    {
      question: 'What types of cuisines can I book a chef for?',
      answer:
        'Our platform offers a variety of cuisines, including North Indian, Chinese, South Indian, and more.',
    },
    {
      question: 'How do I book a chef?',
      answer:
        'You can select their profile and click on the "Book Now" button.',
      // },
      // {
      //   question: 'What happens after I book a chef?',
      //   answer:
      //     'The chef will confirm your booking, and you’ll receive a notification.',
      // },
    },
    {
      question: 'How can I cancel a booking?',
      answer:
        'Go to "Bookings," select the booking, and choose the "Cancel Booking" option.',
    },
    {
      question: "What if my chef doesn't show up?",
      answer:
        'In the rare event that your chef does not show up, please contact our support team immediately. We will assist you in finding a replacement chef or provide a full refund.',
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Navbar title="FAQs" onBackPress={() => navigation.goBack()} />
      <ScrollView
        className="flex-1 px-5"
        contentContainerStyle={{ paddingBottom: 20 }}
        showsVerticalScrollIndicator={false}
      >
        {faqs.map((faq, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => toggleFAQ(index)}
            className="mb-4 p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
          >
            <View className="flex-row items-center justify-between">
              <Text className="font-semibold text-gray-800 text-lg flex-1 pr-6">
                {faq.question}
              </Text>
              <Ionicons
                name={expanded[index] ? 'chevron-up' : 'chevron-down'}
                size={20}
                color="gray"
              />
            </View>
            {expanded[index] && (
              <Text className="text-gray-600 mt-2 text-base">{faq.answer}</Text>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
};

export default FAQScreen;
