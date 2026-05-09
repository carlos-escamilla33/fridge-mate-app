import { Tabs } from "expo-router";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import Colors from "../../constants/colors";

function TabIcon({ focused, emoji, label }) {
  return (
    <View style={styles.tabEmoji}>
      <Text style={[styles.tabEmoji, !focused && styles.tabEmojiInactive]}>
        {emoji}
      </Text>
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>
        {label}
      </Text>
    </View>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarShowLabel: false,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="🧊" label="Fridge" />
          ),
        }}
      />
      <Tabs.Screen
        name="add-item"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="➕" label="Add Item" />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="🍳" label="Recipes" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} emoji="👤" label="Profile" />
          ),
        }}
      />
      <Tabs.Screen name="profiles" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopColor: Colors.border,
    borderTopWidth: 1,
    height: 72,
    paddingBottom: 10,
    paddingTop: 8,
  },
  tabItem: {
    alignItems: "center",
    gap: 3,
  },
  tabEmoji: {
    alignItems: "center",
    fontSize: 22,
  },
  tabEmojiInactive: {
    opacity: 0.4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: Colors.textMuted,
  },
  tabLabelActive: {
    color: Colors.textPrimary,
  },
  addBtn: {
    width: 54,
    height: 54,
    backgroundColor: Colors.forest,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: Colors.forest,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  addBtnText: {
    fontSize: 26,
    color: Colors.textOnDark,
    lineHeight: 30,
  },
});
