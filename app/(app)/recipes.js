import { View, Text, StyleSheet, SafeAreaView } from "react-native";
import { Feather } from "@expo/vector-icons";
import Colors from "../../constants/colors";

export default function RecipesScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Feather name="book-open" size={32} color={Colors.accentText} />
          </View>
          <Text style={styles.title}>AI Recipes</Text>
          <Text style={styles.subtitle}>
            Soon your fridge will tell you what to cook — automatically, based on
            what's inside and what's about to expire.
          </Text>
          <View style={styles.pill}>
            <Text style={styles.pillText}>Coming soon</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 14,
  },
  iconWrap: {
    width: 80,
    height: 80,
    backgroundColor: Colors.accentLight,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    color: Colors.textPrimary,
    letterSpacing: -0.4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: "center",
    lineHeight: 22,
  },
  pill: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 4,
  },
  pillText: {
    fontSize: 13,
    fontWeight: "500",
    color: Colors.textSecondary,
  },
});
