import { Patient, PatientState } from "@/lib/modelType";
import axios from "axios";
import * as SecureStore from 'expo-secure-store';
import { ToastAndroid } from "react-native";
import { create } from "zustand";

const API_URL = 'https://one-pj-one-month-may-hms-laravel.newway.com.mm/api/v1';

export const usePatient = create<PatientState>((set) => ({
  patient: null,
  isLoading: false,

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