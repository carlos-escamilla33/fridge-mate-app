import { useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  SafeAreaView,
  ActivityIndicator,
} from "react-native";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { useAccount } from "../context/AccountContext";
import Colors from "../constants/colors";

const AVATAR_COLORS = [
  '#10B981', '#3B82F6', '#F59E0B', '#8B5CF6', '#EF4444',
];

export default function ProfilesScreen() {
  const { members, fetchMembers, isLoading } = useAccount();
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    fetchMembers();
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 450, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 400, useNativeDriver: true }),
    ]).start();
  }, []);

  function getInitials(name) {
    return name ? name[0].toUpperCase() : "?";
  }

  function renderMember({ item, index }) {
    if (item.isAdd) {
      return (
        <TouchableOpacity
          style={styles.profileCard}
          activeOpacity={0.7}
          onPress={() => router.push("/create-profile")}
        >
          <View style={styles.addAvatar}>
            <Feather name="user-plus" size={22} color={Colors.textMuted} />
          </View>
          <Text style={styles.addLabel}>Add member</Text>
        </TouchableOpacity>
      );
    }

    const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
    return (
      <TouchableOpacity
        style={styles.profileCard}
        onPress={() => router.replace("/(app)/home")}
        activeOpacity={0.7}
      >
        <View style={[styles.avatar, { backgroundColor: color + '1A' }]}>
          <Text style={[styles.avatarText, { color }]}>{getInitials(item.name)}</Text>
        </View>
        <Text style={styles.profileName}>{item.name}</Text>
        {item.is_admin && (
          <View style={styles.adminBadge}>
            <Text style={styles.adminBadgeText}>Admin</Text>
          </View>
        )}
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <Animated.View
          style={[styles.content, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}
        >
          <Text style={styles.title}>Who's cooking?</Text>
          <Text style={styles.subtitle}>Select your profile to continue</Text>

          {isLoading ? (
            <ActivityIndicator size="large" color={Colors.accent} style={styles.loader} />
          ) : (
            <FlatList
              data={[...members, { id: "add", name: "Add Member", isAdd: true }]}
              renderItem={renderMember}
              keyExtractor={(item) => String(item.id)}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.grid}
              scrollEnabled={false}
            />
          )}
        </Animated.View>
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
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: Colors.textPrimary,
    marginBottom: 6,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 40,
  },
  loader: {
    marginTop: 40,
  },
  grid: {
    gap: 12,
  },
  row: {
    gap: 12,
    justifyContent: "center",
  },
  profileCard: {
    width: 148,
    backgroundColor: Colors.card,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 18,
    padding: 22,
    alignItems: "center",
    gap: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontSize: 22,
    fontWeight: "700",
  },
  profileName: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.textPrimary,
  },
  adminBadge: {
    backgroundColor: Colors.accentLight,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: "600",
    color: Colors.accentText,
  },
  addAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.borderLight,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderStyle: "dashed",
    alignItems: "center",
    justifyContent: "center",
  },
  addLabel: {
    fontSize: 13,
    color: Colors.textMuted,
  },
});
