import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './src/screens/LoginScreen';
import RegisterScreen from './src/screens/RegisterScreen';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen';
import TabNavigator from './src/navigation/TabNavigator';
import NutritionResultsScreen from './src/screens/NutritionResultsScreen';
import EditProfileScreen from './src/screens/EditProfileScreen';
import WeightCutResultsScreen from './src/screens/WeightCutResultsScreen';
import { COLORS } from './src/styles/colors';
import { AuthProvider } from './src/context/AuthContext';

const Stack = createStackNavigator();

export default function App() {
  return (
    <AuthProvider>
      <NavigationContainer>
      <StatusBar style="light" />
      <Stack.Navigator
        initialRouteName="Login"
        screenOptions={{
          headerStyle: {
            backgroundColor: COLORS.primary,
          },
          headerTintColor: COLORS.text,
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }}
      >
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
          options={{ title: 'Crear Cuenta' }}
        />
        <Stack.Screen
          name="ForgotPassword"
          component={ForgotPasswordScreen}
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="Main"
          component={TabNavigator}
          options={{ title: 'Inicio', headerShown: false }}
        />
        <Stack.Screen
          name="NutritionResults"
          component={NutritionResultsScreen}
          options={{ title: 'Resultados del Análisis' }}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfileScreen}
          options={{ title: 'Editar Perfil' }}
        />
        <Stack.Screen
          name="WeightCutResults"
          component={WeightCutResultsScreen}
          options={{ title: 'Plan de Corte de Peso' }}
        />
      </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
}
