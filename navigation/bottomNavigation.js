import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BookNowScreen from '../screens/BookingPageScreen';
import BookingsScreen from '../screens/MyBookingsScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import useCooksData from '../hooks/useCooksData';
import { useContext } from 'react';
import { ThemeContext } from '../context/ThemeContext';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  const { allCooksPricing } = useCooksData();
  const { theme } = useContext(ThemeContext);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    tabBarBg: theme === 'dark' ? 'bg-gray-800' : 'bg-white',
    activeTintColor: theme === 'dark' ? '#f06292' : '#e91e63',
    inactiveTintColor: theme === 'dark' ? 'gray-400' : 'gray',
  };

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
            try {
              const defaultCuisine =
                allCooksPricing && Object.keys(allCooksPricing).length > 0
                  ? Object.keys(allCooksPricing)[0]
                  : 'North Indian';
              navigation.navigate('BookingPageScreen', {
                pricing: allCooksPricing || {},
                cuisine: defaultCuisine,
                isDiscounted: false,
              });
            } catch (error) {
              console.error('Navigation error:', error);
            }
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
