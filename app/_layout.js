import { Stack } from "expo-router";
import { AuthProvider } from "../context/AuthContext";

export default function RootLayout() {
    return (
        <AuthProvider>
            <Stack.Screen name="index" options={{ headerShown: false }} />
        </AuthProvider>
    )
}