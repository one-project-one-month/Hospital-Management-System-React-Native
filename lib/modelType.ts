export type PatientState = {
    patients: Patient[];
    storePatient: (patient: any) => void;
    getPatient: () => void;
};

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

export type AuthState = {
    user: User | null;
    isLoading: boolean;
    token: string | null;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, name: string) => Promise<void>;
    logout: () => Promise<void>;
    initialize: () => Promise<void>;
}
