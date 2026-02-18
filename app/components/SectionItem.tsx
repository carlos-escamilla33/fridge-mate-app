import { Text, View } from "react-native";

interface SectionItemProps {
  item: any;
  isLast: boolean;
}

export function SectionItem({ item, isLast }: SectionItemProps) {
  return (
    <View>
      <Text>{item}</Text>
    </View>
  );
}
