import { StyleSheet, Text, View } from "react-native";
import { SectionItem } from "./SectionItem";

interface SectionProps {
    title: string,
    items: any[],
    style: 
}

export function Section({ title, items, style }: SectionProps) {
  return (
    <View style={[styles.sectionContainer]}>
      {title && <Text>{title}</Text>}
      <View>
        {items.map((item) => {
          <SectionItem key={index} item={item}/>;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {},
});
