import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useNavigation } from '@react-navigation/native';
import Feather from '@expo/vector-icons/Feather';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import Navbar from '../components/Navbar';
import { ThemeContext } from '../context/ThemeContext';
import useCookProfile from '../hooks/useCookProfile';
import { updateCookAvailability } from '../utils/api';
import SnackbarComponent from '../components/SnackbarComponent';

const DAYS_OF_WEEK = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
];

const DEFAULT_SCHEDULE = DAYS_OF_WEEK.map((day) => ({
  day,
  isAvailable: true,
  startTime: '09:00 AM',
  endTime: '09:00 PM',
}));

export default function CookAvailabilityScreen() {
  const navigation = useNavigation();
  const { theme } = useContext(ThemeContext);
  const { data: cookData, dataLoading, refresh } = useCookProfile();

  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE);
  const [saving, setSaving] = useState(false);
  const [snackbarVisible, setSnackbarVisible] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarType, setSnackbarType] = useState('success');

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    cardBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    textPrimary: theme === 'dark' ? 'text-white' : 'text-gray-900',
    textSecondary: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
    badgeAvailable: theme === 'dark' ? 'bg-green-900/60' : 'bg-green-100',
    badgeAvailableText: theme === 'dark' ? 'text-green-300' : 'text-green-700',
    badgeUnavailable: theme === 'dark' ? 'bg-red-900/60' : 'bg-red-100',
    badgeUnavailableText: theme === 'dark' ? 'text-red-300' : 'text-red-700',
  };

  useEffect(() => {
    if (cookData?.availability && cookData.availability.length > 0) {
      // Merge with default days to make sure all 7 days exist
      const merged = DAYS_OF_WEEK.map((day) => {
        const found = cookData.availability.find(
          (item) => item.day.toLowerCase() === day.toLowerCase()
        );
        return (
          found || {
            day,
            isAvailable: true,
            startTime: '09:00 AM',
            endTime: '09:00 PM',
          }
        );
      });
      setSchedule(merged);
    }
  }, [cookData]);

  const toggleDayAvailability = (index) => {
    const updated = [...schedule];
    updated[index].isAvailable = !updated[index].isAvailable;
    setSchedule(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateCookAvailability(schedule);
      await refresh();
      setSnackbarMessage('Weekly availability saved successfully!');
      setSnackbarType('success');
      setSnackbarVisible(true);
    } catch (error) {
      setSnackbarMessage(
        error?.response?.data?.message || 'Failed to update availability'
      );
      setSnackbarType('error');
      setSnackbarVisible(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <SafeAreaView className={`flex-1 ${themeStyles.container}`}>
      <StatusBar style={theme === 'dark' ? 'light' : 'dark'} />
      <Navbar
        title="Manage Availability"
        onBackPress={() => navigation.goBack()}
      />

      {dataLoading ? (
        <View className="flex-1 justify-center items-center">
          <ActivityIndicator size="large" color="#f97316" />
        </View>
      ) : (
        <ScrollView
          className="flex-1 px-4 py-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
        >
          <View className="mb-4">
            <Text className={`text-xl font-bold ${themeStyles.textPrimary}`}>
              Weekly Working Days
            </Text>
            <Text className={`text-sm mt-1 ${themeStyles.textSecondary}`}>
              Turn ON the days you are open for bookings. Users will only be
              able to book you on your active days.
            </Text>
          </View>

          {schedule.map((item, index) => (
            <View
              key={item.day}
              className={`${themeStyles.cardBg} rounded-2xl p-4 mb-3 flex-row items-center justify-between shadow-sm`}
              style={{ borderWidth: 1, borderColor: themeStyles.borderColor }}
            >
              <View className="flex-row items-center flex-1">
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${
                    item.isAvailable
                      ? 'bg-orange-500/20'
                      : theme === 'dark'
                      ? 'bg-gray-700'
                      : 'bg-gray-200'
                  }`}
                >
                  <MaterialIcons
                    name={item.isAvailable ? 'check-circle' : 'do-not-disturb'}
                    size={22}
                    color={item.isAvailable ? '#f97316' : '#9ca3af'}
                  />
                </View>

                <View className="flex-1">
                  <View className="flex-row items-center gap-2">
                    <Text
                      className={`text-base font-bold ${themeStyles.textPrimary}`}
                    >
                      {item.day}
                    </Text>
                    <View
                      className={`px-2 py-0.5 rounded-full ${
                        item.isAvailable
                          ? themeStyles.badgeAvailable
                          : themeStyles.badgeUnavailable
                      }`}
                    >
                      <Text
                        className={`text-xs font-semibold ${
                          item.isAvailable
                            ? themeStyles.badgeAvailableText
                            : themeStyles.badgeUnavailableText
                        }`}
                      >
                        {item.isAvailable ? 'Available' : 'Day Off'}
                      </Text>
                    </View>
                  </View>
                  <Text className={`text-xs mt-1 ${themeStyles.textSecondary}`}>
                    {item.isAvailable
                      ? `Working Hours: ${item.startTime || '09:00 AM'} - ${item.endTime || '09:00 PM'}`
                      : 'Not accepting bookings'}
                  </Text>
                </View>
              </View>

              <Switch
                value={item.isAvailable}
                onValueChange={() => toggleDayAvailability(index)}
                trackColor={{ false: '#9ca3af', true: '#f97316' }}
                thumbColor={item.isAvailable ? '#fff' : '#f3f4f6'}
              />
            </View>
          ))}

          <TouchableOpacity
            onPress={handleSave}
            disabled={saving}
            className="bg-orange-500 rounded-xl py-4 items-center justify-center mt-4 shadow-md"
          >
            {saving ? (
              <ActivityIndicator color="white" />
            ) : (
              <Text className="text-white font-bold text-lg">
                Save Availability
              </Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      )}

      <SnackbarComponent
        visible={snackbarVisible}
        message={snackbarMessage}
        type={snackbarType}
        onDismiss={() => setSnackbarVisible(false)}
      />
    </SafeAreaView>
  );
}
