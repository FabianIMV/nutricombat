const API_BASE_URL = 'https://3f8q0vhfcf.execute-api.us-east-1.amazonaws.com/dev';

export const authService = {
  async login(email, password) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el login');
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  },

  async register(email, password, name) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, name }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error en el registro');
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  },

  async forgotPassword(email) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al enviar codigo de recuperacion');
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  },

  async confirmForgotPassword(email, code, newPassword) {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/confirm-forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, code, newPassword }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al restablecer contrasena');
      }

      return { data, error: null };
    } catch (error) {
      return { data: null, error: { message: error.message } };
    }
  }
};