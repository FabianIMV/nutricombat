import HybridAuthService from './hybridAuthService';

export class AuthService {
  async login(email, password) {
    console.log('AuthService: Using hybrid auth system for login');
    return await HybridAuthService.login(email, password);
  }

  async register(email, password) {
    console.log('AuthService: Using hybrid auth system for registration');
    return await HybridAuthService.register(email, password);
  }

  async logout() {
    console.log('AuthService: Using hybrid auth system for logout');
    return await HybridAuthService.logout();
  }

  async getCurrentUser() {
    console.log('AuthService: Getting current user from hybrid auth system');
    return await HybridAuthService.getCurrentUser();
  }

  async getAuthToken() {
    console.log('AuthService: Getting auth token from hybrid auth system');
    return await HybridAuthService.getAuthToken();
  }

  async isAuthenticated() {
    console.log('AuthService: Checking authentication with hybrid auth system');
    return await HybridAuthService.isAuthenticated();
  }

  onAuthStateChange(callback) {
    console.log('AuthService: Setting up hybrid auth state listener');
    return HybridAuthService.onAuthStateChange(callback);
  }

  getBackendType() {
    return HybridAuthService.getBackendType();
  }
}

export default new AuthService();