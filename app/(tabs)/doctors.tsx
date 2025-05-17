import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, Text, View } from 'react-native';

interface Doctor {
  id: number;
  name: string;
  specialization: string;
  experience: string;
  rating: number;
  image: string;
}

const doctors: Doctor[] = [
  {
    id: 1,
    name: 'Dr. Sarah Wilson',
    specialization: 'Cardiologist',
    experience: '15 years',
    rating: 4.8,
    image: 'https://randomuser.me/api/portraits/women/1.jpg',
  },
  {
    id: 2,
    name: 'Dr. Michael Brown',
    specialization: 'Neurologist',
    experience: '12 years',
    rating: 4.9,
    image: 'https://randomuser.me/api/portraits/men/2.jpg',
  },
  {
    id: 3,
    name: 'Dr. Emily Davis',
    specialization: 'Pediatrician',
    experience: '10 years',
    rating: 4.7,
    image: 'https://randomuser.me/api/portraits/women/3.jpg',
  },
];

const patients = [
  { label: 'John Doe', value: '1' },
  { label: 'Jane Smith', value: '2' },
  { label: 'Mike Johnson', value: '3' },
];

export default function DoctorsScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleBookAppointment = () => {
    // Here you would typically make an API call to book the appointment
    console.log('Booking appointment:', {
      doctor: selectedDoctor,
      patient: selectedPatient,
      date: selectedDate,
      time: selectedTime,
    });
    setShowBookingModal(false);
    // Reset form
    setSelectedPatient('');
    setSelectedDate('');
    setSelectedTime('');
    setSelectedDoctor(null);
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Search Bar */}
      <View className="p-4 bg-white">
        <Input
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search doctors..."
          className="bg-gray-100"
        />
      </View>

      <ScrollView className="flex-1 p-4">
        {/* Specializations */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          <Button variant="primary" size="sm" className="mr-3" onPress={() => {}}>
            All
          </Button>
          <Button variant="outline" size="sm" className="mr-3" onPress={() => {}}>
            Cardiologist
          </Button>
          <Button variant="outline" size="sm" className="mr-3" onPress={() => {}}>
            Neurologist
          </Button>
          <Button variant="outline" size="sm" className="mr-3" onPress={() => {}}>
            Pediatrician
          </Button>
        </ScrollView>

        {/* Doctors List */}
        <View className="space-y-4">
          {doctors.map((doctor) => (
            <View
              key={doctor.id}
              className="bg-white p-4 rounded-xl shadow-sm"
            >
              <View className="flex-row items-center">
                <Image
                  source={{ uri: doctor.image }}
                  className="w-16 h-16 rounded-full"
                />
                <View className="ml-4 flex-1">
                  <Text className="font-semibold text-gray-800 text-lg">
                    {doctor.name}
                  </Text>
                  <Text className="text-gray-500">{doctor.specialization}</Text>
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="star" size={16} color="#fbbf24" />
                    <Text className="text-gray-600 ml-1">{doctor.rating}</Text>
                    <Text className="text-gray-400 ml-2">•</Text>
                    <Text className="text-gray-500 ml-2">{doctor.experience} experience</Text>
                  </View>
                </View>
                <Button
                  variant="secondary"
                  size="sm"
                  onPress={() => {
                    setSelectedDoctor(doctor);
                    setShowBookingModal(true);
                  }}
                >
                Book
                </Button>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

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
          disabled={!selectedPatient || !selectedDate || !selectedTime}
        >
          Book Appointment
        </Button>
      </Modal>
    </View>
  );
} 