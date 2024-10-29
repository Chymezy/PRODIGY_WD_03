import axios, { AxiosError } from 'axios';
import { UserState } from '@/types';
import { wsService } from '@/services/websocketService';

interface AuthResponse {
  user: UserState;
  token: string;
}

interface ErrorResponse {
  message: string;
}

const API_URL = 'http://localhost:8080';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Add interceptor to add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/login', {
        email,
        password,
      });
      
      // Connect to WebSocket after successful login
      await wsService.connect();
      
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(
        axiosError.response?.data?.message || 'An error occurred during login'
      );
    }
  },

  async register(
    username: string,
    email: string,
    password: string
  ): Promise<AuthResponse> {
    try {
      const response = await api.post<AuthResponse>('/auth/register', {
        username,
        email,
        password,
      });
      return response.data;
    } catch (error) {
      const axiosError = error as AxiosError<ErrorResponse>;
      throw new Error(
        axiosError.response?.data?.message || 'An error occurred during registration'
      );
    }
  },

  logout(): void {
    api.post('/auth/logout');
    localStorage.removeItem('token');
  },

  getCurrentUser(): Partial<UserState> | null {
    try {
      const token = localStorage.getItem('token');
      if (!token) return null;
      
      const payload = JSON.parse(atob(token.split('.')[1]));
      return {
        id: payload.sub,
        email: payload.email,
        username: payload.username,
      };
    } catch (error) {
      this.logout();
      return null;
    }
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  },
};
