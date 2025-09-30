import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { COLORS } from '../styles/colors';

import DashboardScreen from '../screens/DashboardScreen';
import NutritionTrackingScreen from '../screens/NutritionTrackingScreen';
import RecommendationsScreen from '../screens/RecommendationsScreen';
import StatsScreen from '../screens/StatsScreen';

const Stack = createStackNavigator();

export default function DashboardStackNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        cardStyle: { backgroundColor: COLORS.primary },
      }}
    >
      <Stack.Screen name="DashboardHome" component={DashboardScreen} />
      <Stack.Screen name="NutritionTracking" component={NutritionTrackingScreen} />
      <Stack.Screen name="Recommendations" component={RecommendationsScreen} />
      <Stack.Screen name="Stats" component={StatsScreen} />
    </Stack.Navigator>
  );
}
