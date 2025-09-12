import SupabaseAuthService from './supabaseAuthService';
import mockBackend from './mockBackend';

class HybridAuthService {
  constructor() {
    this.useSupabase = true; // Start assuming Supabase works
  }

  async testSupabaseConnection() {
    try {
      // Test if Supabase is reachable
      const result = await SupabaseAuthService.getCurrentUser();
      console.log('HybridAuthService: Supabase connection test passed');
      this.useSupabase = true;
      return true;
    } catch (error) {
      console.log('HybridAuthService: Supabase connection failed, falling back to mock backend:', error.message);
      this.useSupabase = false;
      return false;
    }
  }

  async register(email, password) {
    console.log('HybridAuthService: Attempting registration...');
    
    // Try Supabase first
    if (this.useSupabase) {
      try {
        console.log('HybridAuthService: Trying Supabase registration...');
        const result = await SupabaseAuthService.register(email, password);
        console.log('HybridAuthService: Supabase registration successful');
        return result;
      } catch (error) {
        console.log('HybridAuthService: Supabase registration failed, switching to mock backend:', error.message);
        // Check if it's an auth error (invalid credentials vs invalid API key)
        if (error.message.includes('Invalid API key') || error.message.includes('Unauthorized')) {
          console.log('HybridAuthService: Invalid API key detected, disabling Supabase permanently for this session');
        }
        this.useSupabase = false;
      }
    }

    // Fallback to mock backend
    console.log('HybridAuthService: Using mock backend for registration');
    try {
      const result = await mockBackend.register(email, password);
      return {
        success: true,
        user: result.user,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async login(email, password) {
    console.log('HybridAuthService: Attempting login...');
    
    // Try Supabase first
    if (this.useSupabase) {
      try {
        console.log('HybridAuthService: Trying Supabase login...');
        const result = await SupabaseAuthService.login(email, password);
        console.log('HybridAuthService: Supabase login successful');
        return result;
      } catch (error) {
        console.log('HybridAuthService: Supabase login failed, switching to mock backend:', error.message);
        // Check if it's an auth error (invalid credentials vs invalid API key)
        if (error.message.includes('Invalid API key') || error.message.includes('Unauthorized')) {
          console.log('HybridAuthService: Invalid API key detected, disabling Supabase permanently for this session');
        }
        this.useSupabase = false;
      }
    }

    // Fallback to mock backend
    console.log('HybridAuthService: Using mock backend for login');
    try {
      const result = await mockBackend.login(email, password);
      return {
        success: true,
        user: result.user,
        message: result.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }

  async logout() {
    console.log('HybridAuthService: Logging out...');
    
    if (this.useSupabase) {
      try {
        return await SupabaseAuthService.logout();
      } catch (error) {
        console.log('HybridAuthService: Supabase logout failed:', error.message);
      }
    }

    // Mock backend doesn't need special logout
    return { success: true };
  }

  async getCurrentUser() {
    console.log('HybridAuthService: Getting current user...');
    
    if (this.useSupabase) {
      try {
        const user = await SupabaseAuthService.getCurrentUser();
        if (user) {
          console.log('HybridAuthService: Got user from Supabase');
          return user;
        }
      } catch (error) {
        console.log('HybridAuthService: Failed to get user from Supabase:', error.message);
        this.useSupabase = false;
      }
    }

    // Mock backend stores user data in localStorage via UniversalStorage
    // For now, return null as mock backend doesn't persist user sessions
    return null;
  }

  async getAuthToken() {
    if (this.useSupabase) {
      try {
        return await SupabaseAuthService.getAuthToken();
      } catch (error) {
        console.log('HybridAuthService: Failed to get token from Supabase:', error.message);
        this.useSupabase = false;
      }
    }

    // Mock backend doesn't use persistent tokens
    return null;
  }

  async isAuthenticated() {
    if (this.useSupabase) {
      try {
        return await SupabaseAuthService.isAuthenticated();
      } catch (error) {
        console.log('HybridAuthService: Failed to check Supabase auth:', error.message);
        this.useSupabase = false;
      }
    }

    // For mock backend, check if there are any saved users (basic check)
    return false; // Mock backend doesn't persist sessions
  }

  onAuthStateChange(callback) {
    if (this.useSupabase) {
      try {
        return SupabaseAuthService.onAuthStateChange(callback);
      } catch (error) {
        console.log('HybridAuthService: Failed to set up Supabase auth listener:', error.message);
        this.useSupabase = false;
      }
    }

    // Mock backend doesn't have real-time auth state changes
    return { data: { subscription: { unsubscribe: () => {} } } };
  }

  getBackendType() {
    return this.useSupabase ? 'supabase' : 'mock';
  }
}

export default new HybridAuthService();