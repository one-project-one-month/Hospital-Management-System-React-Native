import React from 'react';
import { ActivityIndicator, Text, TouchableOpacity, View } from 'react-native';
import { cn } from '../../lib/utils';

interface ButtonProps {
  onPress: () => void;
  children?: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

export function Button({
  onPress,
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  className,
  icon,
}: ButtonProps) {
  const baseStyles = 'rounded-xl flex-row items-center justify-center';
  
  const textColors = {
    primary: 'text-white',
    secondary: 'text-white',
    outline: 'text-gray-800',
    danger: 'text-red-600',
  };

  const variants = {
    primary: 'bg-blue-500 active:bg-blue-600',
    secondary: 'bg-gray-800 active:bg-gray-300',
    outline: 'border border-gray-300 active:bg-gray-50',
    danger: 'bg-red-200 active:bg-red-600',
  };

  const sizes = {
    sm: 'h-10 px-4',
    md: 'h-12 px-6',
    lg: 'h-14 px-8',
  };

  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={disabled || isLoading}
      className={cn(
        baseStyles,
        variants[variant],
        sizes[size],
        disabled && 'opacity-50',
        className
      )}
    >
      {isLoading ? (
        <ActivityIndicator
          color={variant === 'primary' ? 'white' : '#000'}
          size="small"
        />
      ) : (
        <>
          {icon && <View className="mr-2">{icon}</View>}
          {children && <Text className={textColors[variant]}>{children}</Text>}
        </>
      )}
    </TouchableOpacity>
  );
} 