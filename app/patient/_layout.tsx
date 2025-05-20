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
        title: "Patient Management"
      }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="edit" options={{ headerShown: false }} />
    </Stack>
  );
}