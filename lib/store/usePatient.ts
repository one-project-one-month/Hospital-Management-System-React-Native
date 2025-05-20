import { Patient, PatientState } from "@/lib/modelType";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { toast } from "sonner-native";
import { create } from "zustand";

const API_URL = 'https://one-pj-one-month-may-hms-laravel.newway.com.mm/api/v1';

export const usePatient = create<PatientState>((set) => ({
  patients: [],
  isLoading: false,

  getPatient: async () => {
    const token = await SecureStore.getItemAsync('token');
    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.get(`${API_URL}/getMyPatientAccounts`);
        const patientsData = response.data.data;
        set({ patients: patientsData });
    } catch (error: any) {
        console.error('Error fetching patients:', error);
        throw error;
    }
  },

  storePatient: async (patient: Patient) => {
    const token = await SecureStore.getItemAsync('token');
    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_URL}/patient-profile`, patient);
        
        set((state) => {
            const newPatient = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
            return { patients: [...state.patients, newPatient] };
        });
        toast.success('Patient profile created');
    } catch (error: any) {
        toast.error('Error creating patient profile');
        throw error;
    }
  },

  deletePatient: async (id: string) => {
    const token = await SecureStore.getItemAsync('token');
    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.delete(`${API_URL}/patient-profile/${id}`);
        toast.success('Patient profile deleted');
    } catch (error: any) {
        toast.error('Error deleting patient profile');
        throw error;
    }
  }
}));