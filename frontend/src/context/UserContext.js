import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { storage } from '../utils/storage';
import AuthService from '../services/authService';

const UserContext = createContext();

const initialState = {
  user: null,
  isLoggedIn: false,
  weightHistory: [],
  todayWaterIntake: 0,
  foodLog: [],
  loading: true,
};

function userReducer(state, action) {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, loading: action.payload };
    
    case 'LOGIN':
      return { 
        ...state, 
        isLoggedIn: true,
        loading: false 
      };
    
    case 'LOGOUT':
      return { 
        ...initialState, 
        loading: false 
      };
    
    case 'SET_USER_PROFILE':
      return { 
        ...state, 
        user: action.payload,
        loading: false 
      };
    
    case 'UPDATE_WEIGHT_HISTORY':
      return { 
        ...state, 
        weightHistory: action.payload 
      };
    
    case 'UPDATE_WATER_INTAKE':
      return { 
        ...state, 
        todayWaterIntake: action.payload 
      };
    
    case 'UPDATE_FOOD_LOG':
      return { 
        ...state, 
        foodLog: action.payload 
      };
    
    case 'ADD_WEIGHT_ENTRY':
      return {
        ...state,
        weightHistory: [...state.weightHistory, action.payload]
      };
    
    case 'ADD_FOOD_ENTRY':
      return {
        ...state,
        foodLog: [...state.foodLog, action.payload]
      };

    default:
      return state;
  }
}

export function UserProvider({ children }) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Load data on app start and listen to auth changes
  useEffect(() => {
    loadUserData();
    
    // Set up Supabase auth state listener
    const { data: { subscription } } = AuthService.onAuthStateChange(async (event, session) => {
      console.log('UserContext: Auth state changed:', event, session?.user?.email);
      
      if (event === 'SIGNED_IN' && session?.user) {
        // User signed in
        const userData = {
          id: session.user.id,
          email: session.user.email,
          token: session.access_token
        };
        dispatch({ type: 'SET_USER_PROFILE', payload: userData });
        dispatch({ type: 'LOGIN' });
      } else if (event === 'SIGNED_OUT') {
        // User signed out
        dispatch({ type: 'LOGOUT' });
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const loadUserData = async () => {
    try {
      const [currentUser, profile, weightHistory, waterIntake, foodLog] = await Promise.all([
        AuthService.getCurrentUser(),
        storage.getUserProfile(),
        storage.getWeightHistory(),
        storage.getTodayWaterIntake(),
        storage.getFoodLog(),
      ]);

      if (currentUser || profile) {
        dispatch({ type: 'SET_USER_PROFILE', payload: profile });
        dispatch({ type: 'LOGIN' });
      }

      dispatch({ type: 'UPDATE_WEIGHT_HISTORY', payload: weightHistory });
      dispatch({ type: 'UPDATE_WATER_INTAKE', payload: waterIntake });
      dispatch({ type: 'UPDATE_FOOD_LOG', payload: foodLog });
      
    } catch (error) {
      console.error('Error loading user data:', error);
    } finally {
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const login = async (userData = null) => {
    try {
      if (userData) {
        // User data provided (from registration or direct login)
        console.log('UserContext: Setting user data from provided userData:', userData);
        dispatch({ type: 'SET_USER_PROFILE', payload: userData });
        dispatch({ type: 'LOGIN' });
      } else {
        // Check if user is already authenticated
        const currentUser = await AuthService.getCurrentUser();
        if (currentUser) {
          console.log('UserContext: User already authenticated:', currentUser);
          dispatch({ type: 'SET_USER_PROFILE', payload: currentUser });
          dispatch({ type: 'LOGIN' });
        } else {
          console.log('UserContext: No authenticated user found');
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      }
    } catch (error) {
      console.error('UserContext: Error during login:', error);
      dispatch({ type: 'SET_LOADING', payload: false });
    }
  };

  const logout = async () => {
    await AuthService.logout();
    await storage.clearAllData();
    dispatch({ type: 'LOGOUT' });
  };

  const saveUserProfile = async (profile) => {
    const success = await storage.saveUserProfile(profile);
    if (success) {
      dispatch({ type: 'SET_USER_PROFILE', payload: profile });
      dispatch({ type: 'LOGIN' });
    }
    return success;
  };

  const addWeightEntry = async (weight) => {
    const success = await storage.saveWeightEntry(weight);
    if (success) {
      const entry = {
        weight,
        date: new Date().toISOString(),
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_WEIGHT_ENTRY', payload: entry });
    }
    return success;
  };

  const addWaterIntake = async (amount) => {
    const success = await storage.saveWaterIntake(amount);
    if (success) {
      const newTotal = state.todayWaterIntake + amount;
      dispatch({ type: 'UPDATE_WATER_INTAKE', payload: newTotal });
    }
    return success;
  };

  const addFoodEntry = async (food) => {
    const success = await storage.saveFoodEntry(food);
    if (success) {
      const entry = {
        ...food,
        date: new Date().toISOString(),
        timestamp: Date.now(),
      };
      dispatch({ type: 'ADD_FOOD_ENTRY', payload: entry });
    }
    return success;
  };

  const value = {
    ...state,
    login,
    logout,
    saveUserProfile,
    addWeightEntry,
    addWaterIntake,
    addFoodEntry,
    loadUserData,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}