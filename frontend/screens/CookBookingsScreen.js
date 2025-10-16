import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Modal,
  TextInput,
  Image,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import Navbar from '../components/Navbar';
import SnackbarComponent from '../components/SnackbarComponent';
import { acceptBooking, declineBooking } from '../utils/api';
import useCookBookings from '../hooks/useCookBookings';
import { formatDate } from '../utils/formatDate';
import { Skeleton } from 'moti/skeleton';

export default function CookBookingsScreen() {
  const { theme } = useContext(ThemeContext);
  const { bookings, cookBookingLoading, refreshing, refresh } =
    useCookBookings();
  const { width } = useWindowDimensions();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');
  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    textLabel: theme === 'dark' ? 'text-gray-500' : 'text-gray-500',
    cardBg: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    modalBg: theme === 'dark' ? 'bg-gray-900' : 'bg-gray-100',
    inputBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    inputBorder: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    inputText: theme === 'dark' ? 'text-white' : 'text-gray-900',
    divider: theme === 'dark' ? 'border-gray-800' : 'border-gray-200',
  };

  const handleAccept = async (bookingId) => {
    try {
      await acceptBooking(bookingId);
      setSnackbarMessage('Booking accepted successfully!');
      setSnackbarType('success');
      setSnackbarVisible(true);
      refresh();
    } catch (error) {
      setSnackbarMessage('Failed to accept booking');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  const handleDeclinePress = (bookingId) => {
    setSelectedBookingId(bookingId);
    setDeclineReason('');
    setDeclineModalVisible(true);
  };

  const handleDecline = async () => {
    if (!declineReason.trim()) {
      setDeclineModalVisible(false);
      setSnackbarMessage('Please provide a reason for decline');
      setSnackbarType('error');
      setSnackbarVisible(true);
      return;
    }
    try {
      await declineBooking(selectedBookingId, declineReason);
      setSnackbarMessage('Booking declined successfully!');
      setSnackbarType('success');
      setSnackbarVisible(true);
      setDeclineModalVisible(false);
      refresh();
    } catch (error) {
      setSnackbarMessage('Failed to decline booking');
      setSnackbarType('error');
      setSnackbarVisible(true);
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending':
        return {
          bg: 'bg-yellow-100',
          text: 'text-yellow-700',
          label: 'Pending',
        };
      case 'accepted':
        return {
          bg: 'bg-green-100',
          text: 'text-green-700',
          label: 'Accepted',
        };
      case 'declined':
        return { bg: 'bg-red-100', text: 'text-red-700', label: 'Declined' };
      default:
        return { bg: 'bg-gray-100', text: 'text-gray-700', label: 'Unknown' };
    }
  };

  const renderBookingItem = ({ item }) => {
    const statusBadge = getStatusBadge(item.status);

    return (
      <View className={`mx-4 mb-4 rounded-2xl ${themeStyles.cardBg} p-5`}>
        <View className="flex-row items-center justify-between mb-5">
          <View className="flex-row items-center flex-1">
            <Image
              source={{
                uri: item.userId?.profileImage,
              }}
              className="w-12 h-12 rounded-full"
            />
            <View className="ml-3 flex-1">
              <Text
                className={`text-lg font-semibold ${themeStyles.textPrimary}`}
              >
                {item.userId?.username}
              </Text>
              <Text className={`text-sm ${themeStyles.textLabel}`}>
                Booking ID: {item._id.slice(-6).toUpperCase()}
              </Text>
            </View>
          </View>
          <View className={`px-3 py-1.5 rounded-full ${statusBadge.bg}`}>
            <Text className={`text-xs font-semibold ${statusBadge.text}`}>
              {statusBadge.label}
            </Text>
          </View>
        </View>
        <View className={`space-y-3 border-t ${themeStyles.divider}`}>
          <View className="flex-row justify-between py-2">
            <Text className={`text-base ${themeStyles.textLabel}`}>
              Meal Type
            </Text>
            <Text
              className={`text-base font-semibold ${themeStyles.textPrimary}`}
            >
              {item.mealType}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className={`text-base ${themeStyles.textLabel}`}>
              Guest Count
            </Text>
            <Text
              className={`text-base font-semibold ${themeStyles.textPrimary}`}
            >
              {item.guestCount}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className={`text-base ${themeStyles.textLabel}`}>
              Selected Date
            </Text>
            <Text
              className={`text-base font-semibold ${themeStyles.textPrimary}`}
            >
              {formatDate(item.selectedDate)}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className={`text-base ${themeStyles.textLabel}`}>
              Selected Time
            </Text>
            <Text
              className={`text-base font-semibold ${themeStyles.textPrimary}`}
            >
              {item.selectedTime}
            </Text>
          </View>
          <View className="flex-row justify-between py-2">
            <Text className={`text-base ${themeStyles.textLabel}`}>
              Selected Cuisine
            </Text>
            <Text
              className={`text-base font-semibold ${themeStyles.textPrimary}`}
            >
              {item.selectedCuisine}
            </Text>
          </View>
          <View className="py-2">
            <Text className={`text-base ${themeStyles.textLabel}`}>
              Location
            </Text>
            <Text
              className={`text-base font-semibold ${themeStyles.textPrimary} mt-1`}
            >
              {item.address}
            </Text>
          </View>

          <View
            className={`flex-row justify-between py-3 border-t ${themeStyles.divider}`}
          >
            <Text
              className={`text-lg font-semibold ${themeStyles.textPrimary}`}
            >
              Total Amount
            </Text>
            <Text className="text-2xl font-bold text-orange-500">
              ₹{item.totalAmount.toFixed(2)}
            </Text>
          </View>
        </View>
        {item.status === 'pending' && (
          <View className="flex-row space-x-3 gap-4 mt-5">
            <TouchableOpacity
              onPress={() => handleDeclinePress(item._id)}
              className="flex-1 bg-orange-100 rounded-xl py-4"
              activeOpacity={0.7}
            >
              <Text className="text-center font-semibold text-orange-600 text-base">
                Decline
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => handleAccept(item._id)}
              className="flex-1 bg-orange-500 rounded-xl py-4"
              activeOpacity={0.7}
            >
              <Text className="text-center font-semibold text-white text-base">
                Accept
              </Text>
            </TouchableOpacity>
          </View>
        )}
        {item.declineReason && (
          <View
            className={`mt-4 p-4 rounded-xl ${theme === 'dark' ? 'bg-red-900/20' : 'bg-red-50'}`}
          >
            <Text
              className={`text-sm font-semibold mb-1 ${themeStyles.textLabel}`}
            >
              Decline Reason
            </Text>
            <Text
              className={`text-sm ${theme === 'dark' ? 'text-red-400' : 'text-red-700'}`}
            >
              {item.declineReason}
            </Text>
          </View>
        )}
      </View>
    );
  };

  if (cookBookingLoading) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Navbar title="Booking Request" />
        <FlatList
          data={[1, 2, 3]}
          renderItem={() => (
            <View className={`mx-4 mb-4 rounded-2xl ${themeStyles.cardBg} p-5`}>
              <View className="flex-row items-center justify-between mb-5">
                <View className="flex-row items-center flex-1">
                  <Skeleton
                    colorMode={theme}
                    width={48}
                    height={48}
                    radius="round"
                  />
                  <View className="ml-3 flex-1">
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
                </View>
                <Skeleton
                  colorMode={theme}
                  width={80}
                  height={24}
                  radius={20}
                />
              </View>
              <View className={`space-y-3 border-t ${themeStyles.divider}`}>
                <View className="flex-row justify-between py-2">
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.3}
                    height={20}
                    radius={10}
                  />
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.3}
                    height={20}
                    radius={10}
                  />
                </View>
                <View className="flex-row justify-between py-2">
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.3}
                    height={20}
                    radius={10}
                  />
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.2}
                    height={20}
                    radius={10}
                  />
                </View>
                <View className="flex-row justify-between py-2">
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.3}
                    height={20}
                    radius={10}
                  />
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.3}
                    height={20}
                    radius={10}
                  />
                </View>
                <View className="flex-row justify-between py-2">
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.3}
                    height={20}
                    radius={10}
                  />
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.2}
                    height={20}
                    radius={10}
                  />
                </View>
                <View className="flex-row justify-between py-2">
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.3}
                    height={20}
                    radius={10}
                  />
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.3}
                    height={20}
                    radius={10}
                  />
                </View>
                <View className={`flex py-2`}>
                  <Skeleton
                    colorMode={theme}
                    width={width * 0.3}
                    height={24}
                    radius={10}
                  />
                </View>
                <View className="mt-2" />
                <Skeleton
                  colorMode={theme}
                  width={width * 0.85}
                  height={80}
                  radius={10}
                />
              </View>
              <View className={`border-t my-4 ${themeStyles.divider}`} />
              <View className="flex-row justify-between">
                <Skeleton
                  colorMode={theme}
                  width={width * 0.3}
                  height={20}
                  radius={10}
                />
                <Skeleton
                  colorMode={theme}
                  width={width * 0.2}
                  height={20}
                  radius={10}
                />
              </View>
              <View className="flex-row space-x-3 gap-4 mt-5">
                <Skeleton
                  colorMode={theme}
                  width={(width - 80) / 2}
                  height={48}
                  radius={10}
                />
                <Skeleton
                  colorMode={theme}
                  width={(width - 80) / 2}
                  height={48}
                  radius={10}
                />
              </View>
            </View>
          )}
          keyExtractor={(item) => item.toString()}
          contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
          showsVerticalScrollIndicator={false}
        />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="Booking Request" />
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item._id}
        onRefresh={refresh}
        refreshing={refreshing}
        contentContainerStyle={{ paddingTop: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-20 px-8">
            <Ionicons
              name="calendar-outline"
              size={80}
              color={theme === 'dark' ? '#4b5563' : '#9ca3af'}
            />
            <Text
              className={`text-2xl font-bold mt-4 ${themeStyles.textPrimary}`}
            >
              No Bookings Yet
            </Text>
            <Text
              className={`text-base ${themeStyles.textSecondary} text-center mt-2`}
            >
              Your bookings will appear here once users schedule with you.
            </Text>
          </View>
        }
      />
      <Modal
        visible={declineModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setDeclineModalVisible(false)}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'padding'}
          className="flex-1"
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View className="flex-1 bg-black/90 justify-center items-center px-5">
              <TouchableWithoutFeedback>
                <View
                  className={`${themeStyles.modalBg} rounded-3xl p-6 w-full`}
                >
                  <View className="flex-row justify-between items-center mb-4">
                    <Text
                      className={`text-xl font-bold ${themeStyles.textPrimary}`}
                    >
                      Decline Booking
                    </Text>
                    <TouchableOpacity
                      onPress={() => setDeclineModalVisible(false)}
                    >
                      <Ionicons
                        name="close"
                        size={24}
                        color={theme === 'dark' ? '#9ca3af' : '#6b7280'}
                      />
                    </TouchableOpacity>
                  </View>
                  <Text className={`text-sm ${themeStyles.textLabel} mb-2`}>
                    Decline Reason
                  </Text>
                  <TextInput
                    className={`p-4 rounded-xl ${themeStyles.inputBg} ${themeStyles.inputText} border ${themeStyles.inputBorder} text-base mb-6`}
                    placeholder="Enter reason for declining..."
                    placeholderTextColor={
                      theme === 'dark' ? '#6b7280' : '#9ca3af'
                    }
                    multiline
                    numberOfLines={4}
                    textAlignVertical="top"
                    value={declineReason}
                    onChangeText={setDeclineReason}
                  />
                  <View className="flex-row space-x-3 gap-4">
                    <TouchableOpacity
                      onPress={() => setDeclineModalVisible(false)}
                      className={`flex-1 py-4 rounded-xl ${theme === 'dark' ? 'bg-gray-800' : 'bg-gray-200'}`}
                      activeOpacity={0.7}
                    >
                      <Text
                        className={`text-center font-semibold text-base ${themeStyles.textPrimary}`}
                      >
                        Cancel
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={handleDecline}
                      className="flex-1 bg-orange-500 py-4 rounded-xl"
                      activeOpacity={0.7}
                    >
                      <Text className="text-center font-semibold text-white text-base">
                        Confirm Decline
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </Modal>
      <SnackbarComponent
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </SafeAreaView>
  );
}
