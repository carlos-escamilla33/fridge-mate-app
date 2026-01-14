import AuthProvider, { useAuth } from "@/context/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const {account, isLoadingAccount} = useAuth();
  const segments = useSegments();

  useEffect(() => {
    // if (isLoading) return;

    const inAuthGroup = segments[0] === "auth";

    if (!account && !inAuthGroup) {
      router.replace("./auth");
    } else if(account && inAuthGroup) {
      router.replace("./");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [account, segments]);

  return <>{children}</>;
};

export default function RootLayout() {
  return (
    <AuthProvider>
      <RouteGuard>
        <Stack>
          <Stack.Screen name="index" options={{title: "Home"}}/>
          <Stack.Screen name="auth" options={{title: "Authentication"}}/>
          <Stack.Screen name="profile-select" options={{title: "Profile Select"}}/>
          <Stack.Screen name="profile-create" options={{title: "Profile Create"}}/>
        </Stack>
      </RouteGuard>
    </AuthProvider>
  );
}
