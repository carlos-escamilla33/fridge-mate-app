import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Stack, router } from "expo-router";
import { AuthProvider, useAuth } from "../context/AuthContext";
import { AccountProvider } from "../context/AccountContext";

function AuthGate() {
  const { user, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/(auth)/sign-in");
    }
  }, [user, isLoading]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        // iOS 26 turns on swipe-back from anywhere on the screen, so pressing and dragging
        // content navigated back. Keep only the standard swipe from the left edge.
        fullScreenGestureEnabled: false,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="profiles" />
      <Stack.Screen name="create-profile" />
      <Stack.Screen name="scan-review" />
      <Stack.Screen name="item/[id]" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <AuthProvider>
        <AccountProvider>
          <AuthGate />
        </AccountProvider>
      </AuthProvider>
    </GestureHandlerRootView>
  );
}
