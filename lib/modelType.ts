export type PatientState = {
    patient: any;
    storePatient: (patient: any) => void;
};

export type Patient = {
    name: string;
    age: number;
    date_of_birth: string;
    gender: string;
    phone: string;
    address: string;
    relation: string;
    blood_type: string;
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
