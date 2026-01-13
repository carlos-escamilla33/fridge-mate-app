import AuthProvider, { useAuth } from "@/context/auth-context";
import { Stack, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const {account} = useAuth();
  const segments = useSegments();

  useEffect(() => {
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
        <Stack>{/* <Stack.Screen name=""> */}</Stack>
      </RouteGuard>
    </AuthProvider>
  );
}
