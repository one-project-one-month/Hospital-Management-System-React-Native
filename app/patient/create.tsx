import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { usePatient } from '@/lib/store/usePatient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, Platform, ScrollView, Text, ToastAndroid, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';

export default function CreatePatientScreen() {
  const router = useRouter();
  const { storePatient } = usePatient();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [error, setError] = useState<any>({});
  const [newPatient, setNewPatient] = useState({
    name: '',
    age: 0,
    gender: '',
    phone: '',
    address: '',
    relation: '',
    date_of_birth: '',
    blood_type: '',
  });

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
  ];

  const bloodTypeOptions = [
    { label: 'A+', value: 'A+' },
    { label: 'A-', value: 'A-' },
    { label: 'B+', value: 'B+' },
    { label: 'B-', value: 'B-' },
    { label: 'AB+', value: 'AB+' },
    { label: 'AB-', value: 'AB-' },
    { label: 'O+', value: 'O+' },
    { label: 'O-', value: 'O-' },
  ];

  const handleAddPatient = async () => {
    if (newPatient.name && newPatient.age && newPatient.gender) {
      try {
        await storePatient({
          name: newPatient.name,
          age: newPatient.age,
          gender: newPatient.gender,
          phone: newPatient.phone || '',
          address: newPatient.address || '',
          relation: newPatient.relation || '',
          date_of_birth: newPatient.date_of_birth || '',
          blood_type: newPatient.blood_type || '',
        });
        router.back();
      } catch (error: any) {
        if (error.response?.data?.status === 'fail') {
          const validationErrors = error.response.data.data;
          setError({
            name: validationErrors.name?.[0],
            age: validationErrors.age?.[0],
            gender: validationErrors.gender?.[0],
            phone: validationErrors.phone?.[0],
            address: validationErrors.address?.[0],
            relation: validationErrors.relation?.[0],
            date_of_birth: validationErrors.date_of_birth?.[0],
            blood_type: validationErrors.blood_type?.[0],
          });
        } else {
          ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
        }
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
            <Text className="text-xl font-bold text-gray-800">Add New Patient</Text>
          </View>

          <ScrollView className="flex-1 p-4"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <Input
              label="Name"
              value={newPatient.name}
              onChangeText={(text) => setNewPatient({ ...newPatient, name: text })}
              placeholder="Enter name"
            />
            <Input
              label="Age"
              value={newPatient.age?.toString() || ''}
              onChangeText={(text) =>
                setNewPatient({ ...newPatient, age: parseInt(text) || 0 })
              }
              placeholder="Enter age"
              keyboardType="numeric"
            />
            <Select
              label="Gender"
              value={newPatient.gender}
              onChange={(value) => setNewPatient({ ...newPatient, gender: value })}
              options={genderOptions}
              placeholder="Select gender"
            />
            <Input
              label="Phone"
              value={newPatient.phone}
              onChangeText={(text) => setNewPatient({ ...newPatient, phone: text })}
              placeholder="Enter phone number"
              keyboardType="phone-pad"
            />
            <Input
              label="Address"
              value={newPatient.address}
              onChangeText={(text) => setNewPatient({ ...newPatient, address: text })}
              placeholder="Enter address"
            />
            <Input
              label="Relation"
              value={newPatient.relation}
              onChangeText={(text) => setNewPatient({ ...newPatient, relation: text })}
              placeholder="Enter relation"
              error={error.relation}
            />
            <Select
              label="Blood Type"
              value={newPatient.blood_type}
              onChange={(value) => setNewPatient({ ...newPatient, blood_type: value })}
              options={bloodTypeOptions}
              placeholder="Select blood type"
            />
            <Button
              variant="outline"
              onPress={() => setShowDatePicker(true)}
            >
              Select Date of Birth
            </Button>
            {showDatePicker && (
              <DateTimePicker
                value={new Date(newPatient.date_of_birth || new Date())}
                mode="date"
                display="default"
                onChange={(event: DateTimePickerEvent, selectedDate?: Date) => {
                  setShowDatePicker(false);
                  if (selectedDate) {
                    setNewPatient({
                      ...newPatient,
                      date_of_birth: selectedDate.toISOString().split('T')[0],
                    });
                  }
                }}
              />
            )}
            <Button
              variant="secondary"
              onPress={handleAddPatient}
              disabled={!newPatient.name || !newPatient.age || !newPatient.gender || !newPatient.relation || !newPatient.blood_type || !newPatient.date_of_birth}
              className="mt-4"
            >
              Add Patient
            </Button>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
} 