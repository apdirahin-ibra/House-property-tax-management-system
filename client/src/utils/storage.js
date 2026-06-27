const TOKEN_KEY = 'hptms_token';

export const storage = {
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  },

  setToken(token) {
    localStorage.setItem(TOKEN_KEY, token);
  },

  removeToken() {
    localStorage.removeItem(TOKEN_KEY);
  },
};

export function getRoleHomePath(role) {
  switch (role) {
    case 'admin':
      return '/admin';
    case 'officer':
      return '/officer';
    case 'owner':
      return '/owner';
    default:
      return '/login';
  }
}
