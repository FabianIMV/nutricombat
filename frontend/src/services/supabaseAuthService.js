import { supabase } from '../lib/supabase';

export class SupabaseAuthService {
  async register(email, password) {
    try {
      console.log('SupabaseAuthService: Attempting registration for email:', email);
      
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.log('SupabaseAuthService: Registration error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('SupabaseAuthService: Registration successful:', data);
      
      return {
        success: true,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          token: data.session?.access_token
        },
        message: 'Usuario registrado exitosamente'
      };
    } catch (error) {
      console.log('SupabaseAuthService: Registration error:', error);
      return {
        success: false,
        error: error.message || 'Error de conexión'
      };
    }
  }

  async login(email, password) {
    try {
      console.log('SupabaseAuthService: Attempting login for email:', email);
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password,
      });

      if (error) {
        console.log('SupabaseAuthService: Login error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('SupabaseAuthService: Login successful:', data);
      
      return {
        success: true,
        user: {
          id: data.user?.id,
          email: data.user?.email,
          token: data.session?.access_token
        },
        message: 'Inicio de sesión exitoso'
      };
    } catch (error) {
      console.log('SupabaseAuthService: Login error:', error);
      return {
        success: false,
        error: error.message || 'Error de conexión'
      };
    }
  }

  async logout() {
    try {
      console.log('SupabaseAuthService: Logging out...');
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.log('SupabaseAuthService: Logout error:', error);
        return {
          success: false,
          error: error.message
        };
      }

      console.log('SupabaseAuthService: Logout successful');
      return {
        success: true
      };
    } catch (error) {
      console.log('SupabaseAuthService: Logout error:', error);
      return {
        success: false,
        error: error.message || 'Error al cerrar sesión'
      };
    }
  }

  async getCurrentUser() {
    try {
      console.log('SupabaseAuthService: Getting current user...');
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (error) {
        console.log('SupabaseAuthService: Error getting current user:', error);
        return null;
      }

      console.log('SupabaseAuthService: Current user:', user);
      
      return user ? {
        id: user.id,
        email: user.email,
        token: (await supabase.auth.getSession()).data.session?.access_token
      } : null;
    } catch (error) {
      console.error('SupabaseAuthService: Error getting current user:', error);
      return null;
    }
  }

  async getAuthToken() {
    try {
      console.log('SupabaseAuthService: Getting auth token...');
      const { data: { session }, error } = await supabase.auth.getSession();
      
      if (error) {
        console.log('SupabaseAuthService: Error getting token:', error);
        return null;
      }

      console.log('SupabaseAuthService: Token retrieved:', session?.access_token ? 'Present' : 'None');
      return session?.access_token || null;
    } catch (error) {
      console.error('SupabaseAuthService: Error getting auth token:', error);
      return null;
    }
  }

  async isAuthenticated() {
    try {
      const { data: { session }, error } = await supabase.auth.getSession();
      const isAuth = !error && !!session?.user;
      console.log('SupabaseAuthService: Is authenticated:', isAuth);
      return isAuth;
    } catch (error) {
      console.error('SupabaseAuthService: Error checking authentication:', error);
      return false;
    }
  }

  // Listen to auth changes
  onAuthStateChange(callback) {
    console.log('SupabaseAuthService: Setting up auth state listener');
    return supabase.auth.onAuthStateChange((event, session) => {
      console.log('SupabaseAuthService: Auth state changed:', event, session?.user?.email);
      callback(event, session);
    });
  }
}

export default new SupabaseAuthService();