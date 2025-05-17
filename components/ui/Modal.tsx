import { cn } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { Modal as RNModal, Text, TouchableOpacity, View } from 'react-native';

interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Modal({ visible, onClose, title, children, className }: ModalProps) {
  return (
    <RNModal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View className={cn('bg-white rounded-t-3xl p-6', className)}>
          <View className="flex-row justify-between items-center mb-6">
            <Text className="text-xl font-bold text-gray-800">{title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>
          {children}
        </View>
      </View>
    </RNModal>
  );
} 