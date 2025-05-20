import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { NotFound } from '@/components/ui/NotFound';
import { Patient } from '@/lib/modelType';
import { usePatient } from '@/lib/store/usePatient';
import { Ionicons } from '@expo/vector-icons';
import axios from 'axios';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useEffect, useState } from 'react';
import { Alert, Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Toaster } from 'sonner-native';


const API_URL = 'https://one-pj-one-month-may-hms-laravel.newway.com.mm/api/v1';

export default function PatientManagementScreen() {
  const router = useRouter();
  const { patients, getPatient } = usePatient();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      await getPatient();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        await getPatient();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPatient();
  }, []);


  const handleDeletePatient = (id: string) => {
    const patient = patients?.find(p => p.id === id);
    console.log('Found patient for delete:', JSON.stringify(patient, null, 2));
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
          onPress: async () => {
            try {
              const token = await SecureStore.getItemAsync('token');
              if (token) {
                axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
                await axios.delete(`${API_URL}/patient-profile/${id}`);
                await getPatient(); // Refresh the list
              }
            } catch (error) {
              Alert.alert("Error", "Failed to delete patient");
            }
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
      <View className="bg-white px-4 pt-2 pb-4 flex-row justify-between items-center border-b border-gray-100">
        <Text className="text-2xl font-bold text-gray-800">Patients</Text>
        <Button
          variant="secondary"
          size="sm"
          onPress={() => router.push('/patient/create')}
        >
          <Ionicons name="add" size={20} color="white" />
        </Button>
      </View>

      {loading ? (
        <Loading />
      ) : patients.length === 0 ? (
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          <NotFound message="No patients found" />
        </ScrollView>
      ) : (
        <ScrollView 
          className="flex-1"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
        {patients.map((patient) => (
          <TouchableOpacity
            key={patient.id}
            onPress={() => handleEditPatient(patient)}
            className="bg-white border-b border-gray-100"
          >
            <View className="p-4">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: `https://ui-avatars.com/api/?name=${patient.name}&background=000&color=fff&length=2` }}
                  className="w-12 h-12 rounded-full"
                />
                <View className="ml-3 flex-1">
                  <View className="flex-row items-center justify-between">
                    <View>
                      <Text className="text-base font-semibold text-gray-800">
                        {patient.name}
                      </Text>
                      <Text className="text-sm text-gray-500">
                        {patient.age} years • {patient.gender}
                      </Text>
                    </View>
                    <View className="flex-row">
                      <TouchableOpacity
                        onPress={() => handleEditPatient(patient)}
                        className="p-2"
                      >
                        <Ionicons name="create-outline" size={18} color="#6b7280" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => handleDeletePatient(patient.id)}
                        className="p-2"
                      >
                        <Ionicons name="trash-outline" size={18} color="#ef4444" />
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="call-outline" size={14} color="#6b7280" />
                    <Text className="text-sm text-gray-500 ml-1">{patient.phone}</Text>
                    <Text className="text-gray-300 mx-2">•</Text>
                    <Ionicons name="location-outline" size={14} color="#6b7280" />
                    <Text className="text-sm text-gray-500 ml-1">{patient.address}</Text>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}
        </ScrollView>
      )}
      <Toaster position="bottom-center" />
    </View>
  );
}