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
}