// Load environment optimizations
require('./expo-env');

import React from 'react';
import { StatusBar } from 'expo-status-bar';
import 'react-native-gesture-handler';

import { UserProvider } from './src/context/UserContext';
import AppNavigator from './src/navigation/AppNavigator';

export default function App() {
  return (
    <UserProvider>
      <StatusBar style="light" backgroundColor="#16213e" />
      <AppNavigator />
    </UserProvider>
  );
}