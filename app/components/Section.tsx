import { StyleSheet, Text, View } from "react-native";
import { SectionItem } from "./SectionItem";

interface SectionProps {
  title: string;
  items: any[];
  style?: object;
}

export function Section({ title, items, style }: SectionProps) {
  return (
    <View style={[styles.sectionContainer]}>
      {title && <Text>{title}</Text>}
      <View>
        {items.map((item, index) =>
          typeof item === "boolean" ? (
            <SectionItem
              key={index}
              item={item === true ? "Notifications ON" : "Notifications OFF"}
              isLast={index === items.length - 1}
            />
          ) : (
            <SectionItem
              key={index}
              item={item}
              isLast={index === items.length - 1}
            />
          ),
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {
    marginBottom: 32,
  },
  sectionTitle: {
    color: "#9CA3AF",
    fontSize: 13,
    fontWeight: "600",
    paddingHorizontal: 16,
    marginBottom: 12,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  itemsContainer: {
    backgroundColor: "#18181B",
    borderRadius: 12,
    overflow: "hidden",
  },
});
