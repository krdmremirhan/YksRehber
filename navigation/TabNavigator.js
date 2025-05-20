// navigation/TabNavigator.js
import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";
import { useAppContext } from "../context/AppContext";

import HomeScreen from "../screens/HomeScreen";
import TodosScreen from "../screens/TodosScreen";
import PomodoroScreen from "../screens/PomodoroScreen";
import WordCrushScreen from "../screens/WordCrushScreen";
import ScoreCalculatorScreen from "../screens/ScoreCalculatorScreen";
import WordCategoryScreen from "../screens/WordCategoryScreen";

const Tab = createBottomTabNavigator();

export default function TabNavigator() {
  const { themeColor } = useAppContext();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarActiveTintColor: themeColor,
        tabBarStyle: {
          backgroundColor: "#fff",
          height: 60,
          paddingBottom: 6,
        },
        tabBarIcon: ({ color, size }) => {
          let iconName;

          switch (route.name) {
            case "Home":
              iconName = "home-outline";
              break;
            case "Todos":
              iconName = "checkmark-done-outline";
              break;
            case "Pomodoro":
              iconName = "timer-outline";
              break;
            case "WordCategoryScreen":
              iconName = "book-outline";
              break;
            case "Score":
              iconName = "calculator-outline";
              break;
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Todos" component={TodosScreen} />
      <Tab.Screen name="Pomodoro" component={PomodoroScreen} />
      <Tab.Screen name="WordCategoryScreen" component={WordCategoryScreen} />
      <Tab.Screen name="Score" component={ScoreCalculatorScreen} />
    </Tab.Navigator>
  );
}
