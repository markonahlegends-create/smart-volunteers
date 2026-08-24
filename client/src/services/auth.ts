import api from './api';

export interface LoginCredentials {
  login: string;
  password: string;
  captcha: string;
}

export interface AuthResponse {
  token: string;
  user: {
    id: number;
    email: string;
    nama: string;
    role: string;
  };
}

export const authApi = {
  login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  refresh: async (): Promise<{ token: string }> => {
    const response = await api.post('/auth/refresh');
    return response.data;
  },
};
