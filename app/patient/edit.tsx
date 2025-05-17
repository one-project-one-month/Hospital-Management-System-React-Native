import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { usePatient } from '@/lib/store/usePatient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  phone: string;
  address: string;
  relation: string;
  date_of_birth: string;
  blood_type: string;
}

export default function EditPatientScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { storePatient } = usePatient();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [patient, setPatient] = useState<Patient>({
    id: Number(params.id),
    name: params.name as string,
    age: Number(params.age),
    gender: params.gender as string,
    phone: params.phone as string,
    address: params.address as string,
    relation: params.relation as string,
    date_of_birth: params.date_of_birth as string,
    blood_type: params.blood_type as string,
  });

  const genderOptions = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
  ];

  const handleEditPatient = async () => {
    if (patient.name && patient.age && patient.gender) {
      try {
        await storePatient({
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone || '',
          address: patient.address || '',
          relation: patient.relation || '',
          date_of_birth: patient.date_of_birth || '',
          blood_type: patient.blood_type || '',
        });
        router.back();
      } catch (error) {
        console.error('Error updating patient:', error);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-gray-50"
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">
          {/* Header */}
          <View className="bg-white p-4 flex-row items-center border-b border-gray-200">
            <TouchableOpacity onPress={() => router.back()} className="mr-4">
              <Ionicons name="arrow-back" size={24} color="#374151" />
            </TouchableOpacity>
            <Text className="text-xl font-bold text-gray-800">Edit Patient</Text>
          </View>

          <ScrollView className="flex-1 p-4"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <Input
              label="Name"
              value={patient.name}
              onChangeText={(text) => setPatient({ ...patient, name: text })}
              placeholder="Enter name"
            />
            <Input
              label="Age"
              value={patient.age?.toString() || ''}
              onChangeText={(text) =>
                setPatient({ ...patient, age: parseInt(text) || 0 })
              }
              placeholder="Enter age"
              keyboardType="numeric"
            />
            <Select
              label="Gender"
              value={patient.gender}
              onChange={(value) => setPatient({ ...patient, gender: value })}
              options={genderOptions}
              placeholder="Select gender"
            />
            <Input
              label="Phone"
              value={patient.phone}
              onChangeText={(text) => setPatient({ ...patient, phone: text })}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
            <Input
              label="Address"
              value={patient.address}
              onChangeText={(text) => setPatient({ ...patient, address: text })}
              placeholder="Enter address"
            />
            <Input
              label="Relation"
              value={patient.relation}
              onChangeText={(text) => setPatient({ ...patient, relation: text })}
              placeholder="Enter relation"
            />
            <Input
              label="Blood Type"
              value={patient.blood_type}
              onChangeText={(text) => setPatient({ ...patient, blood_type: text })}
              placeholder="Enter blood type"
            />
            <Button
              variant="outline"
              onPress={() => setShowDatePicker(true)}
            >
              Select Date of Birth
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(patient.date_of_birth || new Date())}
                mode="date"
                display="default"
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setPatient({
                      ...patient,
                      date_of_birth: selectedDate.toISOString().split('T')[0],
                    });
                  }
                }}
              />
            )}
            <Button
              variant="primary"
              onPress={handleEditPatient}
              disabled={!patient.name || !patient.age || !patient.gender}
              className="mt-4"
            >
              Save Changes
            </Button>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
} 