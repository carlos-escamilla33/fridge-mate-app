import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { useAuth } from "../../context/AuthContext";
import Colors from "../../constants/colors";

function SettingsRow({ icon, label, onPress, danger }) {
  return (
    <TouchableOpacity
      style={styles.settingsRow}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingsLeft}>
        <View style={[styles.settingsIcon, danger && styles.settingsIconDanger]}>
          <Feather
            name={icon}
            size={16}
            color={danger ? Colors.dangerText : Colors.textSecondary}
          />
        </View>
        <Text style={[styles.settingsLabel, danger && styles.settingsLabelDanger]}>
          {label}
        </Text>
      </View>
      {!danger && <Feather name="chevron-right" size={16} color={Colors.textMuted} />}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  function getInitials(name) {
    if (!name) return "Y";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }

  function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      { text: "Sign Out", style: "destructive", onPress: signOut },
    ]);
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View style={styles.hero}>
            <View style={styles.bigAvatar}>
              <Text style={styles.bigAvatarText}>{getInitials(user?.name)}</Text>
            </View>
            <Text style={styles.heroName}>{user?.name ?? "Your Name"}</Text>
            <Text style={styles.heroEmail}>{user?.email ?? ""}</Text>
            {user?.isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Household Admin</Text>
              </View>
            )}
          </View>

          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>24</Text>
              <Text style={styles.statDesc}>Items added</Text>
            </View>
            <View style={[styles.statItem, styles.statBorder]}>
              <Text style={styles.statNum}>7</Text>
              <Text style={styles.statDesc}>Saved from waste</Text>
            </View>
            <View style={styles.statItem}>
              <Text style={styles.statNum}>2</Text>
              <Text style={styles.statDesc}>Members</Text>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.settingsGroup}>
              <SettingsRow icon="bell" label="Notifications" onPress={() => {}} />
              <SettingsRow icon="clock" label="Expiry Reminders" onPress={() => {}} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Household</Text>
            <View style={styles.settingsGroup}>
              <SettingsRow icon="users" label="Manage Members" onPress={() => {}} />
              <SettingsRow icon="settings" label="Household Settings" onPress={() => {}} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.settingsGroup}>
              <SettingsRow icon="edit-2" label="Edit Profile" onPress={() => {}} />
              <SettingsRow icon="lock" label="Change Password" onPress={() => {}} />
              <SettingsRow icon="log-out" label="Sign Out" onPress={handleSignOut} danger />
            </View>
          </View>

          <Text style={styles.version}>FridgeMate v1.0.0</Text>
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
  hero: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    alignItems: "center",
    paddingTop: 32,
    paddingBottom: 28,
    gap: 4,
  },
  bigAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.accentLight,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 8,
  },
  bigAvatarText: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.accentText,
  },
  heroName: {
    fontSize: 20,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.3,
  },
  heroEmail: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  adminBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 6,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: Colors.accentText,
  },
  statsRow: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    marginBottom: 8,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 16,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
  },
  statNum: {
    fontSize: 22,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  statDesc: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    textAlign: "center",
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 24,
    gap: 8,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
    color: Colors.textMuted,
  },
  settingsGroup: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: "hidden",
  },
  settingsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  settingsLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    backgroundColor: Colors.bg,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  settingsIconDanger: {
    backgroundColor: Colors.dangerBg,
  },
  settingsLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: "500",
  },
  settingsLabelDanger: {
    color: Colors.dangerText,
  },
  version: {
    textAlign: "center",
    fontSize: 12,
    color: Colors.textMuted,
    paddingVertical: 32,
  },
});
