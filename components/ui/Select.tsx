import { cn } from '@/lib/utils';
import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Option {
  label: string;
  value: string;
}

interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  label?: string;
  error?: string;
  className?: string;
}

export function Select({
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  label,
  error,
  className,
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectedOption = options.find((option) => option.value === value);

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-gray-600 mb-2 font-medium">{label}</Text>
      )}
      <TouchableOpacity
        onPress={() => setIsOpen(true)}
        className={cn(
          'bg-gray-100 p-3 rounded-lg flex-row justify-between items-center',
          error && 'border border-red-500',
          className
        )}
      >
        <Text className={cn('text-gray-700', !selectedOption && 'text-gray-400')}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Ionicons name="chevron-down" size={20} color="#6b7280" />
      </TouchableOpacity>
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error}</Text>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View className="flex-1 bg-black/50 justify-end">
          <View className="bg-white rounded-t-3xl p-6">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-xl font-bold text-gray-800">Select Option</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color="#6b7280" />
              </TouchableOpacity>
            </View>
            <ScrollView className="max-h-[300px]">
              {options.map((option) => (
                <TouchableOpacity
                  key={option.value}
                  onPress={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    'p-4 border-b border-gray-100',
                    option.value === value && 'bg-blue-50'
                  )}
                >
                  <Text
                    className={cn(
                      'text-gray-800',
                      option.value === value && 'text-blue-600 font-medium'
                    )}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
} 