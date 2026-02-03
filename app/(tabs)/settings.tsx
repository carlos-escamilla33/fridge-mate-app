import AntDesign from "@expo/vector-icons/AntDesign";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { StyleSheet, Text, View } from "react-native";

export default function SettingsScreen() {
  return (
    <View style={styles.settingsContainer}>
      <View style={styles.iconsContainer}>
        <Text style={styles.textStyling}>Sign Out</Text>
        <MaterialIcons name="logout" size={24} color="black" />
      </View>
      <View style={styles.iconsContainer}>
        <Text style={styles.textStyling}>Switch Accounts</Text>
        <AntDesign name="user-switch" size={24} color="black" />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  settingsContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  iconsContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  textStyling: {
    padding: 10,
  },
});
