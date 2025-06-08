import { Patient, PatientState } from "@/lib/modelType";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
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

  storePatient: async (patient: Patient, showToast: (message: string, type?: "error" | "success" | "info", duration?: number) => void) => {
    const token = await SecureStore.getItemAsync('token');
    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.post(`${API_URL}/patient-profile`, patient);
        
        set((state) => {
            const newPatient = Array.isArray(response.data.data) ? response.data.data[0] : response.data.data;
            return { patients: [...state.patients, newPatient] };
        });
        showToast('Patient profile created', 'success');
    } catch (error: any) {
        showToast('Error creating patient profile', 'error');
        throw error;
    }
  },

  updatePatient: async (patient: Patient) => {
    const token = await SecureStore.getItemAsync('token');
    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        await axios.put(`${API_URL}/patient-profile/${patient.id}`, patient);

        set((state) => {
            const updatedPatient = state.patients.map((p) => p.id === patient.id ? patient : p);
            return { patients: updatedPatient };
        });
    } catch (error: any) {
        throw error;
    }
  },

  deletePatient: async (id: string, showToast: (message: string, type?: "error" | "success" | "info", duration?: number) => void) => {
    const token = await SecureStore.getItemAsync('token');
    try {
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const response = await axios.delete(`${API_URL}/patient-profile/${id}`);

        set((state) => {
            const updatedPatient = state.patients.filter((p) => p.id !== id);
            return { patients: updatedPatient };
        });

        showToast('Patient profile deleted', 'success');
    } catch (error: any) {
        showToast('Error deleting patient profile', 'error');
        throw error;
    }
  }
}));