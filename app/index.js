import { useEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import { useAuth } from "../context/AuthContext";
import Colors from "../constants/colors";

export default function SplashScreen() {
  const { isLoading, user } = useAuth();
  const [animationDone, setAnimationDone] = useState(false);

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(16)).current;
  const loaderAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 500, useNativeDriver: true }),
    ]).start();

    Animated.timing(loaderAnim, {
      toValue: 1,
      duration: 1600,
      useNativeDriver: false,
    }).start(() => setAnimationDone(true));
  }, []);

  useEffect(() => {
    if (!isLoading && animationDone) {
      router.replace(user ? "/profiles" : "/(auth)/sign-in");
    }
  }, [isLoading, animationDone]);

  const loaderWidth = loaderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "65%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
      >
        <View style={styles.logoWrap}>
          <Text style={styles.logoText}>FM</Text>
        </View>
        <Text style={styles.title}>FridgeMate</Text>
        <Text style={styles.tagline}>Nothing goes to waste.</Text>
        <View style={styles.loaderTrack}>
          <Animated.View style={[styles.loaderFill, { width: loaderWidth }]} />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  content: {
    alignItems: "center",
    gap: 10,
  },
  logoWrap: {
    width: 72,
    height: 72,
    backgroundColor: Colors.accent,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  logoText: {
    fontSize: 26,
    fontWeight: "800",
    color: Colors.white,
    letterSpacing: -0.5,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.6,
  },
  tagline: {
    fontSize: 15,
    color: Colors.textSecondary,
    letterSpacing: 0.1,
    marginBottom: 36,
  },
  loaderTrack: {
    width: 48,
    height: 3,
    backgroundColor: Colors.border,
    borderRadius: 2,
    overflow: "hidden",
  },
  loaderFill: {
    height: "100%",
    backgroundColor: Colors.accent,
    borderRadius: 2,
  },
});
