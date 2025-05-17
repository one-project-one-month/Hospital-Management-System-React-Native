import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Patient {
  id: number;
  name: string;
  age: number;
  gender: string;
  image: string;
}

interface Doctor {
  name: string;
  specialization: string;
  image: string;
}

interface Appointment {
  id: number;
  patient: Patient;
  doctor: Doctor;
  date: string;
  time: string;
  status: 'upcoming' | 'completed';
  room: string;
}

const appointments: Appointment[] = [
  {
    id: 1,
    patient: {
      id: 1,
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    doctor: {
      name: 'Dr. Sarah Wilson',
      specialization: 'Cardiologist',
      image: 'https://randomuser.me/api/portraits/women/1.jpg',
    },
    date: '2024-03-20',
    time: '10:00 AM',
    status: 'upcoming',
    room: '304',
  },
  {
    id: 2,
    patient: {
      id: 1,
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    doctor: {
      name: 'Dr. Michael Brown',
      specialization: 'Neurologist',
      image: 'https://randomuser.me/api/portraits/men/2.jpg',
    },
    date: '2024-03-18',
    time: '2:30 PM',
    status: 'completed',
    room: '205',
  },
];

const patients: Patient[] = [
  {
    id: 1,
    name: 'John Doe',
    age: 45,
    gender: 'Male',
    image: 'https://randomuser.me/api/portraits/men/1.jpg',
  },
  // Add more patients here
];

const doctors = [
  { label: 'Dr. Sarah Wilson', value: '1' },
  { label: 'Dr. Michael Brown', value: '2' },
  { label: 'Dr. Emily Davis', value: '3' },
];

export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'completed'>('upcoming');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');

  const handleBookAppointment = () => {
    // Here you would typically make an API call to book the appointment
    console.log('Booking appointment:', {
      patient: selectedPatient,
      doctor: selectedDoctor,
      date: selectedDate,
      time: selectedTime,
    });
    setShowNewAppointmentModal(false);
    // Reset form
    setSelectedPatient('');
    setSelectedDoctor('');
    setSelectedDate('');
    setSelectedTime('');
  };

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.status === activeTab
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with New Appointment Button */}
      <View className="bg-white p-4 flex-row justify-between items-center">
        <Text className="text-xl font-bold text-gray-800">Appointments</Text>
        <Button variant="secondary" size="md" onPress={() => setShowNewAppointmentModal(true)}>New Appointment</Button>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white p-4">
        <TouchableOpacity
          className={`flex-1 py-2 rounded-full mr-2 ${
            activeTab === 'upcoming' ? 'bg-gray-800' : 'bg-gray-100'
          }`}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'upcoming' ? 'text-white' : 'text-gray-600'
            }`}
          >
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 rounded-full ml-2 ${
            activeTab === 'completed' ? 'bg-gray-800' : 'bg-gray-100'
          }`}
          onPress={() => setActiveTab('completed')}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'completed' ? 'text-white' : 'text-gray-600'
            }`}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView className="flex-1 p-4">
        {filteredAppointments.map((appointment) => (
          <View
            key={appointment.id}
            className="bg-white p-4 rounded-xl shadow-sm mb-4"
          >
            <View className="flex-row items-center">
              <Image
                source={{ uri: appointment.doctor.image }}
                className="w-16 h-16 rounded-full"
              />
              <View className="ml-4 flex-1">
                <Text className="font-semibold text-gray-800 text-lg">
                  {appointment.doctor.name}
                </Text>
                <Text className="text-gray-500">
                  {appointment.doctor.specialization}
                </Text>
              </View>
              <View
                className={`px-3 py-1 rounded-full ${
                  appointment.status === 'upcoming'
                    ? 'bg-blue-100'
                    : 'bg-green-100'
                }`}
              >
                <Text
                  className={`${
                    appointment.status === 'upcoming'
                      ? 'text-blue-600'
                      : 'text-green-600'
                  }`}
                >
                  {appointment.status.charAt(0).toUpperCase() +
                    appointment.status.slice(1)}
                </Text>
              </View>
            </View>

            <View className="mt-4 flex-row items-center">
              <View className="flex-row items-center flex-1">
                <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                <Text className="text-gray-500 ml-2">{appointment.date}</Text>
              </View>
              <View className="flex-row items-center flex-1">
                <Ionicons name="time-outline" size={20} color="#6b7280" />
                <Text className="text-gray-500 ml-2">{appointment.time}</Text>
              </View>
              <View className="flex-row items-center flex-1">
                <Ionicons name="location-outline" size={20} color="#6b7280" />
                <Text className="text-gray-500 ml-2">Room {appointment.room}</Text>
              </View>
            </View>

            {appointment.status === 'upcoming' && (
              <View className="flex-row mt-4">
                <Button variant="danger" size="md" className='flex-1 mr-2' onPress={() => alert("Cancel")}>Cancel</Button>
                <Button variant="secondary" size="md" className='flex-1' onPress={() => alert("Reschedule")}>Reschedule</Button>
              </View>
            )}
          </View>
        ))}
      </ScrollView>

      {/* New Appointment Modal */}
      <Modal
        visible={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        title="New Appointment"
      >
        <Select
          label="Select Patient"
          value={selectedPatient}
          onChange={setSelectedPatient}
          options={patients.map(p => ({ label: p.name, value: p.id.toString() }))}
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
    </View>
  );
} 