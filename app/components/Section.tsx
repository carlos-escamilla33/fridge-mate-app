import { StyleSheet, Text, View } from "react-native";
import { SectionItem } from "./SectionItem";

export function Section({ title, items, style }) {
  return (
    <View style={[styles.sectionContainer]}>
      {title && <Text>{title}</Text>}
      <View>
        {items.map((item, index) => {
          <SectionItem key={index} />;
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionContainer: {},
});
