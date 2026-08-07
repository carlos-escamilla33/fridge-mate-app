import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from "react-native";
import { useAuth } from "../../context/AuthContext";
import FoodItem from "../../components/FoodItem";
import Colors from "../../constants/colors";

const FILTERS = ["All", "Expiring Soon", "Dairy", "Produce", "Meat", "Other"];

const MOCK_ITEMS = [
  {
    id: "1",
    name: "Whole Milk",
    quantity: "1 gal",
    addedBy: "Ana",
    category: "Dairy",
    expiryDate: new Date().toISOString(),
  },
  {
    id: "2",
    name: "Blueberries",
    quantity: "1 pint",
    addedBy: "Carlos",
    category: "Produce",
    expiryDate: new Date(Date.now() + 2 * 86400000).toISOString(),
  },
  {
    id: "3",
    name: "Broccoli",
    quantity: "1 head",
    addedBy: "Carlos",
    category: "Produce",
    expiryDate: new Date(Date.now() + 6 * 86400000).toISOString(),
  },
  {
    id: "4",
    name: "Sharp Cheddar",
    quantity: "8 oz",
    addedBy: "Ana",
    category: "Dairy",
    expiryDate: new Date(Date.now() + 12 * 86400000).toISOString(),
  },
  {
    id: "5",
    name: "Chicken Breast",
    quantity: "2 lbs",
    addedBy: "Carlos",
    category: "Meat",
    expiryDate: new Date(Date.now() + 1 * 86400000).toISOString(),
  },
];

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
  const { user } = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");

  const expiringCount = MOCK_ITEMS.filter(
    (i) => getDaysUntilExpiry(i.expiryDate) <= 3
  ).length;

  const filteredItems = MOCK_ITEMS.filter((item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Expiring Soon") return getDaysUntilExpiry(item.expiryDate) <= 3;
    return item.category === activeFilter;
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
      <SafeAreaView style={styles.safe}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Our Fridge</Text>
            <Text style={styles.date}>{today}</Text>
          </View>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScrollView}
          contentContainerStyle={styles.filterScroll}
        >
          {FILTERS.map((f) => (
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
        >
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
                  <FoodItem key={item.id} item={item} />
                ))}
              </View>
            </View>
          )}

          {freshItems.length > 0 && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Fresh</Text>
              <View style={styles.itemList}>
                {freshItems.map((item) => (
                  <FoodItem key={item.id} item={item} />
                ))}
              </View>
            </View>
          )}

          {filteredItems.length === 0 && (
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
