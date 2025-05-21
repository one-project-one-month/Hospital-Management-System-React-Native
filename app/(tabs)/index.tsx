import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useAuthStore } from '@/lib/store/auth';
import { Ionicons } from '@expo/vector-icons';
import { useToastContext } from '@phonehtut/react-native-sonner';
import { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

const patients = [
  { label: 'John Doe', value: '1' },
  { label: 'Jane Smith', value: '2' },
  { label: 'Mike Johnson', value: '3' },
];

const doctors = [
  { label: 'Dr. Sarah Wilson', value: '1' },
  { label: 'Dr. Michael Brown', value: '2' },
  { label: 'Dr. Emily Davis', value: '3' },
];

export default function HomeScreen() {
  const { user, isLoading } = useAuthStore();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const { showToast } = useToastContext();

  const handleBookAppointment = () => {
    // Here you would typically make an API call to book the appointment
    console.log('Booking appointment:', {
      patient: selectedPatient,
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
    });
    setShowBookingModal(false);
    // Reset form
    setSelectedPatient('');
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTime('');
  };

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Loading...</Text>
      </View>
    );
  }

  if (!user) {
    return (
      <View className="flex-1 items-center justify-center">
        <Text>Please login to continue</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView className="flex-1 bg-gray-50">
        <View className="p-6">
          {/* Header */}
          <View className="flex-row justify-between items-center mb-6">
            <View>
              <Text className="text-2xl font-bold text-gray-800">Hello, {user.name}</Text>
              <Text className="text-gray-500">Welcome back!</Text>
            </View>
            <IconButton
              variant="outline"
              size="sm"
              className="bg-white shadow-sm"
              onPress={() => {}}
              icon={<Ionicons name="notifications-outline" size={24} color="#1f2937" />}
            />
          </View>

          {/* Quick Actions */}
          <View className="mb-6">
            <Button
              variant="secondary"
              onPress={() => {
                showToast('Hello, World!', 'success');
              }}
              // onPress={() => setShowBookingModal(true)}
              icon={<Ionicons name="calendar-outline" size={24} color="white" />}
            >
              Book Appointment
            </Button>
          </View>

          {/* Upcoming Appointments */}
          <View className="mb-6">
            <Text className="text-xl font-bold text-gray-800 mb-4">Upcoming Appointments</Text>
            <View className="bg-white p-4 rounded-xl shadow-sm">
              <View className="flex-row items-center">
                <Image
                  source={{ uri: 'https://randomuser.me/api/portraits/men/1.jpg' }}
                  className="w-12 h-12 rounded-full"
                />
                <View className="ml-4 flex-1">
                  <Text className="font-semibold text-gray-800">Dr. Sarah Wilson</Text>
                  <Text className="text-gray-500">Cardiologist</Text>
                </View>
                <View className="bg-blue-100 px-3 py-1 rounded-full">
                  <Text className="text-blue-600 text-sm">Today</Text>
                </View>
              </View>
              <View className="flex-row items-center mt-4">
                <Ionicons name="time-outline" size={20} color="#6b7280" />
                <Text className="text-gray-500 ml-2">10:00 AM</Text>
                <Ionicons name="location-outline" size={20} color="#6b7280" className="ml-4" />
                <Text className="text-gray-500 ml-2">Room 304</Text>
              </View>
            </View>
          </View>

          {/* Recent Lab Results */}
          <View>
            <Text className="text-xl font-bold text-gray-800 mb-4">Recent Lab Results</Text>
            <View className="bg-white p-4 rounded-xl shadow-sm">
              <View className="flex-row justify-between items-center">
                <View>
                  <Text className="font-semibold text-gray-800">Blood Test</Text>
                  <Text className="text-gray-500">Completed 2 days ago</Text>
                </View>
                <Button variant="outline" size="sm" onPress={() => {}}>
                  View
                </Button>
              </View>
            </View>
          </View>
        </View>

        {/* Booking Modal */}
        <Modal
          visible={showBookingModal}
          onClose={() => setShowBookingModal(false)}
          title="Book Appointment"
        >
          <Select
            label="Select Patient"
            value={selectedPatient}
            onChange={setSelectedPatient}
            options={patients}
            placeholder="Choose a patient"
          />
          <Select
            label="Select Doctor"
            value={selectedDoctor}
            onChange={setSelectedDoctor}
            options={doctors}
            placeholder="Choose a doctor"
          />
          <Input
            label="Date"
            value={selectedDate}
            onChangeText={setSelectedDate}
            placeholder="Select date (YYYY-MM-DD)"
          />
          <Input
            label="Time"
            value={selectedTime}
            onChangeText={setSelectedTime}
            placeholder="Select time (HH:MM)"
          />
          <Button
            variant="primary"
            onPress={handleBookAppointment}
            disabled={!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime}
          >
            Book Appointment
          </Button>
        </Modal>
      </ScrollView>
    </View>
  );
} 