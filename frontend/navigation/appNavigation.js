import { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import CookProfileScreen from '../screens/CookProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import BottomNavigation from './bottomNavigation';
import CheckoutPageScreen from '../screens/CheckoutPageScreen';
import { ActivityIndicator, View } from 'react-native';
import { ThemeContext } from '../context/ThemeContext';
import BookingPageScreen from '../screens/BookingPageScreen';
import BookmarkScreen from '../screens/BookmarkScreen';
import UserSignInScreen from '../screens/UserSignInScreen';
import UserSignUpScreen from '../screens/UserSignUpScreen';
import CookSignInScreen from '../screens/CookSignInScreen';
import CookSignUpScreen from '../screens/CookSignUpScreen';
import {
  getUserToken,
  getCookToken,
  updateCookFcmToken,
  updateUserFcmToken,
} from '../utils/api.js';
import CookDashboardScreen from '../screens/CookDashboardScreen.js';
import CuisineChefsScreen from '../screens/CuisineChefsScreen.js';
import { getFcmToken } from '../utils/fcmUtils.js';
import CookBookingsScreen from '../screens/CookBookingsScreen.js';
import CookListScreen from '../screens/CookListScreen.js';
import EarningScreen from '../screens/EarningScreen.js';
import EditCookProfileScreen from '../screens/EditCookProfileScreen.js';
import PaymentPageScreen from '../screens/PaymentPageScreen.js';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [initialRoute, setInitialRoute] = useState('Welcome');
  const [loading, setLoading] = useState(true);
  const { theme } = useContext(ThemeContext);

  const themeStyles = {
    container: theme === 'dark' ? 'bg-black' : 'bg-gray-100',
    loadingColor: theme === 'dark' ? '#60a5fa' : '#38bdf8',
  };

  useEffect(() => {
    const checkAuth = async () => {
      const userToken = await getUserToken();
      const cookToken = await getCookToken();
      if (userToken) {
        setInitialRoute('HomeTabs');
        const token = await getFcmToken();
        if (token) {
          await updateUserFcmToken({ fcmToken: token });
        }
      } else if (cookToken) {
        setInitialRoute('CookDashboard');
        const token = await getFcmToken();
        console.log('Token', token);
        if (token) {
          await updateCookFcmToken({ fcmToken: token });
        }
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
          name="Earning"
          component={EarningScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="EditCookProfile"
          component={EditCookProfileScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CookList"
          component={CookListScreen}
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
          name="CookProfile"
          component={CookProfileScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="CookBookings"
          component={CookBookingsScreen}
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
          name="PaymentScreen"
          component={PaymentPageScreen}
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
