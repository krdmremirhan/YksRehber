import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./navigation/AppNavigator";
import { AppProvider } from "./context/AppContext";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AppProvider>
        <NavigationContainer>
          <AppNavigator />
        </NavigationContainer>
      </AppProvider>
    </GestureHandlerRootView>
  );
}
