import { Tabs } from "expo-router";
import { View, Text, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../../constants/colors";

function TabIcon({ focused, name, label, size = 20 }) {
  return (
    <View style={styles.tabItem}>
      <Feather
        name={name}
        size={size}
        color={focused ? Colors.accent : Colors.textMuted}
      />
      <Text style={[styles.tabLabel, focused && styles.tabLabelActive]}>{label}</Text>
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
            <TabIcon focused={focused} name="home" label="Fridge" />
          ),
        }}
      />
      <Tabs.Screen
        name="add-item"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="plus-circle" label="Add" size={22} />
          ),
        }}
      />
      <Tabs.Screen
        name="recipes"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="book-open" label="Recipes" />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <TabIcon focused={focused} name="user" label="Profile" />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    height: 76,
    paddingTop: 10,
    paddingBottom: 12,
  },
  tabItem: {
    alignItems: "center",
    gap: 4,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: "500",
    color: Colors.textMuted,
    letterSpacing: 0.2,
  },
  tabLabelActive: {
    color: Colors.accent,
    fontWeight: "600",
  },
});
