import { Stack, useRouter } from "expo-router";
import { useEffect } from "react";

const RouteGuard = ({children}: {children: React.ReactNode}) => {
  const router = useRouter();
  const isAuth = false;

  useEffect(() => {
    if (!isAuth) {
      router.replace("./auth")
    }
  })

  return <>{children}</>
}

export default function RootLayout() {
  return (
    <RouteGuard>
        <Stack>
          
        </Stack>
    </RouteGuard>
  );
}
