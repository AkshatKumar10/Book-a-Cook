import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { ThemeContext } from '../context/ThemeContext';
import useCookBookings from '../hooks/useCookBookings';
import { Skeleton } from 'moti/skeleton';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Navbar from '../components/Navbar';
import { formatDate } from '../utils/formatDate';

const EarningScreen = () => {
  const { theme } = useContext(ThemeContext);
  const { bookings, cookBookingLoading, refresh, refreshing } =
    useCookBookings();
  const { width } = useWindowDimensions();

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    header: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    earningsCardBg: theme === 'dark' ? 'bg-orange-900/30' : 'bg-orange-100',
    iconBg: theme === 'dark' ? 'bg-orange-900/40' : 'bg-orange-100',
  };

  const completedBookings = bookings.filter(
    (booking) => booking.status === 'completed',
  );

  const totalEarnings = completedBookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0,
  );

  if (cookBookingLoading) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Navbar title="Earnings" />
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View
            className={`${themeStyles.earningsCardBg} rounded-3xl p-6 mb-6 items-center`}
          >
            <Skeleton
              colorMode={theme}
              width={width * 0.4}
              height={20}
              radius={10}
            />
            <View style={{ height: 12 }} />
            <Skeleton
              colorMode={theme}
              width={width * 0.3}
              height={40}
              radius={10}
            />
          </View>
          <View className="mb-4">
            <Skeleton
              colorMode={theme}
              width={width * 0.5}
              height={24}
              radius={10}
            />
          </View>
          {[...Array(5)].map((_, index) => (
            <View
              key={index}
              className={`${themeStyles.cardBg} rounded-2xl p-6 mb-3 flex-row items-center`}
            >
              <Skeleton colorMode={theme} width={48} height={48} radius={12} />
              <View className="flex-1 ml-4">
                <Skeleton
                  colorMode={theme}
                  width={width * 0.4}
                  height={20}
                  radius={10}
                />
                <View style={{ height: 8 }} />
                <Skeleton
                  colorMode={theme}
                  width={width * 0.3}
                  height={16}
                  radius={10}
                />
              </View>
              <View className="items-end">
                <Skeleton
                  colorMode={theme}
                  width={60}
                  height={20}
                  radius={10}
                />
                <View style={{ height: 8 }} />
                <Skeleton
                  colorMode={theme}
                  width={80}
                  height={16}
                  radius={10}
                />
              </View>
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="Earnings" />
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refresh}
            tintColor={theme === 'dark' ? 'white' : 'black'}
          />
        }
      >
        <View className={`${themeStyles.earningsCardBg} rounded-3xl p-6 mb-6`}>
          <Text className="text-orange-600 text-center font-semibold text-base mb-2 mt-4">
            Total Earnings
          </Text>
          <Text
            className={`text-center text-5xl font-bold ${themeStyles.textPrimary} mb-4`}
          >
            ₹{totalEarnings.toLocaleString()}
          </Text>
        </View>

        <View className="mb-4">
          <Text className={`text-xl font-bold ${themeStyles.textPrimary}`}>
            Payment History
          </Text>
        </View>

        {completedBookings.length === 0 ? (
          <View className="items-center justify-center py-20">
            <MaterialCommunityIcons
              name="cash-off"
              size={64}
              color={theme === 'dark' ? '#6b7280' : '#9ca3af'}
            />
            <Text className={`text-lg mt-4 ${themeStyles.textSecondary}`}>
              No earnings yet
            </Text>
            <Text className={`text-center mt-2 ${themeStyles.textSecondary}`}>
              Complete bookings to start earning
            </Text>
          </View>
        ) : (
          completedBookings.map((booking) => (
            <View
              key={booking._id}
              className={`${themeStyles.cardBg} rounded-2xl p-6 mb-3 flex-row items-center`}
            >
              <View className={`${themeStyles.iconBg} rounded-xl p-3`}>
                <MaterialCommunityIcons
                  name="silverware-fork-knife"
                  size={24}
                  color="#f97316"
                />
              </View>
              <View className="flex-1 ml-4">
                <Text
                  className={`text-base font-bold ${themeStyles.textPrimary}`}
                >
                  Booking with {booking.userId.username}
                </Text>
                <Text className={`text-sm mt-1 ${themeStyles.textSecondary}`}>
                  {formatDate(booking.selectedDate)}
                </Text>
              </View>
              <View className="items-end">
                <Text className="text-green-500 font-bold text-lg">
                  +₹{booking.totalAmount}
                </Text>
                <Text className={`text-xs mt-1 ${themeStyles.textSecondary}`}>
                  Completed
                </Text>
              </View>
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default EarningScreen;
