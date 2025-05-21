import { ToastProvider } from "@phonehtut/react-native-sonner";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import "../global.css";
import { useAuthStore } from "../lib/store/auth";

function RootLayoutNav() {
  const { user, isLoading, initialize } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    initialize();
  }, [initialize]);

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
  }, [user, isLoading, segments, router]);

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
        headerBackTitle: "Back",
      }}
    >
      <Stack.Screen
        name="auth/login"
        options={{ title: "Login", headerBackVisible: false }}
      />
      <Stack.Screen name="auth/register" options={{ title: "Register" }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen
        name="medical-history"
        options={{ title: "Medical History" }}
      />
      <Stack.Screen name="patient" options={{ headerShown: false }} />
      <Stack.Screen name="lab-results" options={{ title: "Lab Results" }} />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ToastProvider>
          <RootLayoutNav />
        </ToastProvider>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}

export function TabsLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{ title: "Home" }} />
    </Stack>
  );
}
