import React from "react";
import "./global.css";
import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import AppNavigation from "./navigation/appNavigation";

export default function App() {
  return <AppNavigation />;
}
