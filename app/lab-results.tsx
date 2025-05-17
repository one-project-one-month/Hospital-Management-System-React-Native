import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface LabResult {
  id: number;
  date: string;
  testName: string;
  labName: string;
  results: {
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'normal' | 'high' | 'low';
  }[];
  notes: string;
}

const labResults: LabResult[] = [
  {
    id: 1,
    date: '2024-03-10',
    testName: 'Complete Blood Count (CBC)',
    labName: 'City Medical Laboratory',
    results: [
      {
        parameter: 'Hemoglobin',
        value: '14.2',
        unit: 'g/dL',
        referenceRange: '13.5-17.5',
        status: 'normal',
      },
      {
        parameter: 'White Blood Cells',
        value: '11.5',
        unit: 'x10^9/L',
        referenceRange: '4.5-11.0',
        status: 'high',
      },
      {
        parameter: 'Platelets',
        value: '250',
        unit: 'x10^9/L',
        referenceRange: '150-450',
        status: 'normal',
      },
    ],
    notes: 'Slight elevation in WBC count, may indicate mild infection.',
  },
  {
    id: 2,
    date: '2024-02-15',
    testName: 'Lipid Panel',
    labName: 'City Medical Laboratory',
    results: [
      {
        parameter: 'Total Cholesterol',
        value: '220',
        unit: 'mg/dL',
        referenceRange: '<200',
        status: 'high',
      },
      {
        parameter: 'HDL Cholesterol',
        value: '45',
        unit: 'mg/dL',
        referenceRange: '>40',
        status: 'normal',
      },
      {
        parameter: 'LDL Cholesterol',
        value: '140',
        unit: 'mg/dL',
        referenceRange: '<100',
        status: 'high',
      },
    ],
    notes: 'Elevated cholesterol levels. Dietary changes recommended.',
  },
];

export default function LabResultsScreen() {
  const [selectedResult, setSelectedResult] = useState<LabResult | null>(null);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'low':
        return 'text-yellow-600 bg-yellow-100';
      default:
        return 'text-green-600 bg-green-100';
    }
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-white p-4">
        <Text className="text-xl font-bold text-gray-800">Lab Results</Text>
      </View>

      <ScrollView className="flex-1 p-4">
        {labResults.map((result) => (
          <TouchableOpacity
            key={result.id}
            className="bg-white p-4 rounded-xl shadow-sm mb-4"
            onPress={() => setSelectedResult(result)}
          >
            <View className="flex-row justify-between items-start">
              <View>
                <Text className="font-semibold text-gray-800 text-lg">
                  {result.testName}
                </Text>
                <Text className="text-gray-500">{result.labName}</Text>
              </View>
              <View className="bg-blue-100 px-3 py-1 rounded-full">
                <Text className="text-blue-600">{result.date}</Text>
              </View>
            </View>

            <View className="mt-4">
              {result.results.slice(0, 2).map((item, index) => (
                <View key={index} className="flex-row items-center mb-2">
                  <View className="flex-1">
                    <Text className="text-gray-600">{item.parameter}</Text>
                    <Text className="text-gray-800">
                      {item.value} {item.unit}
                    </Text>
                  </View>
                  <View
                    className={`px-3 py-1 rounded-full ${getStatusColor(
                      item.status
                    )}`}
                  >
                    <Text className="capitalize">{item.status}</Text>
                  </View>
                </View>
              ))}
              {result.results.length > 2 && (
                <Text className="text-blue-600 text-center mt-2">
                  +{result.results.length - 2} more results
                </Text>
              )}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Detailed View Modal */}
      {selectedResult && (
        <View className="absolute inset-0 bg-black/50 justify-center p-4">
          <View className="bg-white rounded-2xl p-6">
            <View className="flex-row justify-between items-center mb-6">
              <Text className="text-xl font-bold text-gray-800">
                Lab Result Details
              </Text>
              <TouchableOpacity onPress={() => setSelectedResult(null)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Test Name</Text>
              <Text className="text-gray-800 text-lg">{selectedResult.testName}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Laboratory</Text>
              <Text className="text-gray-800 text-lg">{selectedResult.labName}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-1">Date</Text>
              <Text className="text-gray-800 text-lg">{selectedResult.date}</Text>
            </View>

            <View className="mb-4">
              <Text className="text-gray-600 mb-2">Results</Text>
              {selectedResult.results.map((item, index) => (
                <View key={index} className="mb-3">
                  <View className="flex-row justify-between items-center">
                    <Text className="text-gray-800 font-semibold">
                      {item.parameter}
                    </Text>
                    <View
                      className={`px-3 py-1 rounded-full ${getStatusColor(
                        item.status
                      )}`}
                    >
                      <Text className="capitalize">{item.status}</Text>
                    </View>
                  </View>
                  <Text className="text-gray-600">
                    Value: {item.value} {item.unit}
                  </Text>
                  <Text className="text-gray-500 text-sm">
                    Reference Range: {item.referenceRange}
                  </Text>
                </View>
              ))}
            </View>

            <View className="mb-6">
              <Text className="text-gray-600 mb-1">Notes</Text>
              <Text className="text-gray-800 text-lg">{selectedResult.notes}</Text>
            </View>

            <TouchableOpacity
              className="bg-blue-600 p-4 rounded-lg"
              onPress={() => setSelectedResult(null)}
            >
              <Text className="text-white text-center font-semibold">Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
} 