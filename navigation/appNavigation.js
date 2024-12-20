import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "../screens/HomeScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import SignInScreen from "../screens/SignInScreen";
import SignUpScreen from "../screens/SignUpScreen";
import CookProfileScreen from "../screens/CookProfileScreen";
import ProfileScreen from "../components/ProfileScreen";
import BookingPage from "../screens/BookingPageScreen";
import useAuth from "../hooks/useAuth";
import MyBookingsScreen from "../screens/MyBookingsScreen";
import HowItWorksScreen from "../screens/HowItWorksScreen";
import ViewAllScreen from "../screens/ViewAllScreen";
import EditProfileScreen from "../components/EditProfileScreen";
import FAQScreen from "../components/FAQScreen";
import CheckoutPageScreen from "../screens/CheckoutPageScreen";

const Stack = createNativeStackNavigator();

export default function AppNavigation() {
  const { user } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={user ? "Home" : "Welcome"}>
        {user ? (
          <>
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            {/* <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            /> */}
            <Stack.Screen
              name="CookProfile"
              component={CookProfileScreen}
              options={{ title: "Cook Profile" }}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="BookingPage"
              component={BookingPage}
              options={{ title: "Book a Cook" }}
            />
            <Stack.Screen
              name="MyBookings" // Add MyBookings screen here
              component={MyBookingsScreen}
              options={{ title: "My Bookings" }}
            />
            <Stack.Screen
              name="HowItWorks"
              component={HowItWorksScreen}
              options={{ title: "How It Works" }}
            />
            <Stack.Screen name="ViewAllScreen" component={ViewAllScreen} />
            <Stack.Screen
              name="EditProfileScreen"
              component={EditProfileScreen}
            />
            <Stack.Screen
              name="FAQScreen"
              component={FAQScreen}
              options={{ title: "FAQs" }}
            />
            <Stack.Screen
              name="CheckoutPageScreen"
              component={CheckoutPageScreen}
              options={{ title: "Checkout" }}
            />
          </>
        ) : (
          <>
            <Stack.Screen
              name="Welcome"
              component={WelcomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignIn"
              component={SignInScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="SignUp"
              component={SignUpScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="Home"
              component={HomeScreen}
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name="CookProfile"
              component={CookProfileScreen}
              options={{ title: "Cook Profile" }}
            />
            <Stack.Screen name="Profile" component={ProfileScreen} />
            <Stack.Screen
              name="BookingPage"
              component={BookingPage}
              options={{ title: "Book a Cook" }}
            />
            <Stack.Screen
              name="MyBookings" // Add MyBookings screen here
              component={MyBookingsScreen}
              options={{ title: "My Bookings" }}
            />
            <Stack.Screen
              name="HowItWorks"
              component={HowItWorksScreen}
              options={{ title: "How It Works" }}
            />
            <Stack.Screen
              name="ViewAllScreen"
              component={ViewAllScreen}
              options={{ title: "Menu" }}
            />
            <Stack.Screen
              name="EditProfileScreen"
              component={EditProfileScreen}
            />
            <Stack.Screen
              name="FAQScreen"
              component={FAQScreen}
              options={{ title: "FAQs" }}
            />
            <Stack.Screen
              name="CheckoutPageScreen"
              component={CheckoutPageScreen}
              options={{ title: "Checkout" }}
            />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
