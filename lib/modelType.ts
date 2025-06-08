export type PatientState = {
  patients: Patient[];
  storePatient: (
    patient: Patient,
    showToast: (
      message: string,
      type?: "error" | "success" | "info",
      duration?: number
    ) => void
  ) => void;
  getPatient: () => void;
  deletePatient: (
    id: string,
    showToast: (
      message: string,
      type?: "error" | "success" | "info",
      duration?: number
    ) => void
  ) => void;
  updatePatient: (patient: Patient) => Promise<void>;
};

export type AuthState = {
  user: User | null;
  isLoading: boolean;
  token: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  logout: () => Promise<void>;
  initialize: () => Promise<void>;
};

export type Doctor = {
  id: string;
  name: string;
  email: string;
  phone: string;
  specialty: string[];
  license_number: string;
  education: string;
  experience_years: any;
  biography: string;
  address: string;
  image?: string;
  specialization?: string;
};

export type Appointment = {
  id: string;
  patient_profile_id: string;
  patient_profile_name: string;
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
  doctor: Doctor;
  date?: string;
  time?: string;
  room?: string;
};

export type AppointmentStoreState = {
  selectedDoctor: Doctor | null;
  selectedDate: string | null;
  selectedTime: string | null;
  selectedPatient: Patient | null;
  doctorAvailability: DoctorAvailability | null;
  availableTimeSlots: TimeSlot[];
  isLoading: boolean;
  error: string | null;
  appointments: Appointment[];
  treatments: { [key: string]: any }; // Store treatments by appointment ID
  labResults: { [key: string]: any };
  invoice: any;
  // Actions
  selectDoctor: (doctor: Doctor) => Promise<void>;
  selectDate: (date: string) => Promise<void>;
  selectTime: (time: string) => void;
  selectPatient: (patient: Patient) => void;
  bookAppointment: () => Promise<void>;
  getAppointments: () => Promise<void>;
  getTreatment: (appointmentId: string) => Promise<void>;
  getLabResult: (appointmentId: string) => Promise<void>;
  getInvoice: (appointmentId: string) => Promise<void>;
}

export type Treatment = {
  id: number;
  patient_profile_id: string;
  patient_profile_name: string[];
  appointment_date: string;
  appointment_time: string;
  status: string;
  notes: string;
  doctor: Doctor;
}

export type DoctorAvailability = {
  [key: string]: string[];
}

export type DoctorState = {
  doctors: Doctor[];
  isLoading: boolean;
  getDoctor: () => void;
};

interface TimeSlot {
  time: string;
  isAvailable: boolean;
}

export type Patient = {
  id?: string;
  name: string;
  age: number;
  date_of_birth: string;
  gender: string;
  phone: string;
  address: string;
  relation: string;
  blood_type: string;
  user_id?: number;
};

export type User = {
  id: string;
  email: string;
  name: string;
  roles?: string[];
  created_at?: string;
  updated_at?: string;
};
