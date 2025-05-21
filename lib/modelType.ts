export type PatientState = {
    patients: Patient[];
    storePatient: (patient: any, showToast: (message: string, type?: "error" | "success" | "info", duration?: number) => void) => void;
    getPatient: () => void;
    deletePatient: (id: string, showToast: (message: string, type?: "error" | "success" | "info", duration?: number) => void) => void;
};

export type AuthState = {
    user: User | null;
    isLoading: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
}

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
}

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
}

// "id": 1,
//             "patient_profile_id": "9ef3330f-9da8-46b8-a750-b8c09b06c008",
//             "patient_profile_name": "Mg Mg",
//             "appointment_date": "2025-05-14",
//             "appointment_time": "11:15:00",
//             "status": "pending",
//             "notes": "Initial consultation completed",
//             "doctor": {
//                 "id": "9ef3330f-f962-4ab8-b0a1-85a31f975396",
//                 "name": "Dr. John Smith",
//                 "email": "doctor@example.com",
//                 "specialty": [
//                     "Cardiology",
//                     "Internal Medicine"
//                 ],
//                 "availability": {
//                     "Fri": [
//                         "09:00",
//                         "13:00"
//                     ],
//                     "Mon": [
//                         "14:00",
//                         "16:00"
//                     ],
//                     "Wed": [
//                         "10:00",
//                         "11:00",
//                         "15:00"
//                     ]
//                 },
//                 "license_number": "MD123456",
//                 "education": "M.D. from Harvard Medical School",
//                 "experience_years": "2015",
//                 "biography": "Board certified cardiologist with 15 years of experience in treating cardiovascular diseases.",
//                 "phone": "9876543210",
//                 "address": "456 Medical Center Drive, Suite 100"

export type DoctorState = {
    doctors: Doctor[];
    isLoading: boolean;
    getDoctor: () => void;
}

export type Patient = {
    id: string;
    name: string;
    age: number;
    date_of_birth: string;
    gender: string;
    phone: string;
    address: string;
    relation: string;
    blood_type: string;
    user_id?: number;
}

export type User = {
    id: string;
    email: string;
    name: string;
    roles?: string[];
    created_at?: string;
    updated_at?: string;
}