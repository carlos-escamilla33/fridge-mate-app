import { useEffect } from "react";
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
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="profiles" />
      <Stack.Screen name="create-profile" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <AccountProvider>
        <AuthGate />
      </AccountProvider>
    </AuthProvider>
  );
}
