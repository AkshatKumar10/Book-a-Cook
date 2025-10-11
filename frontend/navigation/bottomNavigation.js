import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BookNowScreen from '../screens/BookingPageScreen';
import BookingsScreen from '../screens/MyBookingsScreen';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Feather from 'react-native-vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';
import CookListScreen from '../screens/CookListScreen';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  const { theme } = useContext(ThemeContext);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    tabBarBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    activeTintColor: theme === 'dark' ? '#f06292' : '#e91e63',
    inactiveTintColor: theme === 'dark' ? 'gray-400' : 'gray',
  };

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          if (route.name === 'Home') {
            return <Feather name="home" size={size} color={color} />;
          } else if (route.name === 'BookNow') {
            return (
              <FontAwesome name="calendar-check-o" size={size} color={color} />
            );
          } else if (route.name === 'Bookings') {
            return <FontAwesome name="list-alt" size={size} color={color} />;
          } else if (route.name === 'Chefs') {
            return (
              <MaterialCommunityIcons
                name="chef-hat"
                size={size}
                color={color}
              />
            );
          }
        },
        tabBarActiveTintColor: themeStyles.activeTintColor,
        tabBarInactiveTintColor: themeStyles.inactiveTintColor,
        headerShown: false,
        tabBarStyle: {
          height: 60,
        },
        tabBarPressColor: 'transparent',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Chefs" component={CookListScreen} />
      <Tab.Screen name="BookNow" component={BookNowScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
    </Tab.Navigator>
  );
}
