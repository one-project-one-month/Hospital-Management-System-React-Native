import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Loading } from "@/components/ui/Loading";
import { Modal } from "@/components/ui/Modal";
import { NotFound } from "@/components/ui/NotFound";
import { Select } from "@/components/ui/Select";
import { useAppointmentStore } from "@/lib/store/appointmentStore";
import { useDoctor } from "@/lib/store/useDoctor";
import { usePatient } from "@/lib/store/usePatient";
import { Ionicons } from "@expo/vector-icons";
import { useToastContext } from "@phonehtut/react-native-sonner";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useEffect, useState } from "react";
import { Image, Pressable, RefreshControl, ScrollView, Text, TouchableOpacity, View } from "react-native";

const patients = [
  { label: "John Doe", value: "1" },
  { label: "Jane Smith", value: "2" },
  { label: "Mike Johnson", value: "3" },
];

export default function DoctorsScreen() {
  const { doctors, getDoctor } = useDoctor();
  const { getPatient, patients } = usePatient();
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

  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);

  const fetchDoctors = async () => {
    setIsLoading(true);
    await getDoctor();
    setIsLoading(false);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchDoctors();
    setRefreshing(false);
  };

  useEffect(() => {
    fetchDoctors();
  }, [getDoctor]);

  const [searchQuery, setSearchQuery] = useState("");

  const handleBookAppointment = async () => {
    if (!selectedPatient || !selectedDoctor || !selectedDate || !selectedTime) {
      showToast('Please fill in all required fields', 'error');
      return;
    }

    try {
      await bookAppointment();
      setShowBookingModal(false);
      showToast('Appointment booked successfully', 'success');
    } catch (error: any) {
      console.log(error);
      const errorMessage = error.response?.data?.message || 'Failed to book appointment';
      showToast(errorMessage, 'error');
    }
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      const formattedDate = date.toISOString().split('T')[0];
      selectDate(formattedDate);
    }
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
          enterKeyHint="search"
          inputMode="search"
        />
      </View>

      <ScrollView 
        className="flex-1 p-4"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Specializations */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="mb-6"
        >
          <Button
            variant="primary"
            size="sm"
            className="mr-3"
            onPress={() => {}}
          >
            All
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="mr-3"
            onPress={() => {}}
          >
            Cardiologist
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="mr-3"
            onPress={() => {}}
          >
            Neurologist
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="mr-3"
            onPress={() => {}}
          >
            Pediatrician
          </Button>
        </ScrollView>

        {/* Doctors List */}
        <View className="space-y-3">
          {isLoading ? (
            <Loading />
          ) : doctors.length === 0 ? (
            <NotFound message="No doctors found" />
          ) : (
            doctors.map((doctor) => {
            const hasDetails = !!doctor.phone || !!doctor.email || (doctor.specialty && doctor.specialty.length > 1);
            return (
              <View key={doctor.id} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <View className="flex-row items-center p-4">
                  {/* Dropdown chevron at the very left, only if there are details */}
                  {hasDetails ? (
                    <Pressable onPress={() => setExpandedDoctorId(expandedDoctorId === doctor.id ? null : doctor.id)} className="mr-2">
                      <Ionicons name={expandedDoctorId === doctor.id ? "chevron-up" : "chevron-down"} size={22} color="#6b7280" />
                    </Pressable>
                  ) : (
                    <View style={{ width: 24, marginRight: 8 }} />
                  )}
                  {/* Avatar */}
                  <Image
                    source={{
                      uri: `https://ui-avatars.com/api/?name=${doctor?.name}&background=000&color=fff&length=2`,
                    }}
                    className="w-16 h-16 rounded-full border border-gray-100"
                  />
                  {/* Name, exp, specialty stacked */}
                  <View className="ml-3 flex-1">
                    <Text className="font-bold text-gray-900 text-lg">Dr. {doctor.name}</Text>
                    <View className="flex-row items-center mt-1">
                      <View className="flex-row items-center bg-amber-50 px-2 py-1 rounded-full mr-2">
                        <Ionicons name="star" size={14} color="#f59e0b" />
                        <Text className="text-amber-600 text-sm ml-1">{new Date().getFullYear() - doctor.experience_years} years</Text>
                      </View>
                      <Text className="text-gray-500 text-sm">{doctor.specialty?.[0] || "No specialty"}</Text>
                    </View>
                  </View>
                  {/* Book button */}
                  <Button
                    variant="primary"
                    size="sm"
                    className="px-3 ml-2"
                    onPress={() => {
                      selectDoctor(doctor);
                      setShowBookingModal(true);
                    }}
                  >
                    Book
                  </Button>
                </View>
                {/* Expanded Details */}
                {expandedDoctorId === doctor.id && hasDetails && (
                  <View className="px-4 pb-4 border-t border-gray-100">
                    <View className="space-y-3 mt-3">
                      {doctor.phone && (
                        <View className="flex-row items-center">
                          <Ionicons name="call-outline" size={18} color="#6b7280" />
                          <Text className="text-gray-600 ml-2">{doctor.phone}</Text>
                        </View>
                      )}
                      {doctor.email && (
                        <View className="flex-row items-center">
                          <Ionicons name="mail-outline" size={18} color="#6b7280" />
                          <Text className="text-gray-600 ml-2">{doctor.email}</Text>
                        </View>
                      )}
                      {doctor.specialty && doctor.specialty.length > 1 && (
                        <View className="flex-row items-start">
                          <Ionicons name="medical-outline" size={18} color="#6b7280" className="mt-1" />
                          <View className="ml-2 flex-1">
                            <Text className="text-gray-600 mb-1">Specialties:</Text>
                            <View className="flex-row flex-wrap gap-1">
                              {doctor.specialty.map((spec, index) => (
                                <View key={index} className="bg-gray-100 px-2 py-1 rounded-full">
                                  <Text className="text-gray-600 text-sm">{spec}</Text>
                                </View>
                              ))}
                            </View>
                          </View>
                        </View>
                      )}
                    </View>
                  </View>
                )}
              </View>
            );
            })
          )}
        </View>
      </ScrollView>

      {/* Booking Modal */}
      <Modal
        visible={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        title="Book Appointment"
      >
        <ScrollView>
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
    </View>
  );
}
