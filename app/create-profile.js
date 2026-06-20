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
import Button from "../components/Button";
import Input from "../components/Input";
import Colors from "../constants/colors";

const AVATAR_COLORS = ["#4A7C45", "#C07B48", "#5B7FA6", "#A0507A", "#7A6FA0"];

export default function CreateProfileScreen() {
  const [name, setName] = useState("");
  const [selectedColor, setSelectedColor] = useState(AVATAR_COLORS[0]);
  const [error, setError] = useState("");

  function getInitials(n) {
    return n.trim() ? n.trim()[0].toUpperCase() : "?";
  }

  function handleCreate() {
    if (!name.trim()) {
      setError("Name is required");
      return;
    }
    // TODO: wire to backend
    router.back();
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
          <Text style={styles.subtitle}>
            Give them a name and pick an avatar color.
          </Text>
        </View>

        <View style={styles.avatarPreview}>
          <View style={[styles.avatar, { backgroundColor: selectedColor }]}>
            <Text style={styles.avatarText}>{getInitials(name)}</Text>
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

          <Button
            label="Add Member"
            onPress={handleCreate}
            style={styles.submitBtn}
          />
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
    marginBottom: 32,
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
  avatarPreview: {
    alignItems: "center",
    marginBottom: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 32,
    fontWeight: "700",
    color: Colors.textOnDark,
  },
  colorRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 12,
    marginBottom: 32,
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
