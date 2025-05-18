import { AuthState } from '@/lib/modelType';
import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { ToastAndroid } from 'react-native';
import { create } from 'zustand';

const API_URL = 'https://one-pj-one-month-may-hms-laravel.newway.com.mm/api/v1';

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoading: true,
  token: null,

  initialize: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/auth/user`);
        set({ user: response.data.data.user, token: token });
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
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
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
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await SecureStore.setItemAsync('token', String(token));
        set({ user, token });
    } catch (error: any) {
      console.log(error.response.data);
      if (error.response?.data?.status === 'error') {
        // Pass through validation errors
        throw error;
      }
      throw new Error('Registration failed');
    }
  },

  logout: async () => {
    try {
      const token = await SecureStore.getItemAsync('token');
      if (token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await axios.post(`${API_URL}/auth/logout`);
        await SecureStore.deleteItemAsync('token');
        set({ user: null, token: null });
        axios.defaults.headers.common['Authorization'] = '';
      }
    } catch (error: any) {
      ToastAndroid.show('Error logging out', ToastAndroid.SHORT);
      console.error('Error logging out:', error);
    }
  },
})); 