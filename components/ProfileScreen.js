import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { FontAwesome5, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { Linking } from "react-native";
import { auth } from "../config/firebase"; // Ensure you have your firebase configuration

const ProfileScreen = ({ navigation }) => {
  const [user, setUser] = useState(null); // Assume this state holds the user data

  // Example function to handle user sign-out
  const handleSignOut = () => {
    auth
      .signOut()
      .then(() => {
        // Update the user state to null after signing out
        setUser(null); // This makes the "Welcome" screen available
        navigation.navigate("Welcome"); // Navigate to Welcome screen
      })
      .catch((error) => {
        console.error("Sign out error:", error);
      });
  };

  useEffect(() => {
    // Logic to check if the user is logged in and set the user state
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      console.log("Current user:", currentUser);
      setUser(currentUser);
    });

    return () => unsubscribe(); // Clean up the subscription
  }, []);

  return (
    <View className="flex-1 bg-white">
      {/* Header Section */}
      <View className="items-center py-6 bg-white">
        <View className="flex-row justify-between mb-5">
          <Image
            source={require("../assets/images/profile.png")}
            className="w-28 h-28 ml-5 "
          />
        </View>
        {/* Display user information */}
        {user && (
          <>
            <Text className="text-xl font-semibold">{user.displayName}</Text>
            <Text className="text-gray-500 text-center">{user.email}</Text>
          </>
        )}
      </View>
      <ScrollView className="bg-white">
        {/* Other profile options */}
        {/* <TouchableOpacity
          onPress={() =>
            navigation.navigate("EditProfile", {
              // fullName: user?.displayName,
              email: user?.email,
            })
          }
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="w-8 h-8 items-center justify-center bg-gray-200 rounded-full mr-4">
            <Ionicons name="person" size={18} color="black" />
          </View>
          <Text className="flex-1 text-base text-gray-700">
            Edit Profile Info
          </Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity> */}
        <TouchableOpacity
          onPress={() => navigation.navigate("MyBookings")}
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="w-8 h-8 items-center justify-center bg-gray-200 rounded-full mr-4">
            <FontAwesome5 name="calendar-alt" size={18} color="black" />
          </View>
          <Text className="flex-1 text-base text-gray-700">My Bookings</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => Linking.openURL("mailto:bookachef@gmail.com")}
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="w-8 h-8 items-center justify-center bg-gray-200 rounded-full mr-4">
            <FontAwesome5 name="phone" size={18} color="black" />
          </View>
          <Text className="flex-1 text-base text-gray-700">Contact Us</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("HowItWorks")}
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="w-8 h-8 items-center justify-center bg-gray-200 rounded-full mr-4">
            <Ionicons name="help-circle" size={18} color="black" />
          </View>
          <Text className="flex-1 text-base text-gray-700">How It Works</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("FAQScreen")}
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="w-8 h-8 items-center justify-center bg-gray-200 rounded-full mr-4">
            <Ionicons name="question-circle" size={18} color="black" />
          </View>
          <Text className="flex-1 text-base text-gray-700">FAQ</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
        {/* Sign Out Button */}
        <TouchableOpacity
          onPress={handleSignOut} // Call sign-out function
          className="flex-row items-center p-4 border-b border-gray-200"
        >
          <View className="w-8 h-8 items-center justify-center bg-gray-200 rounded-full mr-4">
            <MaterialIcons name="logout" size={18} color="black" />
          </View>
          <Text className="flex-1 text-base text-gray-700">Sign Out</Text>
          <Ionicons name="chevron-forward" size={20} color="gray" />
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default ProfileScreen;
