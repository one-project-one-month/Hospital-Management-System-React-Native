import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { create } from "zustand";
import { DoctorState } from "../modelType";

const API_URL = 'https://one-pj-one-month-may-hms-laravel.newway.com.mm/api/v1'

export const useDoctor = create<DoctorState>((set) => ({
  doctors: [],
  isLoading: false,

  getDoctor: async () => {
    set({ isLoading: true });
    const token = await SecureStore.getItemAsync('token');
    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/admin/doctors`);
        set({ doctors: response.data.data, isLoading: false });
    } catch (error: any) {
        console.error('Error fetching doctors:', error);
        throw error;
    }
  },
  
}));
