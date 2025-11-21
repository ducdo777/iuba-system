import api from './api';

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  username: string;
  role: 'admin' | 'user';
  fullName: string;
  teamId?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export const authService = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post<AuthResponse>('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('authToken', response.data.access_token);
      localStorage.setItem('currentUser', JSON.stringify(response.data.user));
    }
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};
