import { useState } from "react";
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import {
  KeyboardAvoidingView,
  ScrollView,
  View,
  Text,
  StyleSheet,
} from "react-native";
import { Platform } from "react-native";
import Input from "../../components/Input";
import Button from "../../components/Button";
import { TouchableOpacity } from "react-native";
import Colors from "../../constants/colors";

export default function SignInScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

    function validate() {
    const e = {}

    if (!email.trim()) e.email = "Your email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';

    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Must be at least 8 characters";

    setErrors(e);

    return Object.keys(e).length == 0;
  }

  async function handleSignIn() {
    // check to see if errors populate
    if (!validate()) return;
    // 
    setLoading(true);
    setErrors({});
    try {
        const res = await signIn(email.trim().toLowerCase(), password);
        if (res) router.push("/(app)/profiles");
    } catch (err) {
        setErrors({general: err.message ?? "Could not sign-in: Try again."});
    } finally {
        setIsLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>🥬</Text>
          </View>
          <Text style={styles.title}>Welcome back.</Text>
          <Text style={styles.subtitle}>Sign in to your household fridge.</Text>
        </View>

        <View style={styles.form}>
          {errors.general && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          )}

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="example@email.com"
            keyboardType="email-address"
            error={errors.email}
            returnKeyType="next"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureToggle
            error={errors.password}
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
          />

          <Button
            label="Sign In"
            onPress={handleSignIn}
            loading={loading}
            style={styles.submitBtn}
          />

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>New here? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/register")}>
              <Text style={styles.footerLink}>Create a household</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 40,
    alignItems: "center"
  },
  iconWrap: {
    width: 52,
    height: 52,
    backgroundColor: Colors.parchment,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  icon: {
    fontSize: 26,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.bark,
    lineHeight: 22,
  },
  form: {
    gap: 2,
  },
  errorBanner: {
    backgroundColor: Colors.dangerBg,
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
  },
  errorBannerText: {
    fontSize: 13,
    color: Colors.dangerText,
    lineHeight: 18,
  },
  submitBtn: {
    marginTop: 8,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 20,
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 13,
    color: Colors.textMuted,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: 14,
    color: Colors.bark,
  },
  footerLink: {
    fontSize: 14,
    color: Colors.moss,
    fontWeight: "500",
  },
});
