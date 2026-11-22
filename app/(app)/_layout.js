import { Tabs } from "expo-router/js-tabs";
import { View, StyleSheet } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../../constants/colors";

function tabIcon(name) {
  return ({ color }) => <Feather name={name} size={20} color={color} />;
}

// The center Add tab: a raised green circle instead of a regular icon and label.
function AddTabIcon({ focused }) {
  return (
    <View style={[styles.addButton, focused && styles.addButtonFocused]}>
      <Feather name="plus" size={26} color={Colors.white} />
    </View>
  );
}

export default function AppLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.accent,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="home"
        options={{ title: "Fridge", tabBarIcon: tabIcon("home") }}
      />
      <Tabs.Screen
        name="recipes"
        options={{ title: "Recipes", tabBarIcon: tabIcon("book-open") }}
      />
      <Tabs.Screen
        name="add-item"
        options={{
          title: "Add",
          tabBarShowLabel: false,
          tabBarIcon: ({ focused }) => <AddTabIcon focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="groceries"
        options={{ title: "Groceries", tabBarIcon: tabIcon("shopping-cart") }}
      />
      <Tabs.Screen
        name="profile"
        options={{ title: "Profile", tabBarIcon: tabIcon("user") }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 6,
  },
  tabLabel: {
    fontSize: 11,
    fontWeight: "600",
  },
  addButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
    marginTop: -14,
    shadowColor: Colors.accent,
    shadowOpacity: 0.35,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  addButtonFocused: {
    backgroundColor: Colors.accentText,
  },
});
