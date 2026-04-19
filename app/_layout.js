import { useEffect } from "react";
import { View, Text, StyleSheet, Animated } from 'react-native';
import { router } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import Colors from '@/constants/colors';

export default function SplashScreen() {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(24)).current;
    const loaderAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        Animated.parallel([
            Animated.timing
        ])
    })
}