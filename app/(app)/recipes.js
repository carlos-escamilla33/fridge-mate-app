import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import Colors from '../../constants/colors';
export default function RecipesScreen() {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safe}>
        <View style={styles.content}>
          <View style={styles.iconWrap}>
            <Text style={styles.icon}>🍳</Text>
          </View>
          <Text style={styles.title}>AI Recipes</Text>
          <Text style={styles.subtitle}>
            Soon your fridge will tell you what to cook — automatically, based on what's inside and what's about to expire.
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
    backgroundColor: Colors.cream,
  },
  safe: {
    flex: 1,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
    gap: 14,
  },
  iconWrap: {
    width: 84,
    height: 84,
    backgroundColor: Colors.parchment,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  icon: {
    fontSize: 38,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: Colors.textPrimary,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.bark,
    textAlign: 'center',
    lineHeight: 22,
  },
  pill: {
    backgroundColor: Colors.parchment,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginTop: 8,
  },
  pillText: {
    fontSize: 13,
    fontWeight: '500',
    color: Colors.bark,
  },
});