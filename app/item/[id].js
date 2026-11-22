import { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Feather } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import Button from "../../components/Button";
import Colors from "../../constants/colors";
import { useAuth } from "../../context/AuthContext";
import { useAccount } from "../../context/AccountContext";
import { fetchItem, deleteItem } from "../../api/items";

function getDaysUntilExpiry(expiryDate) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return Math.round((expiry - today) / (1000 * 60 * 60 * 24));
}

function getExpiryStatus(days) {
  if (days < 0) return { label: `Expired ${Math.abs(days)} day${days === -1 ? "" : "s"} ago`, tone: "danger" };
  if (days === 0) return { label: "Expires today", tone: "danger" };
  if (days <= 3) return { label: `Expires in ${days} day${days === 1 ? "" : "s"}`, tone: "warn" };
  return { label: `Good for ${days} more days`, tone: "ok" };
}

function formatDate(value) {
  return new Date(value).toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function DetailRow({ icon, label, value }) {
  return (
    <View style={styles.detailRow}>
      <View style={styles.detailIcon}>
        <Feather name={icon} size={16} color={Colors.textSecondary} />
      </View>
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Text style={styles.detailValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function ItemDetailScreen() {
  const { id } = useLocalSearchParams();
  const { token } = useAuth();
  const { members } = useAccount();
  const [item, setItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        setItem(await fetchItem(token, id));
      } catch (err) {
        setError(err.message ?? "Couldn't load this item.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id, token]);

  function handleRemove() {
    Alert.alert("Remove item", `Remove ${item.food_name} from the fridge?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: async () => {
          setRemoving(true);
          try {
            await deleteItem(token, id);
            router.back();
          } catch (err) {
            setError(err.message ?? "Couldn't remove this item.");
            setRemoving(false);
          }
        },
      },
    ]);
  }

  const days = item ? getDaysUntilExpiry(item.expiration_date) : 0;
  const status = getExpiryStatus(days);
  const addedBy = members.find((m) => m.id === item?.profile_id)?.name ?? "Someone";

  const bannerStyle =
    status.tone === "danger" ? styles.bannerDanger
    : status.tone === "warn" ? styles.bannerWarn
    : styles.bannerOk;

  const bannerTextStyle =
    status.tone === "danger" ? styles.bannerTextDanger
    : status.tone === "warn" ? styles.bannerTextWarn
    : styles.bannerTextOk;

  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Feather name="chevron-left" size={22} color={Colors.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Item Details</Text>
        <View style={{ width: 22 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="small" color={Colors.accent} />
        </View>
      ) : !item ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{error || "Item not found."}</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.heroIcon}>
              <Text style={styles.heroIconText}>{item.food_name[0].toUpperCase()}</Text>
            </View>
            <Text style={styles.name}>{item.food_name}</Text>
          </View>

          <View style={[styles.banner, bannerStyle]}>
            <Feather
              name={status.tone === "ok" ? "check-circle" : "alert-circle"}
              size={16}
              color={bannerTextStyle.color}
            />
            <Text style={[styles.bannerText, bannerTextStyle]}>{status.label}</Text>
          </View>

          <View style={styles.card}>
            <DetailRow icon="calendar" label="Expires" value={formatDate(item.expiration_date)} />
            <DetailRow icon="droplet" label="Ripeness" value={item.ripeness_level || "n/a"} />
            <DetailRow icon="user" label="Added by" value={addedBy} />
            <DetailRow icon="clock" label="Added on" value={formatDate(item.created_at)} />
          </View>

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <Button
            label="Remove from Fridge"
            variant="secondary"
            onPress={handleRemove}
            loading={removing}
            style={styles.removeBtn}
          />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: "600",
    color: Colors.textPrimary,
    letterSpacing: -0.2,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 40,
  },
  hero: {
    alignItems: "center",
    paddingVertical: 20,
    gap: 12,
  },
  heroIcon: {
    width: 72,
    height: 72,
    borderRadius: 18,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
  },
  heroIconText: {
    fontSize: 30,
    fontWeight: "700",
    color: Colors.accentText,
  },
  name: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.4,
    textAlign: "center",
  },
  banner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderRadius: 12,
    padding: 12,
    marginBottom: 16,
  },
  bannerDanger: { backgroundColor: Colors.dangerBg },
  bannerWarn: { backgroundColor: Colors.warnBg },
  bannerOk: { backgroundColor: Colors.successBg },
  bannerText: {
    fontSize: 14,
    fontWeight: "600",
  },
  bannerTextDanger: { color: Colors.dangerText },
  bannerTextWarn: { color: Colors.warnText },
  bannerTextOk: { color: Colors.successText },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  detailIcon: {
    width: 32,
    height: 32,
    borderRadius: 8,
    backgroundColor: Colors.borderLight,
    alignItems: "center",
    justifyContent: "center",
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  detailValue: {
    fontSize: 15,
    fontWeight: "500",
    color: Colors.textPrimary,
    marginTop: 2,
  },
  errorText: {
    fontSize: 13,
    color: Colors.dangerText,
    textAlign: "center",
    marginBottom: 12,
  },
  removeBtn: {
    marginTop: 4,
  },
});
