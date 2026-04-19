import { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { Colors } from "react-native/Libraries/NewAppScreen";

export default function SplashScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;
    const loaderAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing(fadeAnim, {
                toValue: 1,
                duration: 700,
                useNativeDriver: true,
            }), 
            Animated.timing(slideAnim, {
                toValue: 0,
                duration: 600,
                useNativeDriver: true,
            }),
        ]).start()

        Animated.timing(loaderAnim, {
            toValue: 1,
            duration: 1800,
            useNativeDriver: false,
        }).start();

        const timer = setTimeout(async () => {
            try {
                const token = await SecureStore.getItemAsync("fridgemate_token");
                const user = await SecureStore.getItemAsync("fridgemate_user");
                if (token && user) {
                    router.replace("/(app)/profiles");
                } else {
                    router.replace("/(auth)/sign-in");
                }
            } catch {
                router.replace("/(auth)/sign-in");
            }
        }, 2000)

        return () => clearTimeout(timer);
    }, []);

    const loaderWidth = loaderAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0%", "75%"],
    })

    return (
        <View style={stykes.container}>
            <Animated.View
            >
                <View>
                    <Text>🥬</Text>
                </View>
            </Animated.View>
        </View>
    )

    const styles = StyleSheet.create({
        container: {
            
        }
    })
}