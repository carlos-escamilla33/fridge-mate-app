import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useAuth } from '../../context/AuthContext';
// import FoodItem from '../../components/ui/FoodItem';
import Colors from '../../constants/colors';
 
const FILTERS = ['All', 'Expiring Soon', 'Dairy', 'Produce', 'Meat', 'Other'];

// Placeholder data — replace with API calls to your backend
const MOCK_ITEMS = [
  {
    id: '1',
    name: 'Whole Milk',
    emoji: '🥛',
    quantity: '1 gal',
    addedBy: 'Ana',
    category: 'Dairy',
    expiryDate: new Date().toISOString(),
  },
  {
    id: '2',
    name: 'Blueberries',
    emoji: '🫐',
    quantity: '1 pint',
    addedBy: 'Carlos',
    category: 'Produce',
    expiryDate: new Date(Date.now() + 2 * 86400000).toISOString(),
  },
  {
    id: '3',
    name: 'Broccoli',
    emoji: '🥦',
    quantity: '1 head',
    addedBy: 'Carlos',
    category: 'Produce',
    expiryDate: new Date(Date.now() + 6 * 86400000).toISOString(),
  },
  {
    id: '4',
    name: 'Sharp Cheddar',
    emoji: '🧀',
    quantity: '8 oz',
    addedBy: 'Ana',
    category: 'Dairy',
    expiryDate: new Date(Date.now() + 12 * 86400000).toISOString(),
  },
  {
    id: '5',
    name: 'Chicken Breast',
    emoji: '🍗',
    quantity: '2 lbs',
    addedBy: 'Carlos',
    category: 'Meat',
    expiryDate: new Date(Date.now() + 1 * 86400000).toISOString(),
  },
];