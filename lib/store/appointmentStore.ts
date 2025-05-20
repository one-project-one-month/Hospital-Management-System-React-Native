import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { Appointment, Doctor, Patient } from '../modelType';
interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

interface DoctorAvailability {
  [key: string]: string[];
}

interface AppointmentStore {
  selectedDoctor: Doctor | null;
  selectedDate: string | null;
  selectedTime: string | null;
  selectedPatient: Patient | null;
  doctorAvailability: DoctorAvailability | null;
  availableTimeSlots: TimeSlot[];
  isLoading: boolean;
  error: string | null;
  appointments: Appointment[];
  // Actions
  selectDoctor: (doctor: Doctor) => Promise<void>;
  selectDate: (date: string) => Promise<void>;
  selectTime: (time: string) => void;
  selectPatient: (patient: Patient) => void;
  bookAppointment: () => Promise<void>;
  getAppointments: () => Promise<void>;
}

const API_URL = 'https://one-pj-one-month-may-hms-laravel.newway.com.mm/api/v1';

export const useAppointmentStore = create<AppointmentStore>((set, get) => ({
  doctors: [],
  selectedDoctor: null,
  selectedDate: null,
  selectedTime: null,
  selectedPatient: null,
  doctorAvailability: null,
  availableTimeSlots: [],
  isLoading: false,
  error: null,
  appointments: [],

  selectDoctor: async (doctor: Doctor) => {
    try {
        const token = await SecureStore.getItemAsync('token');
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      set({ isLoading: true, error: null, selectedDoctor: doctor });
      const response = await axios.get(`${API_URL}/doctors/${doctor.id}`);
      set({ doctorAvailability: response.data.data.availability, isLoading: false });
    } catch (error) {
      set({ error: 'Failed to fetch doctor availability', isLoading: false });
    }
  },

  selectDate: async (date: string) => {
    const { selectedDoctor } = get();
    if (!selectedDoctor) return;
    const token = await SecureStore.getItemAsync('token');
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

    try {
      set({ isLoading: true, error: null, selectedDate: date, selectedTime: null });
      
      // Get existing appointments for the selected date
      const response = await axios.get(`${API_URL}/appointments`, {
        params: {
          doctor_id: selectedDoctor.id,
          appointment_date: date
        }
      });

      const existingAppointments = response.data.data.appointment;
      const dayOfWeek = new Date(date).toLocaleDateString('en-US', { weekday: 'short' });
      const availableTimes = get().doctorAvailability?.[dayOfWeek] || [];

      // Filter out times that are already booked
      const availableTimeSlots = availableTimes.map(time => ({
        time,
        isAvailable: !existingAppointments.some((app: any) => 
          app.appointment_time.startsWith(time)
        )
      }));

      set({ availableTimeSlots, isLoading: false });
    } catch (error) {
        console.log(error);
      set({ error: 'Failed to fetch available time slots', isLoading: false });
    }
  },

  selectTime: (time: string) => {
    set({ selectedTime: time });
  },

  selectPatient: (patient: Patient) => {
    set({ selectedPatient: patient });
  },

  bookAppointment: async () => {
    const { selectedDoctor, selectedDate, selectedTime, selectedPatient } = get();
    
    if (!selectedDoctor || !selectedDate || !selectedTime || !selectedPatient) {
      set({ error: 'Please fill in all required fields' });
      return;
    }

    try {
      set({ isLoading: true, error: null });
      const response = await axios.post(`${API_URL}/appointments/patient`, {
        doctor_profile_id: selectedDoctor.id,
        patient_profile_id: selectedPatient.id,
        appointment_date: selectedDate,
        appointment_time: selectedTime,
        notes: 'Initial consultation completed'
      });
      
      // Reset form after successful booking
      set({
        selectedDoctor: null,
        selectedDate: null,
        selectedTime: null,
        selectedPatient: null,
        doctorAvailability: null,
        availableTimeSlots: [],
        isLoading: false,
        appointments: [...get().appointments, response.data.data.appointment]
      });
    } catch (error) {
      set({ error: 'Failed to book appointment', isLoading: false });
      console.log(error);
    }
  },

  getAppointments: async () => {
    const token = await SecureStore.getItemAsync('token');
    try {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      const response = await axios.get(`${API_URL}/patients/appointments`);
      set({ appointments: response.data.data });
    } catch (error) {
      set({ error: 'Failed to fetch appointments', isLoading: false });
    }
  }
})); 