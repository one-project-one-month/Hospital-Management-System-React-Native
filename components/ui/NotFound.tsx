import { Ionicons } from '@expo/vector-icons';
import { Text, View } from 'react-native';

interface NotFoundProps {
  message?: string;
}

export function NotFound({ message = 'No items found' }: NotFoundProps) {
  return (
    <View className="flex-1 justify-center items-center p-4">
      <Ionicons name="search-outline" size={48} color="#9CA3AF" />
      <Text className="text-gray-500 text-center mt-2">{message}</Text>
    </View>
  );
} 