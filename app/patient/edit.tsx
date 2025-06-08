import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Patient } from '@/lib/modelType';
import { usePatient } from '@/lib/store/usePatient';
import { useToastContext } from '@phonehtut/react-native-sonner';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Keyboard, KeyboardAvoidingView, ScrollView, TouchableWithoutFeedback, View } from 'react-native';

export default function EditPatientScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { updatePatient } = usePatient();
  const { showToast } = useToastContext();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [patient, setPatient] = useState<Patient>({
    id: params.id as string,
    name: params.name as string,
    age: Number(params.age),
    gender: params.gender as string,
    phone: params.phone as string,
    address: params.address as string,
    relation: params.relation as string,
    date_of_birth: params.date_of_birth as string,
    blood_type: params.blood_type as string,
  });
  const [isLoading, setIsLoading] = useState(false);

  const genderOptions = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' }
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

  const handleEditPatient = async () => {
    if (patient.name && patient.age && patient.gender) {
      try {
        setIsLoading(true);
        await updatePatient({
          id: patient.id?.toString() || '',
          name: patient.name,
          age: patient.age,
          gender: patient.gender,
          phone: patient.phone || '',
          address: patient.address || '',
          relation: patient.relation || '',
          date_of_birth: patient.date_of_birth || '',
          blood_type: patient.blood_type || '',
        });
        showToast('Patient updated successfully', 'success');
        router.back();
      } catch (error: any) {
        console.error('Error updating patient:', error.response.data.message);
        showToast('Error updating patient', 'error');
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior="padding"
      className="flex-1 bg-gray-50"
      keyboardVerticalOffset={100}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1">

          <ScrollView className="flex-1 p-4"
            contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
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
              placeholder="Mother, Father, Sister, Brother, etc."
            />
            <Select
              label="Blood Type"
              value={patient.blood_type}
              onChange={(value) => setPatient({ ...patient, blood_type: value })}
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
              variant="secondary"
              onPress={handleEditPatient}
              disabled={!patient.name || !patient.age || !patient.gender}
              className="mt-4"
              isLoading={isLoading}
            >
              Save Changes
            </Button>
          </ScrollView>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
} 