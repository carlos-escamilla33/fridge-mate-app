import AuthProvider, { useAuth } from "@/context/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { en, registerTranslation } from "react-native-paper-dates";

// Register once at app startup
registerTranslation("en", en);

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { account } = useAuth();
  const segments = useSegments();

  useEffect(() => {
    const timeout = setTimeout(() => {
      const inAuthGroup = segments[0] === "(tabs)"; // change to auth later on
      console.log(segments);

      if (!account && !inAuthGroup) {
        router.replace("/(tabs)"); // ./auth
      } else if (account && inAuthGroup) {
        router.replace("/(tabs)"); // ./ but we might want it to be ./tabs later on
      }
    }, 1);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, segments]);

  return <>{children}</>;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="index" options={{ title: "Home" }} />
          <Stack.Screen name="auth" options={{ title: "Authentication" }} />
          <Stack.Screen
            name="profile-select"
            options={{ title: "Profile Select" }}
          />
          <Stack.Screen
            name="profile-create"
            options={{ title: "Profile Create" }}
          />
          <Stack.Screen name="(tabs)" />
        </Stack>
      </RouteGuard>
    </AuthProvider>
  );
}
