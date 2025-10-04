import React, { useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  Alert,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import Navbar from '../components/Navbar';
import SnackbarComponent from '../components/SnackbarComponent';
import { acceptBooking, declineBooking } from '../utils/api';
import useCookBookings from '../hooks/useCookBookings';

export default function CookBookingsScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { bookings, loading, refreshing, refresh } = useCookBookings();
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  const [declineModalVisible, setDeclineModalVisible] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [declineReason, setDeclineReason] = useState('');

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textSecondary: theme === 'dark' ? 'text-gray-300' : 'text-gray-600',
    textAccent: theme === 'dark' ? 'text-orange-400' : 'text-orange-600',
    buttonBg: theme === 'dark' ? 'bg-green-600' : 'bg-green-500',
    buttonBgSecondary: theme === 'dark' ? 'bg-red-600' : 'bg-red-500',
    buttonText: 'text-white',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    borderColor: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
    modalBg: theme === 'dark' ? 'bg-gray-900' : 'bg-white',
    inputBg: theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100',
    inputText: theme === 'dark' ? 'text-white' : 'text-gray-900',
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

  const renderBookingItem = ({ item }) => (
    <View className={`p-4 mb-4 rounded-lg ${themeStyles.cardBg} ${themeStyles.borderColor}`}>
      <View className="flex-row justify-between items-start mb-2">
        <Text className={`text-lg font-semibold ${themeStyles.textPrimary}`}>
          {item.userId?.username || 'Unknown User'} - {item.mealType}
        </Text>
        <Text className={`text-sm ${themeStyles.textSecondary}`}>
          {item.status.toUpperCase()}
        </Text>
      </View>
      <Text className={`text-sm ${themeStyles.textSecondary} mb-1`}>
        {item.selectedDate} at {item.selectedTime}
      </Text>
      <Text className={`text-sm ${themeStyles.textSecondary} mb-1`}>
        Guests: {item.guestCount} | Cuisine: {item.selectedCuisine}
      </Text>
      <Text className={`text-sm font-medium ${themeStyles.textPrimary}`}>
        Total: ₹{item.totalAmount}
      </Text>
      {item.declineReason && (
        <Text className={`text-xs italic mt-1 ${themeStyles.textSecondary}`}>
          Reason: {item.declineReason}
        </Text>
      )}
      {item.status === 'pending' && (
        <View className="flex-row mt-3 space-x-2">
          <TouchableOpacity
            onPress={() => handleAccept(item._id)}
            className={`flex-1 py-2 rounded ${themeStyles.buttonBg}`}
          >
            <Text className={`text-center font-medium ${themeStyles.buttonText}`}>Accept</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleDeclinePress(item._id)}
            className={`flex-1 py-2 rounded ${themeStyles.buttonBgSecondary}`}
          >
            <Text className={`text-center font-medium ${themeStyles.buttonText}`}>Decline</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Navbar title="My Bookings" />
        <View className="flex-1 items-center justify-center">
          <Ionicons name="hourglass" size={32} color={themeStyles.textAccent} />
          <Text className={`mt-2 text-lg ${themeStyles.textPrimary}`}>Loading...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar title="My Bookings" />
      <FlatList
        data={bookings}
        renderItem={renderBookingItem}
        keyExtractor={(item) => item._id}
        onRefresh={refresh}
        refreshing={refreshing}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View className="flex-1 items-center justify-center py-8">
            <Ionicons name="book-outline" size={48} color={themeStyles.textSecondary} />
            <Text className={`mt-2 text-lg ${themeStyles.textPrimary}`}>No bookings yet</Text>
            <Text className={`text-sm ${themeStyles.textSecondary} text-center mt-1`}>
              Your bookings will appear here once users schedule with you.
            </Text>
          </View>
        }
      />

      {/* Decline Modal */}
      <Modal
        visible={declineModalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setDeclineModalVisible(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50">
          <View className={`w-11/12 p-6 rounded-lg ${themeStyles.modalBg}`}>
            <Text className={`text-lg font-semibold mb-2 ${themeStyles.textPrimary}`}>
              Decline Booking
            </Text>
            <Text className={`text-sm mb-4 ${themeStyles.textSecondary}`}>
              Please provide a reason for declining this booking:
            </Text>
            <TextInput
              className={`p-3 rounded-lg ${themeStyles.inputBg} ${themeStyles.inputText} mb-4`}
              placeholder="Enter reason..."
              placeholderTextColor={themeStyles.textSecondary}
              multiline
              numberOfLines={4}
              value={declineReason}
              onChangeText={setDeclineReason}
            />
            <View className="flex-row space-x-2">
              <TouchableOpacity
                onPress={() => setDeclineModalVisible(false)}
                className={`flex-1 py-3 rounded ${themeStyles.buttonBgSecondary}`}
              >
                <Text className={`text-center font-medium ${themeStyles.buttonText}`}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={handleDecline}
                className={`flex-1 py-3 rounded ${themeStyles.buttonBg}`}
                disabled={!declineReason.trim()}
              >
                <Text className={`text-center font-medium ${themeStyles.buttonText}`}>
                  Confirm Decline
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
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