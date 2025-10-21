import React, { useCallback, useContext, useEffect, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  Switch,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import {
  CommonActions,
  useFocusEffect,
  useNavigation,
} from '@react-navigation/native';
import { ThemeContext } from '../context/ThemeContext';
import useCookProfile from '../hooks/useCookProfile';
import useCookBookings from '../hooks/useCookBookings';
import { Skeleton } from 'moti/skeleton';
import SnackbarComponent from '../components/SnackbarComponent';
import { removeCookToken } from '../utils/api';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Feather from '@expo/vector-icons/Feather';
import AntDesign from '@expo/vector-icons/AntDesign';

const CookDashboardScreen = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const navigation = useNavigation();
  const { data, dataLoading, refresh: refreshProfile } = useCookProfile();
  const { bookings, bookingsLoading, refresh, refreshing } = useCookBookings();
  const { width } = useWindowDimensions();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('info');

  const handleSignOut = async () => {
    try {
      await removeCookToken();
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'CookSignIn' }],
        }),
      );
    } catch (error) {
      setSnackbarMessage('Failed to sign out');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, []),
  );

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    textWelcome: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    summaryCardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    summaryText: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    summaryValue: theme === 'dark' ? 'text-white' : 'text-gray-900',
  };

  const pendingBookings = bookings.filter((b) => {
    if (b.status !== 'pending') return false;
    const [day, month, year] = b.selectedDate.split('/').map(Number);
    const bookingDate = new Date(year, month - 1, day);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return bookingDate >= today;
  }).length;

  const completedBookings = bookings.filter((b) => b.status === 'completed');
  const totalEarnings = completedBookings.reduce(
    (sum, booking) => sum + booking.totalAmount,
    0,
  );

  if (dataLoading || bookingsLoading) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <ScrollView
          contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 20 }}
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-row items-center mb-8">
            <Skeleton colorMode={theme} width={96} height={96} radius="round" />
            <View className="ml-4 flex-1">
              <Skeleton
                colorMode={theme}
                width={width * 0.3}
                height={20}
                radius={10}
              />
              <View style={{ height: 8 }} />
              <Skeleton
                colorMode={theme}
                width={width * 0.5}
                height={28}
                radius={10}
              />
            </View>
          </View>
          <Skeleton
            colorMode={theme}
            width={width * 0.4}
            height={24}
            radius={10}
          />
          <View className="flex-row justify-between mb-6 mt-6">
            <View
              className={`flex-1 ${themeStyles.summaryCardBg} rounded-2xl p-6 mr-2`}
            >
              <Skeleton
                colorMode={theme}
                width={width * 0.3}
                height={20}
                radius={10}
              />
              <View style={{ height: 12 }} />
              <Skeleton
                colorMode={theme}
                width={width * 0.2}
                height={40}
                radius={10}
              />
            </View>
            <View
              className={`flex-1 ${themeStyles.summaryCardBg} rounded-2xl p-6 ml-2`}
            >
              <Skeleton
                colorMode={theme}
                width={width * 0.3}
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
          </View>
          {[...Array(4)].map((_, index) => (
            <View
              key={index}
              className={`${themeStyles.summaryCardBg} rounded-2xl px-4 py-6 mb-4 flex-row items-center justify-between`}
            >
              <View className="flex-row items-center">
                <Skeleton
                  colorMode={theme}
                  width={40}
                  height={40}
                  radius="round"
                />
                <View className="flex-1 px-4">
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.3}
                    height={20}
                    radius={10}
                  />
                  <View style={{ height: 8 }} />
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.5}
                    height={18}
                    radius={10}
                  />
                </View>
                <Skeleton
                  colorMode={theme}
                  width={24}
                  height={24}
                  radius="round"
                />
              </View>
            </View>
          ))}
          <View
            className={`${themeStyles.summaryCardBg} rounded-2xl px-4 py-6 mb-6 flex-row items-center justify-between`}
          >
            <View className="flex-row items-center">
              <Skeleton
                colorMode={theme}
                width={40}
                height={40}
                radius="round"
              />
              <View className="flex-1 px-4">
                <Skeleton
                  colorMode={theme}
                  width={width * 0.3}
                  height={20}
                  radius={10}
                />
                <View style={{ height: 8 }} />
                <Skeleton
                  colorMode={theme}
                  width={width * 0.5}
                  height={18}
                  radius={10}
                />
              </View>
              <Skeleton
                colorMode={theme}
                width={24}
                height={24}
                radius="round"
              />
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
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
        <View className="flex-row items-center mb-8">
          <Image
            source={{
              uri: data?.image,
            }}
            className="h-24 w-24 rounded-full"
          />
          <View className="ml-4 flex-1">
            <Text className={`text-xl ${themeStyles.textWelcome}`}>
              Welcome back,
            </Text>
            <Text className={`text-3xl font-bold ${themeStyles.textPrimary}`}>
              {data?.name}
            </Text>
          </View>
        </View>
        <Text className={`text-2xl font-bold mb-4 ${themeStyles.textPrimary}`}>
          Booking Summary
        </Text>
        <View className="flex-row justify-between mb-6">
          <View
            className={`flex-1 ${themeStyles.summaryCardBg} rounded-2xl p-6 mr-2`}
          >
            <Text
              className={`text-lg font-semibold ${themeStyles.summaryText} mb-2`}
            >
              Pending Bookings
            </Text>
            <Text className={`text-5xl font-bold text-orange-500`}>
              {pendingBookings}
            </Text>
          </View>
          <View
            className={`flex-1 ${themeStyles.summaryCardBg} rounded-2xl p-6 ml-2`}
          >
            <Text
              className={`text-lg font-semibold ${themeStyles.summaryText} mb-2`}
            >
              Total Earnings
            </Text>
            <Text className={`text-5xl font-bold ${themeStyles.summaryValue}`}>
              ₹{totalEarnings.toLocaleString()}
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={() => navigation.navigate('CookBookings')}
          className="bg-orange-500 rounded-2xl px-4 py-6 mb-4 flex-row items-center justify-between"
        >
          <View className="p-2">
            <MaterialIcons name="event-note" size={32} color="white" />
          </View>
          <View className="flex-1 px-4">
            <Text className="text-white text-xl font-bold">View Bookings</Text>
            <Text className="text-white/80 text-lg">
              Check your upcoming appointments
            </Text>
          </View>
          <View>
            <Feather name="chevron-right" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Earning')}
          className="bg-green-500 rounded-2xl px-4 py-6 mb-4 flex-row items-center justify-between"
        >
          <View className="p-2">
            <MaterialIcons
              name="account-balance-wallet"
              size={32}
              color="white"
            />
          </View>
          <View className="flex-1 px-4">
            <Text className="text-white text-xl font-bold">View Earnings</Text>
            <Text className="text-white/80 text-lg">
              Check your earnings history
            </Text>
          </View>
          <View>
            <Feather name="chevron-right" size={24} color="white" />
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('EditCookProfile')}
          className={`${themeStyles.cardBg} rounded-2xl px-4 py-6 mb-4 flex-row items-center justify-between`}
        >
          <View className="flex-row items-center">
            <View className="p-2">
              <Feather name="edit" size={28} color="#f97316" />
            </View>
            <View className="flex-1 px-4">
              <Text className={`text-xl font-bold ${themeStyles.textPrimary}`}>
                Edit Profile
              </Text>
              <Text className={`${themeStyles.textSecondary} text-lg`}>
                Update your personal information
              </Text>
            </View>
            <View>
              <Feather
                name="chevron-right"
                size={24}
                color={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={toggleTheme}
          className={`${themeStyles.cardBg} rounded-2xl px-4 py-6 mb-4 flex-row items-center justify-between`}
        >
          <View className="flex-row items-center">
            <View className="p-2">
              <Feather name="moon" size={28} color="#3b82f6" />
            </View>
            <View className="flex-1 px-4">
              <Text className={`text-xl font-bold ${themeStyles.textPrimary}`}>
                Toggle Theme
              </Text>
              <Text className={`${themeStyles.textSecondary} text-lg`}>
                Switch to {theme === 'dark' ? 'light' : 'dark'} mode
              </Text>
            </View>
            <View>
              <Switch
                value={theme === 'dark'}
                onValueChange={toggleTheme}
                trackColor={{ false: '#d1d5db', true: '#3b82f6' }}
                thumbColor={theme === 'dark' ? '#60a5fa' : '#f3f4f6'}
              />
            </View>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleSignOut}
          className={`${themeStyles.cardBg} rounded-2xl px-4 py-6 mb-6 flex-row items-center justify-between`}
        >
          <View className="flex-row items-center">
            <View className="p-2">
              <AntDesign name="logout" size={28} color="#ef4444" />
            </View>
            <View className="flex-1 px-4">
              <Text className="text-xl font-bold text-red-500">Sign Out</Text>
              <Text className={`${themeStyles.textSecondary} text-lg`}>
                End your current session
              </Text>
            </View>
            <View>
              <Feather
                name="chevron-right"
                size={24}
                color={theme === 'dark' ? '#9ca3af' : '#6b7280'}
              />
            </View>
          </View>
        </TouchableOpacity>
      </ScrollView>
      <SnackbarComponent
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </SafeAreaView>
  );
};

export default CookDashboardScreen;
