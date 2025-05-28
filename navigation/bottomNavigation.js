import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BookNowScreen from '../screens/BookingPageScreen';
import BookingsScreen from '../screens/MyBookingsScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import useCooksData from '../hooks/useCooksData';
import { ActivityIndicator, View } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  const { allCooksPricing, loading } = useCooksData();
  const { theme } = useContext(ThemeContext);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    tabBarBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    activeTintColor: theme === 'dark' ? '#f06292' : '#e91e63',
    inactiveTintColor: theme === 'dark' ? 'gray-400' : 'gray',
    loadingColor: theme === 'dark' ? '#60a5fa' : '#38bdf8',
  };

  if (loading) {
    return (
      <View
        className={`flex-1 justify-center items-center ${themeStyles.container}`}
      >
        <ActivityIndicator size="large" color={themeStyles.loadingColor} />
      </View>
    );
  }

  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconName;
          if (route.name === 'Home') iconName = 'home';
          else if (route.name === 'BookNow') iconName = 'calendar-check-o';
          else if (route.name === 'Bookings') iconName = 'list-alt';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: themeStyles.activeTintColor,
        tabBarInactiveTintColor: themeStyles.inactiveTintColor,
        headerShown: false,
        tabBarStyle: {
          height: 60,
        },
        tabBarPressColor: 'transparent',
      })}
      screenListeners={({ navigation }) => ({
        tabPress: (e) => {
          if (e.target.includes('BookNow')) {
            e.preventDefault();
            navigation.navigate('BookNow', { pricing: allCooksPricing });
          }
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="BookNow" component={BookNowScreen} />
      <Tab.Screen name="Bookings" component={BookingsScreen} />
    </Tab.Navigator>
  );
}
