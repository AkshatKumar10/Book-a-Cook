import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import BookNowScreen from '../screens/BookingPageScreen';
import BookingsScreen from '../screens/MyBookingsScreen';
import Icon from 'react-native-vector-icons/FontAwesome';
import useCooksData from '../hooks/useCooksData';
import { ActivityIndicator, View } from 'react-native';

const Tab = createBottomTabNavigator();

export default function BottomNavigation() {
  const { allCooksPricing, loading } = useCooksData();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#38bdf8" />
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
        tabBarActiveTintColor: '#e91e63',
        tabBarInactiveTintColor: 'gray',
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
