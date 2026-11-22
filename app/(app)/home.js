import { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, useFocusEffect } from "expo-router";
import { useAuth } from "../../context/AuthContext";
import { useAccount } from "../../context/AccountContext";
import { fetchItems } from "../../api/items";
import FoodItem from "../../components/FoodItem";
import Colors from "../../constants/colors";

// Backend item rows use item_id / food_name / expiration_date; FoodItem expects id / name / expiryDate.
function toFoodItem(row, members) {
  const member = members.find((m) => m.id === row.profile_id);
  return {
    id: String(row.item_id),
    name: row.food_name,
    expiryDate: row.expiration_date,
    quantity: row.ripeness_level && row.ripeness_level !== "n/a" ? row.ripeness_level : null,
    addedBy: member?.name,
    profileId: row.profile_id,
  };
}

function getDaysUntilExpiry(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
}

function getInitials(name) {
  if (!name) return "Y";
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

export default function HomeScreen() {
  const { user, token } = useAuth();
  const { members, activeMember } = useAccount();
  const [activeFilter, setActiveFilter] = useState("All");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [loadError, setLoadError] = useState("");

  const filters = ["All", "Expiring Soon", ...members.map((m) => m.name)];

  async function loadItems() {
    try {
      const rows = await fetchItems(token);
      setItems(rows.map((row) => toFoodItem(row, members)));
      setLoadError("");
    } catch (err) {
      setLoadError(err.message ?? "Couldn't load your fridge.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  // Reload every time the tab comes into view, e.g. after adding or scanning items.
  useFocusEffect(
    useCallback(() => {
      loadItems();
    }, [token, members])
  );

  function handleRefresh() {
    setRefreshing(true);
    loadItems();
  }

  const expiringCount = items.filter(
    (i) => getDaysUntilExpiry(i.expiryDate) <= 3
  ).length;

  const filteredItems = items.filter((item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Expiring Soon") return getDaysUntilExpiry(item.expiryDate) <= 3;
    return item.addedBy === activeFilter;
  });

  const expiringItems = filteredItems.filter((i) => getDaysUntilExpiry(i.expiryDate) <= 3);
  const freshItems = filteredItems.filter((i) => getDaysUntilExpiry(i.expiryDate) > 3);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe} edges={["top"]}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Our Fridge</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(activeMember?.name ?? user?.name)}</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterScroll}
        >
          {filters.map((f) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, activeFilter === f && styles.filterTabActive]}
              onPress={() => setActiveFilter(f)}
              activeOpacity={0.7}
            >
              <Text style={[styles.filterTabText, activeFilter === f && styles.filterTabTextActive]}>
                {f}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} tintColor={Colors.accent} />
          }
        >
          {loading && (
            <View style={styles.empty}>
              <ActivityIndicator size="small" color={Colors.accent} />
            </View>
          )}

          {loadError ? (
            <View style={styles.errorBanner}>
              <Text style={styles.errorText}>{loadError} Pull down to try again.</Text>
            </View>
          ) : null}

          {expiringCount > 0 && (
            <View style={styles.expiryBanner}>
              <View style={styles.expiryBannerDot} />
              <Text style={styles.expiryBannerText}>
                <Text style={styles.expiryBannerBold}>
                  {expiringCount} item{expiringCount > 1 ? "s" : ""}
                </Text>{" "}
                expiring within 3 days
              </Text>
            </View>
          )}

          {expiringItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Expiring Soon</Text>
              <View style={styles.itemList}>
                {expiringItems.map((item) => (
                  <FoodItem key={item.id} item={item} onPress={() => router.push(`/item/${item.id}`)} />
                ))}
              </View>
            </View>
          )}

          {freshItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fresh</Text>
              <View style={styles.itemList}>
                {freshItems.map((item) => (
                  <FoodItem key={item.id} item={item} onPress={() => router.push(`/item/${item.id}`)} />
                ))}
              </View>
            </View>
          )}

          {!loading && !loadError && filteredItems.length === 0 && (
            <View style={styles.empty}>
              <View style={styles.emptyIcon}>
                <Text style={styles.emptyIconText}>?</Text>
              </View>
              <Text style={styles.emptyText}>Nothing here yet.</Text>
              <Text style={styles.emptySubtext}>Tap Add to add your first item.</Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
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
  date: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 14,
    fontWeight: "700",
    color: Colors.accentText,
  },
  filterScrollView: {
    maxHeight: 44,
    marginBottom: 12,
  },
  filterScroll: {
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  filterTab: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    height: 34,
    justifyContent: "center",
  },
  filterTabActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
  filterTabTextActive: {
    color: Colors.white,
    fontWeight: "600",
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 20,
  },
  expiryBanner: {
    backgroundColor: Colors.warnBg,
    borderWidth: 1,
    borderColor: '#FDE68A',
    borderRadius: 12,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  expiryBannerDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.warn,
    flexShrink: 0,
  },
  expiryBannerText: {
    fontSize: 13,
    color: Colors.warnText,
    flex: 1,
    lineHeight: 19,
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
  expiryBannerBold: {
    fontWeight: "600",
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
    textTransform: "uppercase",
    color: Colors.textMuted,
  },
  itemList: {
    gap: 8,
  },
  empty: {
    alignItems: "center",
    paddingTop: 80,
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
  emptyIconText: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textMuted,
  },
  emptyText: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.textPrimary,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});
