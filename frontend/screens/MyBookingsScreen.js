import { useState, useCallback, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  BackHandler,
  FlatList,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import Navbar from '../components/Navbar';
import Ionicons from '@expo/vector-icons/Ionicons';
import { ThemeContext } from '../context/ThemeContext';
import { StatusBar } from 'expo-status-bar';
import useBookings from '../hooks/useBookings';
import { Skeleton } from 'moti/skeleton';

const MyBookingsScreen = () => {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { bookings, bookingLoading } = useBookings();
  const [activeTab, setActiveTab] = useState('upcoming');

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-800',
    textTertiary: theme === 'dark' ? 'text-gray-400' : 'text-gray-600',
    textNoBookings: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    iconColor: theme === 'dark' ? '#9CA3AF' : '#6B7280',
    textAccent: theme === 'dark' ? 'text-amber-500' : 'text-amber-600',
    tabActive: 'bg-orange-500',
    tabInactive: theme === 'dark' ? 'bg-gray-800' : 'bg-orange-100',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    cardBorder: theme === 'dark' ? 'border-gray-700' : 'border-gray-200',
    statusPending: theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600',
    statusConfirmed: theme === 'dark' ? 'text-green-400' : 'text-green-600',
    statusCompleted: theme === 'dark' ? 'text-blue-400' : 'text-blue-600',
    statusDeclined: theme === 'dark' ? 'text-red-400' : 'text-red-600', 
    statusPendingBg: theme === 'dark' ? 'bg-yellow-900/30' : 'bg-yellow-100',
    statusConfirmedBg: theme === 'dark' ? 'bg-green-900/30' : 'bg-green-100',
    statusCompletedBg: theme === 'dark' ? 'bg-blue-900/30' : 'bg-blue-100',
    statusDeclinedBg: theme === 'dark' ? 'bg-red-900/30' : 'bg-red-100',
  };

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        navigation.goBack();
        return true;
      };
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        onBackPress,
      );
      return () => backHandler.remove();
    }, [navigation]),
  );

  const formatDate = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return new Date(`${year}-${month}-${day}`).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusText = (booking) => {
    switch (booking.status) {
      case 'pending':
        return 'Pending';
      case 'accepted':
        return 'Confirmed';
      case 'declined':
        return 'Declined';
      case 'completed':
        return 'Completed';
      default:
        return booking.status;
    }
  };

  const getStatusStyles = (booking) => {
    switch (booking.status) {
      case 'pending':
        return {
          text: themeStyles.statusPending,
          bg: themeStyles.statusPendingBg,
        };
      case 'accepted':
        return {
          text: themeStyles.statusConfirmed,
          bg: themeStyles.statusConfirmedBg,
        };
      case 'declined':
        return {
          text: themeStyles.statusDeclined,
          bg: themeStyles.statusDeclinedBg,
        };
      case 'completed':
        return {
          text: themeStyles.statusCompleted,
          bg: themeStyles.statusCompletedBg,
        };
      default:
        return { text: themeStyles.textTertiary, bg: 'transparent' };
    }
  };

  const renderBooking = ({ item: booking }) => {
    const statusStyles = getStatusStyles(booking);
    return (
      <View
        className={`mx-4 my-2 p-4 rounded-2xl ${themeStyles.cardBg} border ${themeStyles.cardBorder}`}
      >
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center flex-1">
            <Image
              source={{ uri: booking.cookId.profileImage }}
              className="h-16 w-16 rounded-full"
            />
            <View className="ml-3 flex-1">
              <Text className={`text-lg font-bold ${themeStyles.textPrimary}`}>
                Chef {booking.cookId.username}
              </Text>
              <View className="self-start">
                <Text
                  className={`text-sm font-semibold ${statusStyles.text} ${statusStyles.bg} px-2 py-1 rounded-full`}
                >
                  {getStatusText(booking)}
                </Text>
              </View>
            </View>
          </View>
          <Text className={`text-xl font-bold ${themeStyles.textAccent}`}>
            ₹{booking.totalAmount}
          </Text>
        </View>
        <View className="border-b border-gray-300 mb-3" />
        <View className="flex-row">
          <View className="w-1/2 space-y-2">
            {[
              { icon: 'utensils', text: booking.mealType },
              { icon: 'calendar', text: formatDate(booking.selectedDate) },
            ].map((item, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <View style={{ width: 20, alignItems: 'center' }}>
                  <FontAwesome5
                    name={item.icon}
                    size={16}
                    color={themeStyles.iconColor}
                    solid
                  />
                </View>
                <Text className={`ml-2 text-base ${themeStyles.textTertiary}`}>
                  {item.text}
                </Text>
              </View>
            ))}
            <View className="flex-row items-center mb-2">
              <View style={{ width: 20, alignItems: 'center' }}>
                <Ionicons
                  name="restaurant"
                  size={16}
                  color={themeStyles.iconColor}
                />
              </View>
              <Text className={`ml-2 text-base ${themeStyles.textTertiary}`}>
                {booking.selectedCuisine} Cuisine
              </Text>
            </View>
          </View>
          <View className="w-1/2 space-y-2">
            {[
              { icon: 'users', text: `${booking.guestCount} Guests` },
              { icon: 'clock', text: booking.selectedTime },
            ].map((item, index) => (
              <View key={index} className="flex-row items-center mb-2">
                <View style={{ width: 20, alignItems: 'center' }}>
                  <FontAwesome5
                    name={item.icon}
                    size={16}
                    color={themeStyles.iconColor}
                    solid
                  />
                </View>
                <Text className={`ml-2 text-base ${themeStyles.textTertiary}`}>
                  {item.text}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </View>
    );
  };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingBookings = bookings.filter(
    (b) =>
      ['pending', 'accepted'].includes(b.status) &&
      new Date(b.selectedDate.split('/').reverse().join('-')) >= today,
  );

  const pastBookings = bookings.filter((b) =>
    ['declined', 'completed'].includes(b.status),
  );

  const renderEmptyComponent = (emptyMessage) => (
    <View className="flex-1 justify-center items-center py-10">
      <FontAwesome5 name="sad-tear" size={64} color={themeStyles.iconColor} />
      <Text className={`text-lg ${themeStyles.textTertiary} mt-4`}>
        {emptyMessage.title}
      </Text>
      <Text className={`text-base ${themeStyles.textNoBookings} mt-1`}>
        {emptyMessage.subtitle}
      </Text>
    </View>
  );

  if (bookingLoading) {
    return (
      <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
        <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
        <Navbar title="My Bookings" />
        <ScrollView className="mx-4 my-2" showsVerticalScrollIndicator={false}>
          {[...Array(4)].map((_, index) => (
            <View
              key={index}
              className={`p-4 rounded-2xl border ${themeStyles.cardBorder} mb-4`}
            >
              <View className="flex-row items-center justify-between mb-3">
                <View className="flex-row items-center flex-1">
                  <Skeleton
                    colorMode={theme}
                    width={64}
                    height={64}
                    radius="round"
                  />
                  <View className="ml-3 flex-1">
                    <Skeleton colorMode={theme} width="60%" height={20} />
                    <View className="self-start mt-2">
                      <Skeleton
                        colorMode={theme}
                        width={80}
                        height={24}
                        radius={12}
                      />
                    </View>
                  </View>
                </View>
                <Skeleton colorMode={theme} width={50} height={24} />
              </View>
              <Skeleton colorMode={theme} width="100%" height={1} />
              <View className="flex-row mt-3">
                <View className="w-1/2 space-y-2">
                  {[...Array(3)].map((_, i) => (
                    <View key={i} className="flex-row items-center mb-2 gap-2">
                      <Skeleton
                        colorMode={theme}
                        width={20}
                        height={20}
                        radius="round"
                      />
                      <Skeleton
                        colorMode={theme}
                        width="70%"
                        height={16}
                        style={{ marginLeft: 8 }}
                      />
                    </View>
                  ))}
                </View>
                <View className="w-1/2 space-y-2">
                  {[...Array(2)].map((_, i) => (
                    <View key={i} className="flex-row items-center mb-2 gap-2">
                      <Skeleton
                        colorMode={theme}
                        width={20}
                        height={20}
                        radius="round"
                      />
                      <Skeleton
                        colorMode={theme}
                        width="60%"
                        height={16}
                        style={{ marginLeft: 8 }}
                      />
                    </View>
                  ))}
                </View>
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
      <Navbar title="My Bookings" />
      <View
        className={`flex-row mx-4 mb-4 mt-2 p-1 rounded-full ${themeStyles.tabInactive}`}
      >
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === 'upcoming' ? `${themeStyles.tabActive} rounded-full` : ''}`}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            className={`text-center text-base font-semibold ${activeTab === 'upcoming' ? 'text-white' : themeStyles.textAccent}`}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-3 ${activeTab === 'past' ? `${themeStyles.tabActive} rounded-full` : ''}`}
          onPress={() => setActiveTab('past')}
        >
          <Text
            className={`text-center text-base font-semibold ${activeTab === 'past' ? 'text-white' : themeStyles.textAccent}`}
          >
            Past
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={upcomingBookings}
        keyExtractor={(item) => item._id}
        renderItem={renderBooking}
        contentContainerStyle={{
          paddingBottom: 24,
          display: activeTab === 'upcoming' ? 'flex' : 'none',
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent({
          title: 'No upcoming bookings found',
          subtitle: 'Start by booking your favorite chef!',
        })}
      />
      <FlatList
        data={pastBookings}
        keyExtractor={(item) => item._id}
        renderItem={renderBooking}
        contentContainerStyle={{
          paddingBottom: 24,
          display: activeTab === 'past' ? 'flex' : 'none',
        }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyComponent({
          title: 'No past bookings found',
          subtitle: 'No past bookings available.',
        })}
      />
    </SafeAreaView>
  );
};

export default MyBookingsScreen;
