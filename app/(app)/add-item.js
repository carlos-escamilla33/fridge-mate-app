import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import Button from "../../components/Button";
import Input from "../../components/Input";
import Colors from "../../constants/colors";

const CATEGORIES = ["Produce", "Dairy", "Meat", "Seafood", "Grains", "Drinks", "Snacks", "Other"];

export default function AddItemScreen() {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [category, setCategory] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  function validate() {
    const e = {};
    if (!name.trim()) e.name = "Item name is required.";
    if (!expiryDate.trim()) e.expiryDate = "Expiration date is required.";
    else {
      const parsed = new Date(expiryDate);
      if (isNaN(parsed.getTime())) e.expiryDate = "Enter a valid date (MM/DD/YYYY).";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleAdd() {
    if (!validate()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setTimeout(() => router.replace("/(app)/home"), 800);
    }, 600);
  }

  function handleAddAnother() {
    setName("");
    setQuantity("");
    setCategory("");
    setExpiryDate("");
    setErrors({});
    setSuccess(false);
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.flex}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <TouchableOpacity
              onPress={() => router.back()}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Feather name="x" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <Text style={styles.title}>Add Item</Text>
            <View style={{ width: 20 }} />
          </View>

          <TouchableOpacity style={styles.scanZone} activeOpacity={0.75}>
            <View style={styles.scanIconWrap}>
              <Feather name="camera" size={26} color={Colors.textSecondary} />
            </View>
            <Text style={styles.scanTitle}>Scan item or receipt</Text>
            <Text style={styles.scanSubtitle}>AI will identify and estimate expiry</Text>
          </TouchableOpacity>

          <View style={styles.divider}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>or enter manually</Text>
            <View style={styles.dividerLine} />
          </View>

          <View style={styles.form}>
            <Input
              label="Item Name"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Organic Strawberries"
              error={errors.name}
              autoCapitalize="words"
            />

            <View style={styles.row}>
              <View style={styles.rowHalf}>
                <Input
                  label="Quantity"
                  value={quantity}
                  onChangeText={setQuantity}
                  placeholder="e.g. 1 lb"
                />
              </View>
              <View style={styles.rowHalf}>
                <Input
                  label="Expiry Date"
                  value={expiryDate}
                  onChangeText={setExpiryDate}
                  placeholder="MM/DD/YYYY"
                  keyboardType="numbers-and-punctuation"
                  error={errors.expiryDate}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Category</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {CATEGORIES.map((c) => (
                  <TouchableOpacity
                    key={c}
                    style={[styles.categoryChip, category === c && styles.categoryChipActive]}
                    onPress={() => setCategory(c)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.categoryChipText, category === c && styles.categoryChipTextActive]}>
                      {c}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {success ? (
              <View style={styles.successBanner}>
                <Feather name="check-circle" size={18} color={Colors.successText} />
                <Text style={styles.successText}>Item added to your fridge!</Text>
              </View>
            ) : (
              <>
                <Button
                  label="Add to Fridge"
                  onPress={handleAdd}
                  loading={loading}
                  style={styles.submitBtn}
                />
                <Button label="Add Another" onPress={handleAddAnother} variant="secondary" />
              </>
            )}
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 16,
    paddingBottom: 20,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  scanZone: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: "dashed",
    borderRadius: 16,
    height: 148,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginBottom: 24,
  },
  scanIconWrap: {
    width: 52,
    height: 52,
    backgroundColor: Colors.borderLight,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 2,
  },
  scanTitle: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  scanSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  divider: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.border,
  },
  dividerText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  form: {
    gap: 2,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowHalf: {
    flex: 1,
  },
  inputGroup: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 10,
  },
  categoryScroll: {
    gap: 8,
  },
  categoryChip: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  categoryChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  categoryChipText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  categoryChipTextActive: {
    color: Colors.white,
    fontWeight: "600",
  },
  submitBtn: {
    marginTop: 8,
    marginBottom: 10,
  },
  successBanner: {
    backgroundColor: Colors.successBg,
    borderRadius: 12,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 8,
  },
  successText: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.successText,
  },
});
