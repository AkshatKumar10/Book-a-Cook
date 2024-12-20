import {
  View,
  Text,
  TouchableOpacity,
  Image,
  TextInput,
  Alert,
} from "react-native";

import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from "../config/firebase";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignUpScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");

  const handleSubmit = async () => {
    console.log("Full Name:", fullName); // Debugging line
    console.log("Email:", email); // Debugging line
    if (!fullName || !email || !password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;
      await updateProfile(user, {
        displayName: fullName, // Make sure to replace fullName with the actual name variable
      });
      console.log(user.updateProfile);
      console.log("User  registered with display name:", user.displayName);
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Alert.alert(
          "Error",
          "This email is already in use. Please try a different one."
        );
      } else {
        Alert.alert("Error", error.message);
      }
    }
  };
  return (
    <View className="flex-1 bg-brown-100">
      <SafeAreaView className="flex">
        <View className="flex-row justify-start">
          <TouchableOpacity
            onPress={() => navigation.goBack()}
            className="ml-6 mt-7"
          >
            <ArrowLeftIcon size="20" color="black" />
          </TouchableOpacity>
        </View>
        <View className="ml-20 mt-5 h-53">
          <Text className="text-5xl mb-3 font-bold text-yellow-600 ">
            Create your
          </Text>
          <Text className="text-5xl font-bold text-yellow-600 mb-20">
            Account
          </Text>
        </View>
      </SafeAreaView>
      <KeyboardAwareScrollView
        className="flex-1 bg-white"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <View className="flex-1  px-8 pt-8">
          <View className="form space-y-2 ">
            <Text className="text-gray-700 ml-4 text-xl mb-3 ">Full Name</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
              placeholder="Enter Name "
              value={fullName}
              onChangeText={(text) => setFullName(text)}
            />
            <Text className="text-gray-700 ml-4 text-xl mb-3">
              Email Address
            </Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
              placeholder="Enter Email "
              value={email}
              onChangeText={(text) => setEmail(text)}
            />
            <Text className="text-gray-700 ml-4 text-xl mb-3">Password</Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl"
              placeholder="Enter password"
              value={password}
              secureTextEntry
              onChangeText={(text) => setPassword(text)}
            />

            <TouchableOpacity
              className="rounded-full py-3 bg-amber-700 mt-20"
              onPress={handleSubmit}
            >
              <Text className="text-gray-900 font-xl font-bold text-center text-2xl">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>

          <View className="flex-row justify-center mt-4">
            <Text className="text-slate-950 font-semibold">
              Already have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignIn")}>
              <Text className="text-yellow-600 font-semibold mb-10">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
