import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/colors';

function SettingsRow({ icon, label, onPress, danger }) {
  return (
    <TouchableOpacity
      style={[styles.settingsRow, danger && styles.settingsRowDanger]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={styles.settingsLeft}>
        <View style={[styles.settingsIcon, danger && styles.settingsIconDanger]}>
          <Text style={styles.settingsIconText}>{icon}</Text>
        </View>
        <Text style={[styles.settingsLabel, danger && styles.settingsLabelDanger]}>
          {label}
        </Text>
      </View>
      {!danger && <Text style={styles.chevron}>›</Text>}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const { user, signOut } = useAuth();

  function getInitials(name) {
    if (!name) return 'Y';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  function handleSignOut() {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Sign Out', style: 'destructive', onPress: signOut },
      ]
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={styles.hero}>
            <View style={styles.bigAvatar}>
              <Text style={styles.bigAvatarText}>{getInitials(user?.name)}</Text>
            </View>
            <Text style={styles.heroName}>{user?.name ?? 'Your Name'}</Text>
            <Text style={styles.heroEmail}>{user?.email ?? ''}</Text>
            {user?.isAdmin && (
              <View style={styles.adminBadge}>
                <Text style={styles.adminBadgeText}>Household Admin</Text>
              </View>
            )}
          </View>

          {/* Stats */}
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

          {/* Settings */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Preferences</Text>
            <View style={styles.settingsGroup}>
              <SettingsRow icon="🔔" label="Notifications" onPress={() => {}} />
              <SettingsRow icon="⏰" label="Expiry Reminders" onPress={() => {}} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Household</Text>
            <View style={styles.settingsGroup}>
              <SettingsRow icon="👥" label="Manage Members" onPress={() => {}} />
              <SettingsRow icon="🏠" label="Household Settings" onPress={() => {}} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Account</Text>
            <View style={styles.settingsGroup}>
              <SettingsRow icon="✏️" label="Edit Profile" onPress={() => {}} />
              <SettingsRow icon="🔒" label="Change Password" onPress={() => {}} />
              <SettingsRow
                icon="🚪"
                label="Sign Out"
                onPress={handleSignOut}
                danger
              />
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
    backgroundColor: Colors.cream,
  },
  safe: {
    flex: 1,
  },
  hero: {
    backgroundColor: Colors.forest,
    alignItems: 'center',
    paddingTop: 32,
    paddingBottom: 48,
    gap: 6,
  },
  bigAvatar: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Colors.sage,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  bigAvatarText: {
    fontSize: 28,
    fontWeight: '700',
    color: '#1A2E18',
  },
  heroName: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textOnDark,
    letterSpacing: -0.3,
  },
  heroEmail: {
    fontSize: 13,
    color: Colors.textOnDarkMuted,
  },
  adminBadge: {
    backgroundColor: Colors.sage,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    marginTop: 4,
  },
  adminBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1A2E18',
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderColor: Colors.border,
    marginTop: -24,
    marginHorizontal: 20,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
  },
  statBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: Colors.border,
  },
  statNum: {
    fontSize: 24,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  statDesc: {
    fontSize: 11,
    color: Colors.bark,
    marginTop: 2,
    textAlign: 'center',
  },
  section: {
    paddingHorizontal: 20,
    paddingTop: 28,
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  settingsGroup: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 14,
    borderBottomWidth: 1,
    borderColor: Colors.border,
  },
  settingsRowDanger: {
    borderColor: Colors.dangerBg,
  },
  settingsLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  settingsIcon: {
    width: 32,
    height: 32,
    backgroundColor: Colors.parchment,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  settingsIconDanger: {
    backgroundColor: Colors.dangerBg,
  },
  settingsIconText: {
    fontSize: 15,
  },
  settingsLabel: {
    fontSize: 14,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  settingsLabelDanger: {
    color: Colors.dangerText,
  },
  chevron: {
    fontSize: 18,
    color: Colors.textMuted,
  },
  version: {
    textAlign: 'center',
    fontSize: 12,
    color: Colors.textMuted,
    paddingVertical: 32,
  },
});