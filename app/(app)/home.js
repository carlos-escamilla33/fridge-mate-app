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

function getDaysUntilExpiry(expiryDate) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const expiry = new Date(expiryDate);
    expiry.setHours(0, 0, 0, 0);
    return Math.round(expiry - today) / (100 * 60 * 60 * 24);
}

export default function HomeScreen() {
  const {user} = useAuth();
  const [activeFilter, setActiveFilter] = useState("All");

  const expiringCount = MOCK_ITEMS.filter(
    (i) => getDaysUntilExpiry(i.expiryDate) <= 3
  ).length;

  const filteredItems = MOCK_ITEMS.filter((item) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Expiring Soon") return getDaysUntilExpiry(item.expiryDate) <= 3;
    
    return item.category === activeFilter;
  });

  const expiringItems = filteredItems.filter(
    (i) => getDaysUntilExpiry(i.expiryDate) <= 3
  )

  const freshItems = filteredItems.filter(
    (i) => getDaysUntilExpiry(i.expiryDate) > 3
  )

  function getInitials(name) {
    if (!name) return "Y";
    return name[0].toUpperCase();
  }

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  return (
    <View >

    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.cream,
  },
  safe: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  date: {
    fontSize: 13,
    color: Colors.bark,
    marginTop: 2,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.moss,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textOnDark,
  },
  filterScroll: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    gap: 8,
  },
  filterTab: {
    backgroundColor: Colors.parchment,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
  },
  filterTabActive: {
    backgroundColor: Colors.forest,
  },
  filterTabText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.bark,
  },
  filterTabTextActive: {
    color: Colors.textOnDark,
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
    borderColor: '#F0D4A8',
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  expiryBannerIcon: {
    fontSize: 18,
  },
  expiryBannerText: {
    fontSize: 13,
    color: Colors.warnText,
    flex: 1,
    lineHeight: 19,
  },
  expiryBannerBold: {
    fontWeight: '600',
    color: '#5C3D10',
  },
  section: {
    gap: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
    color: Colors.textMuted,
  },
  itemList: {
    gap: 10,
  },
  empty: {
    alignItems: 'center',
    paddingTop: 80,
    gap: 8,
  },
  emptyEmoji: {
    fontSize: 48,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  emptySubtext: {
    fontSize: 14,
    color: Colors.bark,
  },
});
 