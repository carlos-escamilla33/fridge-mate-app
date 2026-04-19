import { useEffect, useRef } from "react";
import { View, Text, StyleSheet, Animated } from "react-native";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import Colors from '../constants/colors';

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
    ]).start();

    Animated.timing(loaderAnim, {
      toValue: 1,
      duration: 1800,
      useNativeDriver: false,
    }).start();

    // const timer = setTimeout(async () => {
    //   try {
    //     const token = await SecureStore.getItemAsync("fridgemate_token");
    //     const user = await SecureStore.getItemAsync("fridgemate_user");
    //     if (token && user) {
    //       router.replace("/(app)/profiles");
    //     } else {
    //       router.replace("/(auth)/sign-in");
    //     }
    //   } catch {
    //     // router.replace("/(auth)/sign-in");

    //   }
    // }, 2000);

    // return () => clearTimeout(timer);
  }, []);

  const loaderWidth = loaderAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "75%"],
  });

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
            styles.content,
            {opacity: fadeAnim, transform:[{translateY: slideAnim}]},
        ]}
      >
        <View style={styles.iconWrap}>
          <Text style={styles.icon}>🥬</Text>
        </View>
        <Text>FridgeMate</Text>
        <Text>Nothing goes to waste.</Text>
        <View>
            <Animated.View />
        </View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.forest,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 40,
    },
    content: {
        alignItems: "center",
        gap: 12
    },
    iconWrap: {
        width: 80,
        height: 80,
        backgroundColor: "rgba(255,255,255,0.1)",
        borderRadius: 22,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: 8,
    },
    icon: {
        fontSize: 38
    },
    title: {
        fontSize: 38,
        fontWeight: "700",
        color: Colors.textOnDark,
        letterSpacing: -0.5,
    }
})
