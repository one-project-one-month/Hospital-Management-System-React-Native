import { Patient, PatientState } from "@/lib/modelType";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { ToastAndroid } from "react-native";
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
        console.log('API Response:', JSON.stringify(response.data, null, 2));
        const patientsData = Array.isArray(response.data.data) 
          ? (Array.isArray(response.data.data[0]) ? response.data.data[0] : response.data.data)
          : [];
        set({ patients: patientsData });
        console.log('Store patients after set:', JSON.stringify(patientsData, null, 2));
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

        ToastAndroid.show('Patient profile stored successfully', ToastAndroid.SHORT);
    } catch (error: any) {
        throw error;
    }
  },
}));