import AsyncStorage from '@react-native-async-storage/async-storage';

// Universal storage that works in both React Native and web
const UniversalStorage = {
  async setItem(key, value) {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Browser environment - use localStorage
      localStorage.setItem(key, value);
      return Promise.resolve();
    } else {
      // React Native environment - use AsyncStorage
      return UniversalStorage.setItem(key, value);
    }
  },

  async getItem(key) {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Browser environment - use localStorage
      return Promise.resolve(localStorage.getItem(key));
    } else {
      // React Native environment - use AsyncStorage
      return UniversalStorage.getItem(key);
    }
  },

  async removeItem(key) {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Browser environment - use localStorage
      localStorage.removeItem(key);
      return Promise.resolve();
    } else {
      // React Native environment - use AsyncStorage
      return AsyncStorage.removeItem(key);
    }
  },

  async multiRemove(keys) {
    if (typeof window !== 'undefined' && window.localStorage) {
      // Browser environment - use localStorage
      keys.forEach(key => localStorage.removeItem(key));
      return Promise.resolve();
    } else {
      // React Native environment - use AsyncStorage
      return UniversalStorage.multiRemove(keys);
    }
  }
};

const KEYS = {
  USER_PROFILE: 'user_profile',
  WEIGHT_HISTORY: 'weight_history',
  WATER_INTAKE: 'water_intake',
  FOOD_LOG: 'food_log',
};

export const storage = {
  // User Profile
  async saveUserProfile(profile) {
    try {
      await UniversalStorage.setItem(KEYS.USER_PROFILE, JSON.stringify(profile));
      return true;
    } catch (error) {
      console.error('Error saving user profile:', error);
      return false;
    }
  },

  async getUserProfile() {
    try {
      const profile = await UniversalStorage.getItem(KEYS.USER_PROFILE);
      return profile ? JSON.parse(profile) : null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
    }
  },

  // Weight History
  async saveWeightEntry(weight) {
    try {
      const history = await this.getWeightHistory();
      const newEntry = {
        weight,
        date: new Date().toISOString(),
        timestamp: Date.now(),
      };
      const updatedHistory = [...history, newEntry];
      await UniversalStorage.setItem(KEYS.WEIGHT_HISTORY, JSON.stringify(updatedHistory));
      return true;
    } catch (error) {
      console.error('Error saving weight entry:', error);
      return false;
    }
  },

  async getWeightHistory() {
    try {
      const history = await UniversalStorage.getItem(KEYS.WEIGHT_HISTORY);
      return history ? JSON.parse(history) : [];
    } catch (error) {
      console.error('Error getting weight history:', error);
      return [];
    }
  },

  // Water Intake
  async saveWaterIntake(amount) {
    try {
      const today = new Date().toDateString();
      const currentIntake = await this.getTodayWaterIntake();
      const newIntake = {
        date: today,
        amount: currentIntake + amount,
        timestamp: Date.now(),
      };
      await UniversalStorage.setItem(KEYS.WATER_INTAKE, JSON.stringify(newIntake));
      return true;
    } catch (error) {
      console.error('Error saving water intake:', error);
      return false;
    }
  },

  async getTodayWaterIntake() {
    try {
      const intake = await UniversalStorage.getItem(KEYS.WATER_INTAKE);
      if (!intake) return 0;
      
      const data = JSON.parse(intake);
      const today = new Date().toDateString();
      
      return data.date === today ? data.amount : 0;
    } catch (error) {
      console.error('Error getting water intake:', error);
      return 0;
    }
  },

  // Food Log
  async saveFoodEntry(food) {
    try {
      const log = await this.getFoodLog();
      const newEntry = {
        ...food,
        date: new Date().toISOString(),
        timestamp: Date.now(),
      };
      const updatedLog = [...log, newEntry];
      await UniversalStorage.setItem(KEYS.FOOD_LOG, JSON.stringify(updatedLog));
      return true;
    } catch (error) {
      console.error('Error saving food entry:', error);
      return false;
    }
  },

  async getFoodLog() {
    try {
      const log = await UniversalStorage.getItem(KEYS.FOOD_LOG);
      return log ? JSON.parse(log) : [];
    } catch (error) {
      console.error('Error getting food log:', error);
      return [];
    }
  },

  // Clear all data
  async clearAllData() {
    try {
      await UniversalStorage.multiRemove([
        KEYS.USER_PROFILE,
        KEYS.WEIGHT_HISTORY,
        KEYS.WATER_INTAKE,
        KEYS.FOOD_LOG,
      ]);
      return true;
    } catch (error) {
      console.error('Error clearing data:', error);
      return false;
    }
  },
};