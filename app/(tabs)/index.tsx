import { Button } from '@/components/ui/Button';
import { IconButton } from '@/components/ui/IconButton';
import { Modal } from '@/components/ui/Modal';
import { Select } from '@/components/ui/Select';
import { useAppointmentStore } from '@/lib/store/appointmentStore';
import { useAuthStore } from '@/lib/store/auth';
import { useDoctor } from '@/lib/store/useDoctor';
import { usePatient } from '@/lib/store/usePatient';
import { Ionicons } from '@expo/vector-icons';
import { useToastContext } from '@phonehtut/react-native-sonner';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';

export default function HomeScreen() {
  const { user, isLoading: authLoading } = useAuthStore();
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const { showToast } = useToastContext();

  const {
    selectedDoctor,
    selectedDate,
    selectedTime,
    selectedPatient,
    availableTimeSlots,
    isLoading: appointmentLoading,
    error,
    selectDoctor,
    selectDate,
    selectTime,
    selectPatient,
    bookAppointment,
  } = useAppointmentStore();

  const { getDoctor, doctors } = useDoctor();
  const { getPatient, patients } = usePatient();
  const [refreshing, setRefreshing] = useState(false);

  const onFormRefresh = async () => {
    setRefreshing(true);
    try {
      await getDoctor();
      await getPatient();
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    getDoctor();
    getPatient();
  }, [getDoctor, getPatient]);

  const handleBookAppointment = async () => {
    try {
      await bookAppointment();
      setShowBookingModal(false);
      showToast('Appointment booked successfully', 'success');
    } catch (error) {
      console.log(error);
      showToast('Failed to book appointment', 'error');
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      selectDate(formattedDate);
    }
  };

  if (authLoading) {
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
              onPress={() => setShowBookingModal(true)}
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
          <ScrollView
            refreshControl={
              <RefreshControl refreshing={refreshing} onRefresh={onFormRefresh} />
            }
          >
            <Select
              label="Select Patient"
              value={selectedPatient?.id || ''}
              onChange={(value) => {
                const patient = patients.find(p => p.id === value);
                if (patient) selectPatient(patient);
              }}
              options={patients.map(p => ({ label: p.name, value: p.id.toString() }))}
              placeholder="Choose a patient"
            />
            
            <Select
              label="Select Doctor"
              value={selectedDoctor?.id || ''}
              onChange={(value) => {
                const doctor = doctors.find(d => d.id === value);
                if (doctor) selectDoctor(doctor);
              }}
              options={doctors.map(d => ({ label: d.name, value: d.id }))}
              placeholder="Choose a doctor"
            />

            <TouchableOpacity
              onPress={() => setShowDatePicker(true)}
              className="mb-4"
            >
              <Text className="text-sm font-medium text-gray-700 mb-1">Date</Text>
              <View className="border border-gray-300 rounded-md p-3">
                <Text className="text-gray-500">
                  {selectedDate || 'Select date'}
                </Text>
              </View>
            </TouchableOpacity>

            {showDatePicker && (
              <DateTimePicker
                value={selectedDate ? new Date(selectedDate) : new Date()}
                mode="date"
                display="default"
                onChange={handleDateChange}
                minimumDate={new Date()}
                maximumDate={new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)}
              />
            )}

            {selectedDate && availableTimeSlots.length > 0 && (
              <View className="mb-4">
                <Text className="text-sm font-medium text-gray-700 mb-2">Available Time Slots</Text>
                <View className="flex-row flex-wrap">
                  {availableTimeSlots.map((slot) => (
                    <TouchableOpacity
                      key={slot.time}
                      onPress={() => slot.isAvailable && selectTime(slot.time)}
                      className={`mr-2 mb-2 px-3 py-2 rounded-md ${
                        slot.isAvailable
                          ? selectedTime === slot.time
                            ? 'bg-blue-500'
                            : 'bg-gray-200'
                          : 'bg-gray-100 opacity-50'
                      }`}
                      disabled={!slot.isAvailable}
                    >
                      <Text
                        className={`${
                          slot.isAvailable
                            ? selectedTime === slot.time
                              ? 'text-white'
                              : 'text-gray-700'
                            : 'text-gray-500'
                        }`}
                      >
                        {slot.time}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            )}

            {error && (
              <Text className="text-red-500 mb-4">{error}</Text>
            )}

            <Button
              variant="primary"
              onPress={handleBookAppointment}
              disabled={!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime || appointmentLoading}
            >
              {appointmentLoading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </ScrollView>
        </Modal>
      </ScrollView>
    </View>
  );
} 