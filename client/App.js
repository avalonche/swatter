import "./global";
import React from "react";
import { StatusBar } from "react-native";
import AppNavigator from "./src/navigator";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { LoadingProvider, UserProvider } from "./src/context";

StatusBar.setBarStyle("light-content");

export default function App() {
  return (
    <SafeAreaProvider>
      <UserProvider>
        <LoadingProvider>
          <AppNavigator />
        </LoadingProvider>
      </UserProvider>
    </SafeAreaProvider>
  );
}
