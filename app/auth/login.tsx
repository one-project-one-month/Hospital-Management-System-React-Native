import { useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Button } from "../../components/ui/Button";
import { Input } from "../../components/ui/Input";
import { useAuthStore } from "../../lib/store/auth";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );
  const router = useRouter();
  const login = useAuthStore((state) => state.login);

  const handleLogin = async () => {
    // Clear previous errors
    setErrors({});

    if (!email || !password) {
      setErrors({
        email: !email ? "Email is required" : undefined,
        password: !password ? "Password is required" : undefined,
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      router.replace("/(tabs)");
    } catch (error: any) {
      if (error.response?.data?.statusCode === 401) {
        setErrors({
          email: "This credentials are not valid",
        });
      } else if (
        error.response?.data?.status === "fail" &&
        error.response?.data?.data
      ) {
        const validationErrors = error.response.data.data;
        setErrors({
          email: validationErrors.email?.[0],
          password: validationErrors.password?.[0],
        });
      } else {
        Alert.alert("Error", "Login failed. Please try again.");
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
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 px-6 pt-12">
          {/* Header */}
          <View className="items-center mb-12">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Text className="text-3xl font-bold text-blue-500">HMS</Text>
            </View>
            <Text className="text-2xl font-bold text-gray-900">
              Welcome Back
            </Text>
            <Text className="text-base text-gray-500 mt-2">
              Sign in to continue to your account
            </Text>
          </View>

          {/* Form */}
          <View className="space-y-4">
            <Input
              label="Email"
              placeholder="Enter your email"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                setErrors((prev) => ({ ...prev, email: undefined }));
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              error={errors.email}
            />

            <Input
              label="Password"
              placeholder="Enter your password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              secureTextEntry
              autoComplete="password"
              error={errors.password}
            />

            <TouchableOpacity className="items-end">
              <Text className="text-blue-500 font-medium">
                Forgot Password?
              </Text>
            </TouchableOpacity>
          </View>

          {/* Login Button */}
          <View className="mt-8">
            <Button onPress={handleLogin} isLoading={isLoading} size="lg">
              Sign In
            </Button>
          </View>

          {/* Register Link */}
          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Don't have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/auth/register")}>
              <Text className="text-blue-500 font-semibold">Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
