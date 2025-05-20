import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Modal } from "@/components/ui/Modal";
import { Select } from "@/components/ui/Select";
import { Doctor } from "@/lib/modelType";
import { useDoctor } from "@/lib/store/useDoctor";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";

const patients = [
  { label: "John Doe", value: "1" },
  { label: "Jane Smith", value: "2" },
  { label: "Mike Johnson", value: "3" },
];

export default function DoctorsScreen() {
  const { doctors, getDoctor, isLoading } = useDoctor();
  const [expandedDoctorId, setExpandedDoctorId] = useState<string | null>(null);

  useEffect(() => {
    const fetchDoctors = async () => {
      await getDoctor();
    };
    fetchDoctors();
  }, [getDoctor]);

  const [searchQuery, setSearchQuery] = useState("");
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedPatient, setSelectedPatient] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  const handleBookAppointment = () => {
    // Here you would typically make an API call to book the appointment
    console.log("Booking appointment:", {
      doctor: selectedDoctor,
      patient: selectedPatient,
      date: selectedDate,
      time: selectedTime,
    });
    setShowBookingModal(false);
    // Reset form
    setSelectedPatient("");
    setSelectedDate("");
    setSelectedTime("");
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
          {doctors.map((doctor) => {
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
                      setSelectedDoctor(doctor);
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
          })}
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
