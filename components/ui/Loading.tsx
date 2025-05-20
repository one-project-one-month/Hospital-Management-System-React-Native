import { ActivityIndicator, View } from 'react-native';

interface LoadingProps {
  size?: 'small' | 'large';
  color?: string;
}

export function Loading({ size = 'large', color = '#0000ff' }: LoadingProps) {
  return (
    <View className="flex-1 justify-center items-center">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
} 