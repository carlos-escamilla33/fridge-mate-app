import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";

export default function CreateScreen() {
  const [itemName, setItemName] = useState<string>("");
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);

  function handleInputChange() {
    console.log("updating inputs");
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <TextInput
          label="Item Name"
          autoCapitalize="none"
          placeholder="Apple"
          mode="outlined"
          value={itemName}
          onChangeText={setItemName}
        />
        <TextInput
          label="Ripeness Level"
          placeholder="Level 1"
          mode="outlined"
        />
        <View>
          <DatePickerInput
            locale="en"
            label="Expiration Date"
            mode="outlined"
            animationType="fade"
            value={inputDate}
            onChange={setInputDate}
            inputMode="start"
            // style={styles.dateInput}
          />
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
  },
  //   title: {
  //     textAlign: "center",
  //     marginBottom: 24,
  //   },
  //   input: {
  //     marginBottom: 16,
  //   },
  //   button: {
  //     textAlign: "center",
  //     marginTop: 8,
  //   },
  //   switchModeButton: {
  //     marginTop: 16,
  //   },
});
