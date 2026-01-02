// Rileyescamilla3@gmail.com
// Riley1234!
import { useAuth } from "@/context/auth-context";
import { useRouter } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function AuthScreen() {
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [accountName, setAccountName] = useState<string>("");
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>("");

  const theme = useTheme();
  const { signUp, signIn } = useAuth();
  const router = useRouter();

  async function handleAuth() {
    if (!email || !password || (isSignUp && (!accountName || !firstName || !lastName))) {
      setError("Please fill in all fields");
      return;
    }

    if (password.length < 8) {
      setError("Passwords must be at least 8 characters long");
      return;
    }

    setError(null);

    if (isSignUp) {
      const res = await signUp(accountName, firstName, lastName, email, password);

      if (res?.message !== "You Successfully Registered!") {
        setError(`Error in signing up: ${res?.message}`);
        return;
      }
    } else {
      const res = await signIn(email, password);
      if (!res) {
        setError("Account not found. Sign up or try again.");
        return;
      }
    }
    router.replace("./");
  }
  function handleSwitch() {
    setIsSignUp((prev) => !prev);
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          {isSignUp ? "Create Account" : "Welcome Back"}
        </Text>
        
        {
          isSignUp && <TextInput
          label="Account Name"
          autoCapitalize="none"
          placeholder="Account Name"
          mode="outlined"
          style={styles.input}
          onChangeText={setAccountName}
          />
        }
        {
          isSignUp && <TextInput
            label="First Name"
            autoCapitalize="none"
            placeholder="First Name"
            mode="outlined"
            style={styles.input}
            onChangeText={setFirstName}
          />
        }
        {
          isSignUp && <TextInput
            label="Last Name"
            autoCapitalize="none"
            placeholder="Last Name"
            mode="outlined"
            style={styles.input}
            onChangeText={setLastName}
           />
        }
        <TextInput
          label="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          placeholder="example@gmail.com"
          mode="outlined"
          style={styles.input}
          onChangeText={setEmail}
        />
        <TextInput
          label="Password"
          autoCapitalize="none"
          secureTextEntry
          mode="outlined"
          style={styles.input}
          onChangeText={setPassword}
        />

        {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

        <Button mode="contained" style={styles.button} onPress={handleAuth}>
          {isSignUp ? "Sign Up" : "Login"}
        </Button>
        <Button
          mode="text"
          onPress={handleSwitch}
          style={styles.switchModeButton}
        >
          {isSignUp
            ? "Already have an account? Sign In"
            : "Don't have an account? Sign Up"}
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    padding: 16,
    justifyContent: "center",
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  input: {
    marginBottom: 16,
  },
  button: {
    textAlign: "center",
    marginTop: 8,
  },
  switchModeButton: {
    marginTop: 16,
  },
});
