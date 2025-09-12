import ApiClient from './api';

export class ProfileService {
  async getProfile() {
    try {
      const response = await ApiClient.get('/profile');
      return {
        success: true,
        profile: response.profile,
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al obtener el perfil'
      };
    }
  }

  async createProfile(profileData) {
    try {
      const response = await ApiClient.post('/profile', profileData);
      return {
        success: true,
        profile: response.profile,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al crear el perfil'
      };
    }
  }

  async updateProfile(profileData) {
    try {
      const response = await ApiClient.put('/profile', profileData);
      return {
        success: true,
        profile: response.profile,
        message: response.message
      };
    } catch (error) {
      return {
        success: false,
        error: error.message || 'Error al actualizar el perfil'
      };
    }
  }
}

export default new ProfileService();