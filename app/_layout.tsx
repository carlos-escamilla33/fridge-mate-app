import AuthProvider from "@/context/auth-context";
import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const isAuth = false;

  useEffect(() => {
    if (!isAuth) {
      setTimeout(() => router.replace("./auth"), 0);
    }
  });

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
