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
    width: 50,
    height: 50,
    backgroundColor: Colors.forest,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
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
