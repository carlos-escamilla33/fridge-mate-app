import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Button from "../components/Button";
import Input from "../components/Input";
import Colors from "../constants/colors";
import { useAuth } from "../context/AuthContext";
import { useAccount } from "../context/AccountContext";
import { createItemsBulk } from "../api/items";
import { isoToDisplay, displayToIso } from "../utils/dates";

let nextRowId = 1;

function toRow(item) {
  return {
    rowId: nextRowId++,
    name: item.foodName ?? "",
    expiry: isoToDisplay(item.estimatedExpirationDate),
    quantity: Math.max(1, item.quantity ?? 1),
    ripeness: item.ripenessLevel || "fresh",
    lowConfidence: item.confidence === "low",
  };
}

export default function ScanReviewScreen() {
  const params = useLocalSearchParams();
  const { token } = useAuth();
  const { activeMember } = useAccount();
  const [rows, setRows] = useState(() => JSON.parse(params.items ?? "[]").map(toRow));
  const [errors, setErrors] = useState({});
  const [saveError, setSaveError] = useState("");
  const [saving, setSaving] = useState(false);

  const totalCount = rows.reduce((sum, row) => sum + row.quantity, 0);

  function updateRow(rowId, changes) {
    setRows((prev) => prev.map((row) => (row.rowId === rowId ? { ...row, ...changes } : row)));
    if (errors[rowId]) setErrors((prev) => ({ ...prev, [rowId]: undefined }));
  }

  function removeRow(rowId) {
    setRows((prev) => prev.filter((row) => row.rowId !== rowId));
  }

  function addBlankRow() {
    setRows((prev) => [...prev, toRow({})]);
  }

  function validate() {
    const e = {};
    rows.forEach((row) => {
      const rowErrors = {};
      if (row.name.trim().length < 2) rowErrors.name = "Name is required.";
      if (!displayToIso(row.expiry)) rowErrors.expiry = "Use MM/DD/YYYY.";
      if (Object.keys(rowErrors).length) e[row.rowId] = rowErrors;
    });
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSave() {
    setSaveError("");
    if (!activeMember) {
      setSaveError("Pick a profile first, then scan again.");
      return;
    }
    if (!validate()) return;

    setSaving(true);
    try {
      const items = rows.map((row) => ({
        foodName: row.name.trim(),
        expirationDate: displayToIso(row.expiry),
        ripenessLevel: row.ripeness.slice(0, 30),
        quantity: row.quantity,
      }));
      await createItemsBulk(token, activeMember.id, items);
      router.replace("/(app)/home");
    } catch (err) {
      setSaveError(err.message ?? "Could not save items. Try again.");
    } finally {
      setSaving(false);
    }
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
            <Text style={styles.title}>Review Items</Text>
            <View style={{ width: 20 }} />
          </View>

          <Text style={styles.subtitle}>
            Check what we found. Fix anything that's off, then add them to your fridge.
          </Text>

          {rows.map((row) => (
            <View key={row.rowId} style={styles.card}>
              <View style={styles.cardHeader}>
                {row.lowConfidence ? (
                  <View style={styles.checkBadge}>
                    <Feather name="help-circle" size={12} color={Colors.warnText} />
                    <Text style={styles.checkBadgeText}>Double-check this one</Text>
                  </View>
                ) : (
                  <View />
                )}
                <TouchableOpacity
                  onPress={() => removeRow(row.rowId)}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Feather name="trash-2" size={16} color={Colors.textMuted} />
                </TouchableOpacity>
              </View>

              <Input
                label="Item Name"
                value={row.name}
                onChangeText={(t) => updateRow(row.rowId, { name: t })}
                placeholder="e.g. Strawberries"
                autoCapitalize="words"
                error={errors[row.rowId]?.name}
              />

              <View style={styles.row}>
                <View style={styles.rowHalf}>
                  <Input
                    label="Expiry Date"
                    value={row.expiry}
                    onChangeText={(t) => updateRow(row.rowId, { expiry: t })}
                    placeholder="MM/DD/YYYY"
                    keyboardType="numbers-and-punctuation"
                    error={errors[row.rowId]?.expiry}
                  />
                </View>
                <View style={styles.rowHalf}>
                  <Text style={styles.inputLabel}>Quantity</Text>
                  <View style={styles.stepper}>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => updateRow(row.rowId, { quantity: Math.max(1, row.quantity - 1) })}
                    >
                      <Feather name="minus" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                    <Text style={styles.stepperValue}>{row.quantity}</Text>
                    <TouchableOpacity
                      style={styles.stepperBtn}
                      onPress={() => updateRow(row.rowId, { quantity: Math.min(20, row.quantity + 1) })}
                    >
                      <Feather name="plus" size={16} color={Colors.textSecondary} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}

          <TouchableOpacity style={styles.addRow} onPress={addBlankRow} activeOpacity={0.7}>
            <Feather name="plus" size={16} color={Colors.accentText} />
            <Text style={styles.addRowText}>Add something we missed</Text>
          </TouchableOpacity>

          {saveError ? (
            <View style={styles.errorBanner}>
              <Feather name="alert-circle" size={16} color={Colors.dangerText} />
              <Text style={styles.errorText}>{saveError}</Text>
            </View>
          ) : null}

          <Button
            label={totalCount === 1 ? "Add 1 Item to Fridge" : `Add ${totalCount} Items to Fridge`}
            onPress={handleSave}
            loading={saving}
            disabled={rows.length === 0}
            style={styles.submitBtn}
          />
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
    paddingBottom: 12,
  },
  title: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: 20,
  },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    padding: 16,
    paddingBottom: 4,
    marginBottom: 12,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  checkBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.warnBg,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  checkBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.warnText,
  },
  row: {
    flexDirection: "row",
    gap: 12,
  },
  rowHalf: {
    flex: 1,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textSecondary,
    marginBottom: 8,
  },
  stepper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    height: 48,
    paddingHorizontal: 6,
  },
  stepperBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
    marginBottom: 12,
  },
  addRowText: {
    fontSize: 14,
    fontWeight: "600",
    color: Colors.accentText,
  },
  errorBanner: {
    backgroundColor: Colors.dangerBg,
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 12,
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: Colors.dangerText,
  },
  submitBtn: {
    marginTop: 4,
  },
});
