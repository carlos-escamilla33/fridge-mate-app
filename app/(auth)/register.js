import { useState } from "react";

export default function RegisterScreen() {
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [errors, setErrors] = useState("");
  const [loading, setLoading] = useState(false);

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
            label="Your Name"
            value={name}
            onChangeText={setName}
            placeholder="e.g. Carlos"
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
