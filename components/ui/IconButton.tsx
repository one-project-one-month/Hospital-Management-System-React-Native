import React from 'react';
import { ActivityIndicator, TouchableOpacity } from 'react-native';
import { cn } from '../../lib/utils';

interface IconButtonProps {
  onPress: () => void;
  icon: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'outline';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
}

export function IconButton({
  onPress,
  icon,
  variant = 'primary',
  size = 'md',
  isLoading,
  disabled,
  className,
}: IconButtonProps) {
  const baseStyles = 'rounded-full items-center justify-center';
  
  const variants = {
    primary: 'bg-blue-500 active:bg-blue-600',
    secondary: 'bg-gray-200 active:bg-gray-300',
    outline: 'border border-gray-300 active:bg-gray-50',
  };

  const sizes = {
    sm: 'h-10 w-10',
    md: 'h-12 w-12',
    lg: 'h-14 w-14',
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
        icon
      )}
    </TouchableOpacity>
  );
} 