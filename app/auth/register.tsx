import { FontAwesome6 } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";
import { toast } from "sonner-native";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../lib/store/auth";

export default function RegisterScreen() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ name?: string; email?: string; password?: string }>({});
  const router = useRouter();
  const register = useAuthStore((state) => state.register);

  const handleRegister = async () => {
    // Clear previous errors
    setErrors({});

    if (!name || !email || !password) {
      setErrors({
        name: !name ? 'Name is required' : undefined,
        email: !email ? 'Email is required' : undefined,
        password: !password ? 'Password is required' : undefined
      });
      return;
    }

    setIsLoading(true);
    try {
      await register(email, password, name);
      router.replace("/(tabs)");
      toast.success('Registration successful');
    } catch (error: any) {
      if (error.response?.data?.status === 'error' && error.response?.data?.data) {
        const validationErrors = error.response.data.data;
        setErrors({
          name: validationErrors.name?.[0],
          email: validationErrors.email?.[0],
          password: validationErrors.password?.[0]
        });
      } else {
        toast.error('Registration failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-white"
    >
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ flexGrow: 1, paddingBottom: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-12">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-gray-300 rounded-full items-center justify-center mb-4">
              <Text className="text-3xl font-bold text-blue-500"><FontAwesome6 name="hospital" size={24} color="black" /></Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              Create Account
            </Text>
            <Text className="text-base text-gray-500 mt-2">
              Sign up to get started with your account
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <Input
              label="Full Name"
              placeholder="Enter your full name"
              value={name}
              onChangeText={(text) => {
                setName(text);
                setErrors(prev => ({ ...prev, name: undefined }));
              }}
              autoComplete="name"
              error={errors.name}
            />

            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors(prev => ({ ...prev, email: undefined }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="Create a password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors(prev => ({ ...prev, password: undefined }));
              }}
              secureTextEntry
              autoComplete="password-new"
              error={errors.password}
            />
          </View>

          {/* Register Button */}
          <View className="mt-8">
            <Button variant="secondary" onPress={handleRegister} isLoading={isLoading} size="lg">
              Create Account
            </Button>
          </View>

          {/* Terms and Privacy */}
          <Text className="text-center text-gray-500 mt-4 text-sm">
            By signing up, you agree to our Terms of Service and Privacy Policy
          </Text>

          {/* Login Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/login")}>
              <Text className="text-gray-500 font-semibold">Sign In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
