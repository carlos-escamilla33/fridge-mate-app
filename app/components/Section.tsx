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
        {items.map((item, index) => (
          <SectionItem
            key={item.id || index}
            item={item}
            // isLast={index === item.length - 1}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {},
});
