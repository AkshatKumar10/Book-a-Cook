import { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
  Image,
  StatusBar,
  BackHandler,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Feather from '@expo/vector-icons/Feather';
import { FontAwesome5 } from '@expo/vector-icons';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import Navbar from '../components/Navbar';

const MyBookingsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [bookings, setBookings] = useState([]);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [isTimePickerVisible, setTimePickerVisibility] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newDate, setNewDate] = useState('');
  const [newTime, setNewTime] = useState('');

  const loadBookings = async () => {
    try {
      const storedBookings = await AsyncStorage.getItem('bookings');
      if (storedBookings) {
        const parsedBookings = JSON.parse(storedBookings);
        const sortedBookings = parsedBookings.sort((a, b) => {
          const dateA = parseBookingDateTime(a);
          const dateB = parseBookingDateTime(b);

          return dateB - dateA;
        });
        setBookings(sortedBookings);
      }
    } catch (error) {
      console.error('Error loading bookings:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.navigate('Home');
        return true;
      };

      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );

      return () => backHandler.remove();
    }, [navigation]),
  );

  useEffect(() => {
    loadBookings();
    if (route.params?.refresh) {
      loadBookings();
    }
  }, [route.params?.refresh]);

  const handleCancelBooking = (id) => {
    Alert.alert(
      'Cancel Booking',
      'Are you sure you want to cancel this booking?',
      [
        { text: 'Cancel' },
        {
          text: 'OK',
          onPress: async () => {
            try {
              const updatedBookings = bookings.filter(
                (booking) => booking.id !== id,
              );
              setBookings(updatedBookings);
              await AsyncStorage.setItem(
                'bookings',
                JSON.stringify(updatedBookings),
              );
            } catch (error) {
              console.error('Error cancelling booking:', error);
            }
          },
        },
      ],
    );
  };

  const handleModifyBooking = (booking) => {
    setSelectedBooking(booking);
    setNewDate(booking.date);
    setNewTime(booking.time);
    setDatePickerVisibility(true);
  };

  const handleConfirmDate = (date) => {
    setNewDate(date.toLocaleDateString());
    setDatePickerVisibility(false);
    setTimePickerVisibility(true);
  };

  const handleConfirmTime = async (time) => {
    const formattedTime = time.toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
    });
    setNewTime(formattedTime);
    setTimePickerVisibility(false);
    try {
      const updatedBookings = bookings.map((booking) =>
        booking.id === selectedBooking.id
          ? { ...booking, date: newDate, time: formattedTime }
          : booking,
      );
      const sortedBookings = updatedBookings.sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
      );
      setBookings(sortedBookings);
      await AsyncStorage.setItem('bookings', JSON.stringify(sortedBookings));
    } catch (error) {
      console.error('Error updating booking:', error);
    }
  };

  const convertTo24Hour = (time12h) => {
    const [time, modifier] = time12h.split(' ');
    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier.toLowerCase() === 'pm') {
      hours = String(parseInt(hours, 10) + 12);
    }

    return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
  };
  const parseBookingDateTime = (booking) => {
    const [day, month, year] = booking.date.split('/');

    const convertTo24Hour = (time12h) => {
      const [time, modifier] = time12h.split(' ');
      let [hours, minutes] = time.split(':');

      if (hours === '12') {
        hours = '00';
      }
      if (modifier.toLowerCase() === 'pm') {
        hours = String(parseInt(hours, 10) + 12);
      }
      return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
    };

    const time24 = convertTo24Hour(booking.time);

    return new Date(`${year}-${month}-${day}T${time24}:00`);
  };

  useEffect(() => {
    const now = new Date();

    const updatedBookings = bookings.map((booking) => {
      const [day, month, year] = booking.date.split('/');
      const time24 = convertTo24Hour(booking.time);
      const bookingDate = new Date(`${year}-${month}-${day}T${time24}`);

      if (booking.status === 'upcoming' && bookingDate < now) {
        return { ...booking, status: 'completed' };
      }
      return booking;
    });

    const hasChanged = updatedBookings.some(
      (b, i) => b.status !== bookings[i].status,
    );

    if (hasChanged) {
      setBookings(updatedBookings);
      AsyncStorage.setItem('bookings', JSON.stringify(updatedBookings));
    }
  }, [bookings]);

  const renderBooking = (booking) => (
    <View key={booking.id} className="mx-4 my-2 p-4">
      <View className="flex-row items-start">
        <Image
          source={{ uri: booking.cook.image }}
          className="h-24 w-24 rounded-full"
        />
        <View className="ml-4 flex-1">
          <View className="flex-row items-start justify-between">
            <View className="flex-col">
              <Text className="text-lg font-semibold text-gray-800">
                Chef {booking.cook.name}
              </Text>
              <Text className="text-base font-semibold text-gray-700">
                ({booking.cook.rating})
              </Text>
              <Text className="text-base text-amber-600">
                {booking.date} • {booking.time}
              </Text>
              <Text className="text-base text-amber-600">
                {booking.pricing}
              </Text>
              <View className="flex-row items-center">
                <Text className="text-base text-amber-600">
                  {booking.cook.cuisine} •
                </Text>
                <Text className="text-base text-amber-600 ml-1">
                  {booking.guestCount} guests
                </Text>
              </View>
            </View>
            {booking.status === 'upcoming' && (
              <TouchableOpacity
                className="bg-gray-300 rounded-full px-6 py-2 mt-2"
                onPress={() => handleModifyBooking(booking)}
              >
                <Text className="text-black text-base font-medium">Modify</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
      {booking.status === 'upcoming' && (
        <View className="flex-row justify-between items-center mt-4">
          <Text className="text-xl text-gray-800">Cancel Booking</Text>
          <TouchableOpacity
            className="bg-gray-300 rounded-full px-6 py-2"
            onPress={() => handleCancelBooking(booking.id)}
          >
            <Text className="text-black text-base font-medium">Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );

  return (
    <SafeAreaView className="flex-1 ">
      <StatusBar barStyle="light-content" backgroundColor="#000000" />
      <Navbar title="Bookings" />
      <ScrollView showsVerticalScrollIndicator={false}>
        {bookings.length === 0 ? (
          <View className="flex-1 justify-center items-center py-10">
            <FontAwesome5 name="sad-tear" size={64} color="gray" />
            <Text className="text-lg text-gray-600 mt-4">
              No bookings found
            </Text>
            <Text className="text-base text-gray-500 mt-1">
              Start by booking your favorite chef!
            </Text>
          </View>
        ) : (
          ['upcoming', 'past'].map((section) => {
            const filteredBookings =
              section === 'upcoming'
                ? bookings.filter((b) => b.status === 'upcoming')
                : bookings.filter(
                    (b) => b.status === 'completed' || b.status === 'canceled',
                  );

            return filteredBookings.length > 0 ? (
              <View key={section} className="mb-6 mt-6 ml-1">
                <Text className="text-2xl font-semibold text-gray-800 ml-4">
                  {section === 'past' ? 'Past' : 'Upcoming'}
                </Text>
                {filteredBookings.map(renderBooking)}
              </View>
            ) : null;
          })
        )}
      </ScrollView>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={handleConfirmDate}
        onCancel={() => setDatePickerVisibility(false)}
        minimumDate={new Date(new Date().setDate(new Date().getDate() + 1))}
      />
      <DateTimePickerModal
        isVisible={isTimePickerVisible}
        mode="time"
        onConfirm={handleConfirmTime}
        onCancel={() => setTimePickerVisibility(false)}
      />
    </SafeAreaView>
  );
};

export default MyBookingsScreen;
