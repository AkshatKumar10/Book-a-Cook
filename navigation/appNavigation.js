import { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import CookProfileScreen from '../screens/CookProfileScreen';
import ProfileScreen from '../screens/ProfileScreen';
import BookingPage from '../screens/BookingPageScreen';
import MyBookingsScreen from '../screens/MyBookingsScreen';
import HowItWorksScreen from '../screens/HowItWorksScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import FAQScreen from '../screens/FAQScreen';
import BottomNavigation from './bottomNavigation';
import CuisineDetails from '../screens/CuisineDetails';
import CheckoutPageScreen from '../screens/CheckoutPageScreen';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';
import { ActivityIndicator, View } from 'react-native';

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const [initialRoute, setInitialRoute] = useState('Welcome');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setInitialRoute('HomeTabs');
      } else {
        setInitialRoute('Welcome');
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-black">
        <ActivityIndicator size="large" color="#38bdf8" />
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
          name="SignIn"
          component={SignInScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="HomeTabs"
          component={BottomNavigation}
          options={{ headerShown: false }}
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
          name="BookingPage"
          component={BookingPage}
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
      </Stack.Navigator>
    </NavigationContainer>
  );
}
