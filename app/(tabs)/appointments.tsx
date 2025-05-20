import { Button } from '@/components/ui/Button';
import { Loading } from '@/components/ui/Loading';
import { Modal } from '@/components/ui/Modal';
import { NotFound } from '@/components/ui/NotFound';
import { Select } from '@/components/ui/Select';
import { useAppointmentStore } from '@/lib/store/appointmentStore';
import { useDoctor } from '@/lib/store/useDoctor';
import { usePatient } from '@/lib/store/usePatient';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useEffect, useState } from 'react';
import { Image, RefreshControl, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { Toaster, toast } from 'sonner-native';
export default function AppointmentsScreen() {
  const [activeTab, setActiveTab] = useState<'pending' | 'confirmed'>('pending');
  const [showNewAppointmentModal, setShowNewAppointmentModal] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);

  const {
    selectedDoctor,
    selectedDate,
    selectedTime,
    selectedPatient,
    availableTimeSlots,
    isLoading,
    error,
    selectDoctor,
    selectDate,
    selectTime,
    selectPatient,
    bookAppointment,
    getAppointments,
    appointments,
  } = useAppointmentStore();

  const { getDoctor, doctors } = useDoctor();
  const { getPatient, patients } = usePatient();
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const onAppointmentRefresh = async () => {
    setRefreshing(true);
    try {
      await getAppointments(); // or any data fetching logic
    } catch (error) {
      console.log(error);
    } finally {
      setRefreshing(false);
    }
  };
  
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
    const handleGetAppointments = async () => {
      setLoading(true);
      try {
        await getAppointments();
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    }
    handleGetAppointments();
    getPatient();
  }, [getAppointments, getDoctor, getPatient]);

  const handleBookAppointment = async () => {
    try {
      await bookAppointment();
      setShowNewAppointmentModal(false);
      toast.success('Appointment booked successfully');
    } catch (error) {
      console.log(error);
      toast.error('Failed to book appointment');
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      selectDate(formattedDate);
    }
  };

  const filteredAppointments = appointments.filter(
    (appointment) => appointment.status === activeTab
  );

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header with New Appointment Button */}
      <View className="bg-white p-4 flex-row justify-between items-center" >
        <Text className="text-xl font-bold text-gray-800">Appointments</Text>
        <Button variant="secondary" size="md" onPress={() => setShowNewAppointmentModal(true)}>New Appointment</Button>
      </View>

      {/* Tabs */}
      <View className="flex-row bg-white p-4">
        <TouchableOpacity
          className={`flex-1 py-2 rounded-full mr-2 ${
            activeTab === 'pending' ? 'bg-gray-800' : 'bg-gray-100'
          }`}
          onPress={() => setActiveTab('pending')}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'pending' ? 'text-white' : 'text-gray-600'
            }`}
          >
            Pending
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`flex-1 py-2 rounded-full ml-2 ${
            activeTab === 'confirmed' ? 'bg-gray-800' : 'bg-gray-100'
          }`}
          onPress={() => setActiveTab('confirmed')}
        >
          <Text
            className={`text-center font-semibold ${
              activeTab === 'confirmed' ? 'text-white' : 'text-gray-600'
            }`}
          >
            Completed
          </Text>
        </TouchableOpacity>
      </View>

      {/* Appointments List */}
      {loading ? (
        <Loading />
      ) : filteredAppointments.length === 0 ? (
        <ScrollView 
          className="flex-1"
          contentContainerStyle={{ flex: 1 }}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onAppointmentRefresh} />
          }
        >
          <NotFound message={`No ${activeTab} appointments found`} />
        </ScrollView>
      ) : (
        <ScrollView 
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onAppointmentRefresh} />
        }
        >
          {filteredAppointments.map((appointment) => (
            <View
              key={appointment.id}
              className="bg-white p-4 rounded-xl shadow-sm mb-4"
            >
              <View className="flex-row items-center">
                <Image
                  source={{ uri: `https://ui-avatars.com/api/?name=${appointment.doctor?.name}&background=000&color=fff&length=2` }}
                  className="w-16 h-16 rounded-full"
                />
                <View className="ml-4 flex-1">
                  <Text className="font-semibold text-gray-800 text-lg">
                    {appointment.doctor.name}
                  </Text>
                  <Text className="text-gray-500">
                    {appointment.doctor.specialty?.[0] || "No specialty"}
                  </Text>
                </View>
                <View
                  className={`px-3 py-1 rounded-full ${
                    appointment.status === 'pending'
                      ? 'bg-blue-100'
                      : 'bg-green-100'
                  }`}
                >
                  <Text
                    className={`${
                      appointment.status === 'pending'
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
                  <Text className="text-gray-500 ml-2">{appointment.appointment_date}</Text>
                </View>
                <View className="flex-row items-center flex-1">
                  <Ionicons name="time-outline" size={20} color="#6b7280" />
                  <Text className="text-gray-500 ml-2">{appointment.appointment_time}</Text>
                </View>
                <View className="flex-row items-center flex-1">
                  <Ionicons name="person-outline" size={20} color="#6b7280" />
                  <Text className="text-gray-500 ml-2">{appointment.patient_profile_name}</Text>
                </View>
              </View>

              {appointment.status === 'pending' && (
                <View className="flex-row mt-4">
                  <Button variant="danger" size="md" className='flex-1 mr-2' onPress={() => alert("Cancel")}>Cancel</Button>
                  <Button variant="secondary" size="md" className='flex-1' onPress={() => alert("Reschedule")}>Reschedule</Button>
                </View>
              )}
            </View>
          ))}
        </ScrollView>
      )}

      {/* New Appointment Modal */}
      <Modal
        visible={showNewAppointmentModal}
        onClose={() => setShowNewAppointmentModal(false)}
        title="New Appointment"
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
          disabled={!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime || isLoading}
        >
          {isLoading ? 'Booking...' : 'Book Appointment'}
        </Button>
        </ScrollView>
      </Modal>
      <Toaster position="bottom-center" />
    </View>
  );
} 