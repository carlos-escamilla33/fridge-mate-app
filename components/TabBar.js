import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import Colors from '../constants/colors';

// Tab order comes from the Tabs.Screen order in app/(app)/_layout.js; this sets how each one looks.
const TABS = {
  home: { label: 'Fridge', icon: 'home' },
  recipes: { label: 'Recipes', icon: 'book-open' },
  'add-item': { label: 'Add', icon: 'plus', center: true },
  groceries: { label: 'Groceries', icon: 'shopping-cart' },
  profile: { label: 'Profile', icon: 'user' },
};

export default function TabBar({ state, emitter, navigateToTab }) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.bar, { paddingBottom: Math.max(insets.bottom, 10) }]}>
      {state.routes.map((route, index) => {
        const tab = TABS[route.name];
        if (!tab) return null;

        const focused = state.index === index;
        const color = focused ? Colors.accent : Colors.textMuted;

        function handlePress() {
          const event = emitter.emit({ type: 'tabPress', target: route.key, canPreventDefault: true });
          if (!focused && !event.defaultPrevented) {
            navigateToTab(route.key);
          }
        }

        return (
          <TouchableOpacity
            key={route.key}
            style={styles.slot}
            onPress={handlePress}
            activeOpacity={0.7}
            accessibilityRole="button"
            accessibilityLabel={tab.label}
            accessibilityState={{ selected: focused }}
          >
            {tab.center ? (
              <View style={[styles.addButton, focused && styles.addButtonFocused]}>
                <Feather name={tab.icon} size={26} color={Colors.white} />
              </View>
            ) : (
              <Feather name={tab.icon} size={22} color={color} />
            )}
            <Text style={[styles.label, { color }]} numberOfLines={1}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    paddingHorizontal: 4,
  },
  slot: {
    flex: 1,
    alignItems: 'center',
    gap: 4,
  },
  label: {
    fontSize: 11,
    fontWeight: '600',
  },
  addButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -28,
    borderWidth: 4,
    borderColor: Colors.white,
    shadowColor: Colors.accent,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  addButtonFocused: {
    backgroundColor: Colors.accentText,
  },
});
