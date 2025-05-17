import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import "../global.css";
import { useAuthStore } from "../lib/store/auth";

function RootLayoutNav() {
  const { user, isLoading, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, []);

  useEffect(() => {
    if (isLoading) return;

    const isAuthScreen = segments[0] === "auth";

    if (!user && !isAuthScreen) {
      // Redirect to login if not authenticated
      router.replace("/auth/login");
    } else if (user && isAuthScreen) {
      // Redirect to home if authenticated
      router.replace("/(tabs)");
    }
  }, [user, segments, isLoading]);

  if (isLoading) {
    return null;
  }

  return (
    <Stack
      screenOptions={{
        statusBarStyle: "dark",
        headerTitleStyle: {
          fontWeight: "bold",
        },
        headerTintColor: "#000",
        headerTitleAlign: "center",
        headerShadowVisible: false,
        headerBackTitle: "Back"
      }}
    >
      <Stack.Screen
        name="auth/login"
        options={{ title: "Login", headerBackVisible: false }}
      />
      <Stack.Screen name="auth/register" options={{ title: "Register" }} />
      <Stack.Screen
        name="(tabs)"
        options={{ headerShown: false}}
      />
      <Stack.Screen
        name="medical-history"
        options={{ title: "Medical History"}}
      />
      <Stack.Screen
        name="patient-management"
        options={{ title: "Patient Management"}}
      />
      <Stack.Screen
        name="lab-results"
        options={{ title: "Lab Results"}}
      />
    </Stack>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}

export function TabsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
    </Stack>
  );
}
