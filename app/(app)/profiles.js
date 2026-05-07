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
}