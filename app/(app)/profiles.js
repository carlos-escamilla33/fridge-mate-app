import { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Animated,
  SafeAreaView,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import Colors from '../../constants/colors';

export default function ProfilesScreen() {
    const {user} = useAuth
    const fadeAmin = useRef(new Animated.Value(0)).current;
    const slideAnim = useRef(new Animated.Value(30)).current;

    // Fix this to come from backend later on
    // ONLY FOR TESTING PURPOSES

    const [members] = useState([
      {id: user?.id ?? "1", name: user?.name ?? "You", isAdmin: true},
    ])

    useEffect(() => {
      Animated.parallel([
        Animated.timing(fadeAmin, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 450,
          useNativeDriver: true,
        }),
      ]).start()
    }, []);

    function handleSelectProfile(member) {
      router.replace("/(app)/home");
    }

    function getInitials(name) {
      return name[0].toUpperCase()
    }

    function renderMember({item, index}) {
      const color = AVATAR_COLORS[index % AVATAR_COLORS.length];
      return (
        <TouchableOpacity>

        </TouchableOpacity>
      )
    }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.forest,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.textOnDark,
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textOnDarkMuted,
    marginBottom: 40,
  },
  grid: {
    gap: 12,
  },
  row: {
    gap: 12,
    justifyContent: 'center',
  },
  profileCard: {
    width: 140,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    gap: 10,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textOnDark,
  },
  profileName: {
    fontSize: 14,
    fontWeight: '500',
    color: Colors.textOnDark,
  },
  adminBadge: {
    backgroundColor: Colors.sage,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  adminBadgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1A2E18',
  },
  addAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.2)',
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
  },
  addAvatarText: {
    fontSize: 26,
    color: 'rgba(255,255,255,0.35)',
    lineHeight: 30,
  },
  addLabel: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.35)',
  },
});
 