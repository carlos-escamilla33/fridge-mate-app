import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { KeyboardAvoidingView, ScrollView, View, Text } from "react-native";
import { Platform } from "react-native";
import Input from "../../components/Input";

export default function SignInScreen() {
  const { signIn } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS == "ios" ? "padding" : "height"}
    >
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View>
          <View>
            <Text>🥬</Text>
          </View>
          <Text>Welcome Back.</Text>
          <Text>Sign in to your household fridge.</Text>
        </View>

        <View>
          {errors.general && (
            <View style={styles.errorBanner}>
              <Text style={styles.errorBannerText}>{errors.general}</Text>
            </View>
          )}

          <Input 
            label="Email"
            value={email}
            onChangeText={setEmail}
            placeholder="you@email.com"
            keyboardType="email-address"
            error={errors.email}
            returnKeyType="next"
          />

          <Input dfd
            label="Password"
            value={password}
            onChangeText={setPassword}
            placeholder="••••••••"
            secureToggle
            error={errors.password}
            returnKeyType="done"
            onSubmitEditing={handleSignIn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
