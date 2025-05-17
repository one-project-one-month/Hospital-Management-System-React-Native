import { Text, TextInput, TextInputProps, View } from 'react-native';
import { cn } from '../../lib/utils';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <View className="space-y-1 mb-3">
      {label && (
        <Text className="text-[15px] font-medium text-gray-800 mb-0.5">{label}</Text>
      )}
      <TextInput
        className={cn(
          'h-13 px-3.5 rounded-lg bg-white',
          'border border-gray-200 text-[17px]',
          'focus:border-blue-500',
          error && 'border-red-500',
          'active:bg-gray-50',
          className
        )}
        placeholderTextColor="#8E8E93"
        {...props}
      />
      {error && (
        <Text className="text-[13px] text-red-500 mt-0.5">{error}</Text>
      )}
    </View>
  );
} 