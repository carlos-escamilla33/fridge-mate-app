import { StyleSheet, Text, View } from "react-native";

interface SectionItemProps {
  item: any;
  isLast: boolean;
}

export function SectionItem({ item, isLast }: SectionItemProps) {
  return (
    <View style={styles.itemsContainer}>
      <Text style={styles.itemText}>{item}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  itemsContainer: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5EA",
  },
  itemText: {
    fontSize: 16,
    color: "#000000",
  },
});
