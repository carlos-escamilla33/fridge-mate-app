import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from 'react-native';
import { router } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Colors from "../../constants/colors";

export default function RegisterScreen() {
  const { register } = useAuth();

  const [accountName, setAccountName] = useState("");
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

  function validate() {
    const e = {}

    if (!name.trim()) e.name = "Your name is required";
    if (!email.trim()) e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(email)) e.email = 'Enter a valid email.';

    if (!password) e.password = "Password is required";
    else if (password.length < 8) e.password = "Must be at least 8 characters";

    if (!confirm) e.confirm = "Please confirm your password";
    else if (confirm != password) e.confirm = "Passwords don't match";
    setErrors(e);

    return Object.keys(e).length == 0;
  }

  async function handleRegister() {}

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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Create a household.</Text>
          <Text style={styles.subtitle}>
            You'll be the admin. Invite family members after setup.
          </Text>
        </View>

        <View style={styles.form}>
          {errors.general && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          )}

          <Input 
          label="Account Name"
          value={accountName}
          onChangeText={setAccountName}
          placeholder="e.g. Pug's Fridge"
          error={errors.name}
          returnKeyType="next"
          autoCapitalize="words"
          />

          <Input
            label="Frist Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Riley"
            error={errors.name}
            returnKeyType="next"
            autoCapitalize="words"
          />

          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            keyboardType="email-address"
            error={errors.email}
            returnKeyType="next"
          />

          <Input
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="Min. 8 characters"
            secureToggle
            error={errors.password}
            returnKeyType="next"
          />

          <Input
            label="Confirm Password"
            value={confirm}
            onChangeText={setConfirm}
            placeholder="Re-enter your password"
            secureToggle
            error={errors.confirm}
            returnKeyType="done"
            onSubmitEditing={handleRegister}
          />

          <Text style={styles.adminNote}>
            🔑 As the account creator, you'll have admin access — you can manage
            members and settings.
          </Text>

          <Button
            label="Create Household"
            onPress={handleRegister}
            loading={loading}
            style={styles.submitBtn}
          />

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.replace("/(auth)/sign-in")}>
              <Text style={styles.footerLink}>Sign in</Text>
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
    paddingTop: 56,
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 28,
  },
  backText: {
    fontSize: 14,
    color: Colors.bark,
    fontWeight: "500",
  },
  header: {
    marginBottom: 28,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.5,
    marginBottom: 8,
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
  adminNote: {
    fontSize: 13,
    color: Colors.bark,
    backgroundColor: Colors.parchment,
    borderRadius: 12,
    padding: 12,
    lineHeight: 19,
    marginTop: 4,
    marginBottom: 4,
  },
  submitBtn: {
    marginTop: 12,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
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
