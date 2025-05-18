import { Button } from "@/components/ui/Button";
import { Ionicons } from "@expo/vector-icons";
import { Stack, useRouter } from "expo-router";

export default function PatientLayout() {
  const router = useRouter();
  return (
    <Stack
        screenOptions={{
            headerTitleAlign: "center",
        }}
    >
      <Stack.Screen name="index" options={{ 
        title: "Patient Management",
        headerRight: () => (
          <Button
          variant="secondary"
          size="sm"
          onPress={() => router.push('/patient/create')}
        >
          <Ionicons name="add" size={20} color="white" />
        </Button>
        )
      }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="edit" options={{ headerShown: false }} />
    </Stack>
  );
}