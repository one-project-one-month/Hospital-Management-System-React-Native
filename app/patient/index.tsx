import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  image: string;
  phone: string;
  address: string;
  relation: string;
  date_of_birth: string;
  blood_type: string;
}

export default function PatientManagementScreen() {
  const router = useRouter();
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: 1,
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
      phone: '+1234567890',
      address: '123 Main St, City',
      relation: 'Father',
      date_of_birth: '1978-01-01',
      blood_type: 'O+',
    },
    {
      id: 2,
      name: 'Jane Smith',
      age: 32,
      gender: 'Female',
      image: 'https://randomuser.me/api/portraits/women/2.jpg',
      phone: '+1987654321',
      address: '456 Oak St, Town',
      relation: 'Mother',
      date_of_birth: '1991-01-01',
      blood_type: 'A+',
    },
  ]);

  const handleDeletePatient = (id: number) => {
    const patient = patients.find(p => p.id === id);
    Alert.alert(
      "Delete Patient",
      `Are you sure you want to delete ${patient?.name}?`,
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => {
            setPatients(patients.filter((p) => p.id !== id));
          },
        },
      ],
      { cancelable: true }
    );
  };

  const handleEditPatient = (patient: Patient) => {
    router.push({
      pathname: '/patient/edit',
      params: {
        id: patient.id.toString(),
        name: patient.name,
        age: patient.age.toString(),
        gender: patient.gender,
        phone: patient.phone,
        address: patient.address,
        relation: patient.relation,
        date_of_birth: patient.date_of_birth,
        blood_type: patient.blood_type,
      }
    });
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-gray-800">Patient Management</Text>
        <Button
          variant="secondary"
          onPress={() => router.push('/patient/create')}
        >
          Add Patient
        </Button>
      </View>

      <ScrollView className="flex-1 p-4">
        {patients.map((patient) => (
          <View
            key={patient.id}
            className="bg-white p-4 rounded-xl shadow-sm mb-4"
          >
            <View className="flex-row items-center">
              <Image
                source={{ uri: patient.image }}
                className="w-16 h-16 rounded-full"
              />
              <View className="ml-4 flex-1">
                <Text className="font-semibold text-gray-800 text-lg">
                  {patient.name}
                </Text>
                <Text className="text-gray-500">
                  {patient.age} years • {patient.gender}
                </Text>
                <Text className="text-gray-500">{patient.phone}</Text>
              </View>
              <View className="flex-row">
                <Button
                  variant="icon"
                  size="sm"
                  className="p-2"
                  onPress={() => handleEditPatient(patient)}
                >
                  <Ionicons name="create-outline" size={20} color="#6b7280" />
                </Button>
                <Button
                  variant="iconDanger"
                  size="sm"
                  className="p-2"
                  onPress={() => handleDeletePatient(patient.id)}
                >
                  <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </Button>
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
} 