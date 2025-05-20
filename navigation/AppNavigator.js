import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import WordQuizScreen from '../screens/WordQuizScreen';
import TodosScreen from '../screens/TodosScreen';
import AddTaskScreen from '../screens/AddTaskScreen';
import PomodoroScreen from '../screens/PomodoroScreen';
import ScoreCalculatorScreen from '../screens/ScoreCalculatorScreen';
import SettingsScreen from '../screens/SettingsScreen';
import WordCategoryScreen from '../screens/WordCategoryScreen';
import CategoryManagementScreen from '../screens/CategoryManagementScreen';
import AddCategoryScreen from '../screens/AddCategoryScreen';
import WordCrushScreen from '../screens/WordCrushScreen';
import ExamDateScreen from '../screens/ExamDateScreen';
import CountdownCard from '../components/CountdownCard';
import TabNavigator from "./TabNavigator";
import ScoreResultScreen from '../screens/ScoreResultScreen';
const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Main" component={TabNavigator} />
      <Stack.Screen name="HomeScreen" component={HomeScreen} />
      <Stack.Screen name="WordQuiz" component={WordQuizScreen} />
      <Stack.Screen name="Todos" component={TodosScreen} />
      <Stack.Screen name='SettingsScreen' component={SettingsScreen} />
      <Stack.Screen name="AddTask" component={AddTaskScreen} />
      <Stack.Screen name="PomodoroScreen" component={PomodoroScreen} />
      <Stack.Screen name="ScoreCalculatorScreen" component={ScoreCalculatorScreen} />
      <Stack.Screen name='WordCategoryScreen' component={WordCategoryScreen} />
      <Stack.Screen name="WordQuizScreen" component={WordQuizScreen} />
      <Stack.Screen name='CategoryManagementScreen' component={CategoryManagementScreen} />
      <Stack.Screen name="AddCategoryScreen" component={AddCategoryScreen} />
      <Stack.Screen name="TodosScreen" component={TodosScreen} />
      <Stack.Screen name="WordCrushScreen" component={WordCrushScreen} />
      <Stack.Screen name="ExamDateScreen" component={ExamDateScreen} options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="CountdownDetail" component={CountdownCard} />
      <Stack.Screen name='ScoreResult' component={ScoreResultScreen} />
    </Stack.Navigator>
  );
}
