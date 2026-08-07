import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { router } from "expo-router";
import { useAccount } from "../context/AccountContext";
import Button from "../components/Button";
import Input from "../components/Input";
import Colors from "../constants/colors";

const AVATAR_COLORS = ['#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444'];

export default function CreateProfileScreen() {
  const { addMember } = useAccount();
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function getInitials(n) {
    return n.trim() ? n.trim()[0].toUpperCase() : "?";
  }

  async function handleCreate() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    setLoading(true);
    try {
      await addMember(name.trim(), selectedColor);
      router.back();
    } catch (err) {
      setError(err.message ?? "Could not add member. Try again.");
    } finally {
      setLoading(false);
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
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backBtn}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Add a member.</Text>
          <Text style={styles.subtitle}>Give them a name and pick a color.</Text>
        </View>

        <View style={styles.avatarPreview}>
          <View style={[styles.avatar, { backgroundColor: selectedColor + '1A' }]}>
            <Text style={[styles.avatarText, { color: selectedColor }]}>{getInitials(name)}</Text>
          </View>
        </View>

        <View style={styles.colorRow}>
          {AVATAR_COLORS.map((color) => (
            <TouchableOpacity
              key={color}
              onPress={() => setSelectedColor(color)}
              style={[
                styles.colorSwatch,
                { backgroundColor: color },
                selectedColor === color && styles.colorSwatchSelected,
              ]}
              activeOpacity={0.8}
            />
          ))}
        </View>

        <View style={styles.form}>
          <Input
            label="Name"
            value={name}
            onChangeText={(t) => {
              setName(t);
              if (error) setError("");
            }}
            placeholder="e.g. Alex"
            autoCapitalize="words"
            returnKeyType="done"
            onSubmitEditing={handleCreate}
            error={error}
          />
          <Button label="Add Member" onPress={handleCreate} loading={loading} style={styles.submitBtn} />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 40,
  },
  backBtn: {
    marginBottom: 28,
  },
  backText: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: "500",
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.6,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    lineHeight: 22,
  },
  avatarPreview: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 84,
    height: 84,
    borderRadius: 42,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 34,
    fontWeight: "700",
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 14,
    marginBottom: 36,
  },
  colorSwatch: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
  colorSwatchSelected: {
    borderWidth: 3,
    borderColor: Colors.textPrimary,
  },
  form: {
    gap: 2,
  },
  submitBtn: {
    marginTop: 12,
  },
});
