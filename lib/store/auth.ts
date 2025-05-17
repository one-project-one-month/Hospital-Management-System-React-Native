import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';

const API_URL = 'https://one-pj-one-month-may-hms-laravel.newway.com.mm/api/v1';

type User = {
  id: string;
  email: string;
  name: string;
  roles?: string[];
  created_at?: string;
  updated_at?: string;
};

type ValidationError = {
  status: 'fail';
  statusCode: number;
  message: string;
  data: {
    [key: string]: string[];
  };
};

type AuthState = {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  token: null,

  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        const response = await axios.get(`${API_URL}/auth/user`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        set({ user: response.data, token });
      }
    } catch (error) {
      console.error('Error loading user:', error);
      await SecureStore.deleteItemAsync('token');
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      const { token, user } = response.data.data;
      await SecureStore.setItemAsync('token', token);
      set({ user, token });
    } catch (error: any) {
      if (error.response?.data?.status === 'fail') {
        // Pass through validation errors
        throw error;
      }
      throw new Error('Login failed');
    }
  },

  register: async (email: string, password: string, name: string) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, {
        name,
        email,
        password,
      });

        const { token, user } = response.data.data;
        // Ensure token is stored as a string
        await SecureStore.setItemAsync('token', String(token));
        set({ user, token });
    } catch (error: any) {
      if (error.response?.data?.status === 'fail') {
        // Pass through validation errors
        throw error;
      }
      throw new Error('Registration failed');
    }
  },

  logout: async () => {
    try {
      await SecureStore.deleteItemAsync('token');
      set({ user: null, token: null });
    } catch (error) {
      console.error('Error logging out:', error);
    }
  },
})); 