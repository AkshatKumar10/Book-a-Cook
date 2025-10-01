import { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import CookProfileScreen from '../screens/CookProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import FAQScreen from '../screens/FAQScreen';
import BottomNavigation from './bottomNavigation';
import CuisineDetails from '../screens/CuisineDetails';
import CheckoutPageScreen from '../screens/CheckoutPageScreen';
import { ActivityIndicator, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import BookingPageScreen from '../screens/BookingPageScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import UserSignInScreen from '../screens/UserSignInScreen';
import UserSignUpScreen from '../screens/UserSignUpScreen';
import CookSignInScreen from '../screens/CookSignInScreen';
import CookSignUpScreen from '../screens/CookSignUpScreen';
import { getUserToken, getCookToken } from '../utils/api.js';
import CookDashboardScreen from '../screens/CookDashboardScreen.js';
import CuisineChefsScreen from '../screens/CuisineChefsScreen.js';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [initialRoute, setInitialRoute] = useState('Welcome');
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-white',
    loadingColor: theme === 'dark' ? '#60a5fa' : '#38bdf8',
  };

  useEffect(() => {
    const checkAuth = async () => {
      const userToken = await getUserToken();
      const cookToken = await getCookToken();
      if (userToken) {
        setInitialRoute('HomeTabs');
      } else if (cookToken) {
        setInitialRoute('CookDashboard');
      } else {
        setInitialRoute('Welcome');
      }
      setLoading(false);
    };
    checkAuth();
  }, []);

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
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserSignIn"
          component={UserSignInScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="UserSignUp"
          component={UserSignUpScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CookSignIn"
          component={CookSignInScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CuisineChefs"
          component={CuisineChefsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CookSignUp"
          component={CookSignUpScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CookDashboard"
          component={CookDashboardScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HomeTabs"
          component={BottomNavigation}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Profile"
          component={ProfileScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditProfileScreen"
          component={EditProfileScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FAQScreen"
          component={FAQScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HowItWorks"
          component={HowItWorksScreen}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="CookProfile"
          component={CookProfileScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CuisineDetails"
          component={CuisineDetails}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="BookingPageScreen"
          component={BookingPageScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="MyBookings"
          component={MyBookingsScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CheckoutPageScreen"
          component={CheckoutPageScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Bookmark"
          component={BookmarkScreen}
          options={{
            headerShown: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
