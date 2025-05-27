import axios from 'axios';
import { AuthResponse } from '@/types';

const API_BASE_URL = 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: async (data: {
    username: string;
    email: string;
    password: string;
    color?: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: {
    username: string;
    password: string;
  }): Promise<AuthResponse> => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  updateProfile: async (data: { color?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },
};

export default api; 