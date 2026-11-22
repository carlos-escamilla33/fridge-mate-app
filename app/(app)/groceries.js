import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { useFocusEffect } from "expo-router";
import Colors from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { useAccount } from "../../context/AccountContext";
import { fetchItems } from "../../api/items";
import {
  fetchGroceries,
  addGrocery,
  setGroceryChecked,
  removeGrocery,
  clearCheckedGroceries,
} from "../../api/groceries";
import { parseDateOnly } from "../../utils/dates";

const SUGGEST_WITHIN_DAYS = 3;

function getDaysUntilExpiry(expirationDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return Math.round((parseDateOnly(expirationDate) - today) / (1000 * 60 * 60 * 24));
}

function expiryLabel(days) {
  if (days < 0) return "Expired";
  if (days === 0) return "Expires today";
  if (days === 1) return "Expires tomorrow";
  return `Expires in ${days} days`;
}

// One suggestion per food name for items expiring soon, skipping anything already on the list.
function buildSuggestions(items, groceries, dismissedNames) {
  const onList = new Set(groceries.map((g) => g.name.trim().toLowerCase()));
  const byName = new Map();

  items.forEach((item) => {
    const key = item.food_name.trim().toLowerCase();
    const days = getDaysUntilExpiry(item.expiration_date);
    if (days > SUGGEST_WITHIN_DAYS || onList.has(key) || dismissedNames.has(key)) return;
    const existing = byName.get(key);
    if (!existing || days < existing.days) {
      byName.set(key, { key, name: item.food_name, itemId: item.item_id, days });
    }
  });

  return [...byName.values()].sort((a, b) => a.days - b.days);
}

export default function GroceriesScreen() {
  const { token } = useAuth();
  const { activeMember } = useAccount();
  const [items, setItems] = useState([]);
  const [groceries, setGroceries] = useState([]);
  const [dismissedNames, setDismissedNames] = useState(new Set());
  const [newName, setNewName] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  async function load() {
    try {
      const [itemRows, groceryRows] = await Promise.all([fetchItems(token), fetchGroceries(token)]);
      setItems(itemRows);
      setGroceries(groceryRows);
      setError("");
    } catch (err) {
      setError(err.message ?? "Couldn't load your grocery list.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      load();
    }, [token])
  );

  function handleRefresh() {
    setRefreshing(true);
    load();
  }

  async function handleAdd(name, sourceItemId = null) {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      const grocery = await addGrocery(token, {
        name: trimmed,
        profileId: activeMember?.id ?? null,
        sourceItemId,
      });
      setGroceries((prev) => [grocery, ...prev]);
      setError("");
    } catch (err) {
      setError(err.message ?? "Couldn't add that item.");
    }
  }

  async function handleAddOwn() {
    const name = newName;
    setNewName("");
    await handleAdd(name);
  }

  function handleDismiss(key) {
    setDismissedNames((prev) => new Set(prev).add(key));
  }

  async function handleToggle(grocery) {
    const checked = !grocery.checked;
    // Update right away so the tap feels instant; roll back if the request fails.
    setGroceries((prev) => prev.map((g) => (g.grocery_item_id === grocery.grocery_item_id ? { ...g, checked } : g)));
    try {
      await setGroceryChecked(token, grocery.grocery_item_id, checked);
    } catch (err) {
      setGroceries((prev) => prev.map((g) => (g.grocery_item_id === grocery.grocery_item_id ? grocery : g)));
      setError(err.message ?? "Couldn't update that item.");
    }
  }

  async function handleRemove(grocery) {
    setGroceries((prev) => prev.filter((g) => g.grocery_item_id !== grocery.grocery_item_id));
    try {
      await removeGrocery(token, grocery.grocery_item_id);
    } catch (err) {
      setError(err.message ?? "Couldn't remove that item.");
      load();
    }
  }

  async function handleClearChecked() {
    setGroceries((prev) => prev.filter((g) => !g.checked));
    try {
      await clearCheckedGroceries(token);
    } catch (err) {
      setError(err.message ?? "Couldn't clear checked items.");
      load();
    }
  }

  const suggestions = buildSuggestions(items, groceries, dismissedNames);
  const toBuy = groceries.filter((g) => !g.checked);
  const checked = groceries.filter((g) => g.checked);

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <SafeAreaView style={styles.flex} edges={["top"]}>
        <View style={styles.header}>
          <Text style={styles.title}>Grocery List</Text>
          <Text style={styles.subtitle}>
            {toBuy.length === 0 ? "Nothing to buy yet" : `${toBuy.length} item${toBuy.length === 1 ? "" : "s"} to buy`}
          </Text>
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.accent} />
          }
        >
          <View style={styles.addRow}>
            <TextInput
              style={styles.addInput}
              value={newName}
              onChangeText={setNewName}
              placeholder="Add an item, e.g. Eggs"
              placeholderTextColor={Colors.textMuted}
              autoCapitalize="words"
              returnKeyType="done"
              onSubmitEditing={handleAddOwn}
            />
            <TouchableOpacity
              style={[styles.addBtn, !newName.trim() && styles.addBtnDisabled]}
              onPress={handleAddOwn}
              disabled={!newName.trim()}
              activeOpacity={0.8}
            >
              <Feather name="plus" size={20} color={Colors.white} />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}

          {loading ? (
            <View style={styles.center}>
              <ActivityIndicator size="small" color={Colors.accent} />
            </View>
          ) : (
            <>
              {suggestions.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>Running Low Soon</Text>
                  <View style={styles.list}>
                    {suggestions.map((s) => (
                      <View key={s.key} style={styles.suggestionCard}>
                        <View style={styles.suggestionText}>
                          <Text style={styles.itemName}>{s.name}</Text>
                          <Text style={[styles.itemMeta, s.days <= 0 && styles.itemMetaDanger]}>
                            {expiryLabel(s.days)}
                          </Text>
                        </View>
                        <TouchableOpacity
                          onPress={() => handleDismiss(s.key)}
                          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                          style={styles.dismissBtn}
                        >
                          <Feather name="x" size={16} color={Colors.textMuted} />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.acceptBtn}
                          onPress={() => handleAdd(s.name, s.itemId)}
                          activeOpacity={0.8}
                        >
                          <Feather name="plus" size={14} color={Colors.accentText} />
                          <Text style={styles.acceptText}>Add</Text>
                        </TouchableOpacity>
                      </View>
                    ))}
                  </View>
                </View>
              )}

              {toBuy.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>To Buy</Text>
                  <View style={styles.list}>
                    {toBuy.map((g) => (
                      <GroceryRow key={g.grocery_item_id} grocery={g} onToggle={handleToggle} onRemove={handleRemove} />
                    ))}
                  </View>
                </View>
              )}

              {checked.length > 0 && (
                <View style={styles.section}>
                  <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>In the Cart</Text>
                    <TouchableOpacity onPress={handleClearChecked} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                      <Text style={styles.clearText}>Clear</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.list}>
                    {checked.map((g) => (
                      <GroceryRow key={g.grocery_item_id} grocery={g} onToggle={handleToggle} onRemove={handleRemove} />
                    ))}
                  </View>
                </View>
              )}

              {groceries.length === 0 && suggestions.length === 0 && (
                <View style={styles.empty}>
                  <View style={styles.emptyIcon}>
                    <Feather name="shopping-cart" size={24} color={Colors.textMuted} />
                  </View>
                  <Text style={styles.emptyText}>Your list is empty.</Text>
                  <Text style={styles.emptySubtext}>
                    Items about to expire will show up here as suggestions.
                  </Text>
                </View>
              )}
            </>
          )}
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function GroceryRow({ grocery, onToggle, onRemove }) {
  return (
    <View style={styles.groceryCard}>
      <TouchableOpacity style={styles.groceryMain} onPress={() => onToggle(grocery)} activeOpacity={0.7}>
        <View style={[styles.checkbox, grocery.checked && styles.checkboxChecked]}>
          {grocery.checked && <Feather name="check" size={14} color={Colors.white} />}
        </View>
        <Text style={[styles.itemName, grocery.checked && styles.itemNameChecked]} numberOfLines={1}>
          {grocery.name}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => onRemove(grocery)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Feather name="trash-2" size={16} color={Colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 14,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 20,
  },
  addRow: {
    flexDirection: "row",
    gap: 10,
  },
  addInput: {
    flex: 1,
    height: 48,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  addBtn: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnDisabled: {
    opacity: 0.4,
  },
  errorBanner: {
    backgroundColor: Colors.dangerBg,
    borderRadius: 12,
    padding: 12,
  },
  errorText: {
    fontSize: 13,
    color: Colors.dangerText,
  },
  center: {
    paddingTop: 40,
    alignItems: "center",
  },
  section: {
    gap: 10,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: Colors.textMuted,
  },
  clearText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.accentText,
  },
  list: {
    gap: 8,
  },
  suggestionCard: {
    backgroundColor: Colors.warnBg,
    borderWidth: 1,
    borderColor: "#FDE68A",
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  suggestionText: {
    flex: 1,
  },
  dismissBtn: {
    padding: 2,
  },
  acceptBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: Colors.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  acceptText: {
    fontSize: 13,
    fontWeight: "600",
    color: Colors.accentText,
  },
  groceryCard: {
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  groceryMain: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  itemName: {
    flexShrink: 1,
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  itemNameChecked: {
    color: Colors.textMuted,
    textDecorationLine: "line-through",
  },
  itemMeta: {
    fontSize: 12,
    color: Colors.warnText,
    marginTop: 2,
  },
  itemMetaDanger: {
    color: Colors.dangerText,
  },
  empty: {
    alignItems: "center",
    paddingTop: 60,
    gap: 8,
  },
  emptyIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    paddingHorizontal: 20,
  },
});
