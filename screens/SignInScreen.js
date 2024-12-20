import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Alert,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";
import { ArrowLeftIcon } from "react-native-heroicons/solid";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
  updateProfile,
} from "firebase/auth";
import { auth } from "../config/firebase";

export default function LoginScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [isResetMode, setIsResetMode] = useState(false);
  const handleSubmit = async () => {
    if (email && password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        // Check if displayName is available
        if (user.displayName) {
          Alert.alert("Success", `Welcome back, ${user.displayName}!`);
        } else {
          Alert.alert("Success", "Welcome back, User!");
        }
      } catch (error) {
        if (error.message.includes("wrong-password")) {
          Alert.alert("Error", "The password you entered is incorrect.");
        } else {
          Alert.alert("Error", error.message);
        }
      }
    } else {
      Alert.alert("Error", "Please enter your email and password.");
    }
  };
  const handleForgotPassword = async () => {
    if (resetEmail) {
      try {
        await sendPasswordResetEmail(auth, resetEmail);
        Alert.alert("Success", "Password reset email sent!");
        setIsResetMode(false);
      } catch (error) {
        Alert.alert("Error", "Unable to send password reset email.");
      }
    } else {
      Alert.alert("Error", "Please enter your email address.");
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
            Hello
          </Text>
          <Text className="text-5xl font-bold text-yellow-600 mb-20">
            Sign in!
          </Text>
        </View>
      </SafeAreaView>
      <KeyboardAwareScrollView
        className="flex-1 bg-white"
        style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
      >
        <View
          className="flex-1 bg-white px-8 pt-8"
          style={{ borderTopLeftRadius: 50, borderTopRightRadius: 50 }}
        >
          <View className="form space-y-2">
            <Text className="text-gray-700 ml-4 text-xl mb-3">
              Email Address
            </Text>
            <TextInput
              className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
              placeholder="Enter email "
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
            {/* <TouchableOpacity
              onPress={handleForgotPassword}
              className="flex items-end mb-5"
            >
              <Text className="text-gray-700 mt-5 text-xl mr-4">
                Forgot Password?
              </Text>
            </TouchableOpacity> */}
            {/* Show email input for password reset if in reset mode */}
            {isResetMode && (
              <View>
                <Text className="text-gray-700 ml-4 text-xl mb-3 mt-5">
                  Enter your email to reset password
                </Text>
                <TextInput
                  className="p-4 bg-gray-100 text-gray-700 rounded-2xl mb-7"
                  placeholder="Enter email for password reset"
                  value={resetEmail}
                  onChangeText={(text) => setResetEmail(text)}
                />
                <TouchableOpacity
                  onPress={handleForgotPassword}
                  className="mb-5"
                >
                  <Text className="text-gray-700 text-xl text-center">
                    Reset Password
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {!isResetMode && (
              <TouchableOpacity
                onPress={() => setIsResetMode(true)}
                className="flex items-end mb-5"
              >
                <Text className="text-gray-700 mt-5 text-xl mr-4">
                  Forgot Password?
                </Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity
              onPress={handleSubmit}
              className="rounded-full py-3 bg-amber-700 mt-20"
            >
              <Text className="text-gray-900 font-xl font-bold text-center text-2xl">
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
          <View className="flex-row justify-center mt-4">
            <Text className="text-slate-950 font-semibold">
              Don't have an account?
            </Text>
            <TouchableOpacity onPress={() => navigation.navigate("SignUp")}>
              <Text className="text-yellow-600 font-semibold mb-10">
                Sign Up
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </View>
  );
}
