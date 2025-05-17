import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface MedicalRecord {
  id: number;
  date: string;
  doctorName: string;
  diagnosis: string;
  prescription: string[];
  notes: string;
  followUpDate?: string;
}

const medicalRecords: MedicalRecord[] = [
  {
    id: 1,
    date: '2024-03-15',
    doctorName: 'Dr. Sarah Wilson',
    diagnosis: 'Hypertension',
    prescription: ['Amlodipine 5mg', 'Lisinopril 10mg'],
    notes: 'Patient shows signs of high blood pressure. Regular monitoring required.',
    followUpDate: '2024-04-15',
  },
  {
    id: 2,
    date: '2024-02-20',
    doctorName: 'Dr. Michael Brown',
    diagnosis: 'Type 2 Diabetes',
    prescription: ['Metformin 500mg', 'Glimepiride 2mg'],
    notes: 'Blood sugar levels elevated. Dietary changes recommended.',
    followUpDate: '2024-03-20',
  },
];

export default function MedicalHistoryScreen() {
  const [selectedRecord, setSelectedRecord] = useState<MedicalRecord | null>(null);

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4">
        <Text className="text-xl font-bold text-gray-800">Medical History</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {medicalRecords.map((record) => (
          <TouchableOpacity
            key={record.id}
            className="bg-white p-4 rounded-xl shadow-sm mb-4"
            onPress={() => setSelectedRecord(record)}
          >
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="font-semibold text-gray-800 text-lg">
                  {record.diagnosis}
                </Text>
                <Text className="text-gray-500">{record.doctorName}</Text>
              </View>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-600">{record.date}</Text>
              </View>
            </View>

            <View className="mt-4">
              <Text className="text-gray-600 mb-2">Prescription</Text>
              {record.prescription.map((med, index) => (
                <Text key={index} className="text-gray-800">
                  • {med}
                </Text>
              ))}
            </View>

            {record.followUpDate && (
              <View className="mt-4 flex-row items-center">
                <Ionicons name="calendar-outline" size={20} color="#6b7280" />
                <Text className="text-gray-500 ml-2">
                  Follow-up: {record.followUpDate}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Detailed View Modal */}
      {selectedRecord && (
        <View className="absolute inset-0 bg-black/50 justify-center p-4">
          <View className="bg-white rounded-2xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Medical Record Details
              </Text>
              <TouchableOpacity onPress={() => setSelectedRecord(null)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Date</Text>
              <Text className="text-gray-800 text-lg">{selectedRecord.date}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Doctor</Text>
              <Text className="text-gray-800 text-lg">{selectedRecord.doctorName}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Diagnosis</Text>
              <Text className="text-gray-800 text-lg">{selectedRecord.diagnosis}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Prescription</Text>
              {selectedRecord.prescription.map((med, index) => (
                <Text key={index} className="text-gray-800 text-lg mb-1">
                  • {med}
                </Text>
              ))}
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Notes</Text>
              <Text className="text-gray-800 text-lg">{selectedRecord.notes}</Text>
            </View>

            {selectedRecord.followUpDate && (
              <View className="mb-6">
                <Text className="text-gray-600 mb-1">Follow-up Date</Text>
                <Text className="text-gray-800 text-lg">{selectedRecord.followUpDate}</Text>
              </View>
            )}

            <TouchableOpacity
              className="bg-blue-600 p-4 rounded-lg"
              onPress={() => setSelectedRecord(null)}
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
} 