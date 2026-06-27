import { apiRequest } from './api';
import { storage } from '../utils/storage';

export const authService = {
  async login(email, password) {
    const result = await apiRequest('/auth/login', {
      method: 'POST',
      auth: false,
      body: JSON.stringify({ email, password }),
    });

    storage.setToken(result.data.token);
    return result.data.user;
  },

  async getMe() {
    const result = await apiRequest('/auth/me');
    return result.data.user;
  },

  logout() {
    storage.removeToken();
  },
};
