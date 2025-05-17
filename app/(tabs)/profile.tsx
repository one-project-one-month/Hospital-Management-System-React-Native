import { Button } from '@/components/ui/Button';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useState } from 'react';
import { Image, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useAuthStore } from '../../lib/store/auth';

type IconName = 'person-outline' | 'medical-outline' | 'document-text-outline' | 'create-outline' | 'trash-outline' | 'chevron-forward';

interface MenuItem {
  icon: IconName;
  title: string;
  subtitle: string;
  onPress: () => void;
}

export default function ProfileScreen() {
  // Logout function
  const { user } = useAuthStore();
  const logout = useAuthStore((state) => state.logout);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  }
  
  const [patients, setPatients] = useState([
    {
      id: 1,
      name: 'John Doe',
      age: 45,
      gender: 'Male',
      image: 'https://randomuser.me/api/portraits/men/1.jpg',
    },
    // Add more patients here
  ]);

  const menuItems: MenuItem[] = [
    {
      icon: 'person-outline',
      title: 'Personal Information',
      subtitle: 'Update your personal details',
      onPress: () => {
        // Handle personal information navigation
      },
    },
    {
      icon: 'medical-outline',
      title: 'Medical History',
      subtitle: 'View your medical records',
      onPress: () => {
        router.push('/medical-history');
      },
    },
    {
      icon: 'document-text-outline',
      title: 'Lab Results',
      subtitle: 'View your test results',
      onPress: () => {
        router.push('/lab-results');
      },
    },
  ];

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Profile Header */}
      <View className="bg-white p-6">
        <View className="items-center">
          <Image
            source={{ uri: `https://ui-avatars.com/api/?name=${user?.name}&background=000&color=fff&length=2` }}
            className="w-24 h-24 rounded-full"
          />
          <Text className="text-xl font-bold text-gray-800 mt-4">{user?.name}</Text>
          <Text className="text-gray-500">{user?.email}</Text>
          <Button variant="secondary" size="sm" className='mt-3' onPress={() => alert("Edit Profile")}>Edit Profile</Button>
        </View>
      </View>

      {/* Stats */}
      <View className="flex-row bg-white mt-4 p-4">
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-gray-800">12</Text>
          <Text className="text-gray-500">Appointments</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-gray-800">5</Text>
          <Text className="text-gray-500">Lab Tests</Text>
        </View>
        <View className="flex-1 items-center">
          <Text className="text-2xl font-bold text-gray-800">3</Text>
          <Text className="text-gray-500">Prescriptions</Text>
        </View>
      </View>

      {/* Patient Management Section */}
      <View className="mt-4 bg-white p-4">
        <View className="flex-row justify-between items-center mb-4">
          <Text className="text-lg font-bold text-gray-800">Patient Management</Text>
          <Button size="sm" onPress={() => router.push('/patient')}>Manage Patients</Button>
        </View>
        
        {patients.map((patient) => (
          <View key={patient.id} className="flex-row items-center p-3 border-b border-gray-100">
            <Image source={{ uri: patient.image }} className="w-12 h-12 rounded-full" />
            <View className="ml-3 flex-1">
              <Text className="font-semibold text-gray-800">{patient.name}</Text>
              <Text className="text-gray-500">{patient.age} years • {patient.gender}</Text>
            </View>
            {/* <View className="flex-row">
              <TouchableOpacity className="p-2">
                <Ionicons name="create-outline" size={20} color="#6b7280" />
              </TouchableOpacity>
              <TouchableOpacity className="p-2">
                <Ionicons name="trash-outline" size={20} color="#ef4444" />
              </TouchableOpacity>
            </View> */}
          </View>
        ))}
      </View>

      {/* Menu Items */}
      <View className="mt-4 bg-white">
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={index}
            className={`flex-row items-center p-4 ${
              index !== menuItems.length - 1 ? 'border-b border-gray-100' : ''
            }`}
            onPress={item.onPress}
          >
            <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center">
              <Ionicons name={item.icon} size={20} color="#6b7280" />
            </View>
            <View className="ml-4 flex-1">
              <Text className="font-semibold text-gray-800">{item.title}</Text>
              <Text className="text-gray-500 text-sm">{item.subtitle}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#6b7280" />
          </TouchableOpacity>
        ))}
      </View>

      {/* Logout Button */}
      <Button variant="danger" onPress={handleLogout} className="mx-4 my-6" isLoading={isLoading}>
        Logout
      </Button>
    </ScrollView>
  );
} 