import MockBackendService from './mockBackend';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AUTH_TOKEN_KEY = 'nutricombat_auth_token';

const getApiBaseUrl = () => {
  if (typeof __DEV__ !== 'undefined' && __DEV__) {
    return 'http://localhost:3000';
  }
  
  // For now, use mock backend in production since GitHub Pages is static
  // To enable real backend, deploy to Vercel and update this URL
  return 'https://your-backend-api-url.vercel.app';
};

const API_BASE_URL = getApiBaseUrl();

class ApiClient {
  constructor() {
    this.baseURL = API_BASE_URL;
    // Force mock backend for GitHub Pages deployment
    this.useMockBackend = true;
  }

  async request(endpoint, options = {}) {
    // Try real API first, fallback to mock if needed
    if (!this.useMockBackend) {
      try {
        const url = `${this.baseURL}${endpoint}`;
        
        // Get auth token for authenticated requests
        const token = await AsyncStorage.getItem(AUTH_TOKEN_KEY);
        
        const config = {
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
            ...options.headers,
          },
          ...options,
        };

        if (config.body && typeof config.body === 'object') {
          config.body = JSON.stringify(config.body);
        }

        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Error en la petición');
        }
        
        return data;
      } catch (error) {
        console.warn('API Error, falling back to mock backend:', error);
        this.useMockBackend = true;
        return this.mockRequest(endpoint, options);
      }
    } else {
      return this.mockRequest(endpoint, options);
    }
  }

  async mockRequest(endpoint, options = {}) {
    let body = {};
    if (options.body) {
      try {
        body = typeof options.body === 'string' ? JSON.parse(options.body) : options.body;
      } catch (e) {
        console.error('Error parsing body:', e);
        body = {};
      }
    }
    const token = options.headers?.Authorization?.replace('Bearer ', '');
    
    try {
      console.log('Mock request:', { endpoint, method: options.method, body });
      if (endpoint === '/auth/register' && options.method === 'POST') {
        return await MockBackendService.register(body.email, body.password);
      } else if (endpoint === '/auth/login' && options.method === 'POST') {
        return await MockBackendService.login(body.email, body.password);
      } else if (endpoint === '/profile' && options.method === 'GET') {
        return await MockBackendService.getProfile(token);
      } else if (endpoint === '/profile' && options.method === 'POST') {
        return await MockBackendService.createProfile(token, body);
      } else if (endpoint === '/profile' && options.method === 'PUT') {
        return await MockBackendService.updateProfile(token, body);
      } else if (endpoint === '/health') {
        return MockBackendService.health();
      }
      
      throw new Error(`Mock endpoint not implemented: ${endpoint}`);
    } catch (error) {
      throw new Error(error.message || 'Mock backend error');
    }
  }

  async post(endpoint, data) {
    return this.request(endpoint, {
      method: 'POST',
      body: data,
    });
  }

  async get(endpoint) {
    return this.request(endpoint, {
      method: 'GET',
    });
  }

  async put(endpoint, data) {
    return this.request(endpoint, {
      method: 'PUT',
      body: data,
    });
  }
}

export default new ApiClient();