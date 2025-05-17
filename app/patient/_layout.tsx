import { Stack } from "expo-router";

export default function PatientLayout() {
  return (
    <Stack
        screenOptions={{
            headerTitleAlign: "center",
        }}
    >
      <Stack.Screen name="index" options={{ title: "Patient Management" }} />
      <Stack.Screen name="create" options={{ headerShown: false }} />
      <Stack.Screen name="edit" options={{ headerShown: false }} />
    </Stack>
  );
}