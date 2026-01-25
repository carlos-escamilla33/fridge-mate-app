import { useState } from "react";
import { KeyboardAvoidingView, Platform, StyleSheet, View } from "react-native";
import { Button, SegmentedButtons, Text, TextInput } from "react-native-paper";
import { DatePickerInput } from "react-native-paper-dates";

export default function CreateScreen() {
  const [itemName, setItemName] = useState<string>("");
  const [quality, setQuality] = useState<string>("");
  const [inputDate, setInputDate] = useState<Date | undefined>(undefined);

  function handleInputSubmission() {
    console.log("updating inputs");
  }
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.title} variant="headlineMedium">
          Add to your Fridge
        </Text>
        <TextInput
          label="Item Name"
          autoCapitalize="none"
          placeholder="Apple"
          mode="outlined"
          value={itemName}
          onChangeText={setItemName}
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
          />
          <SegmentedButtons
            value={quality}
            onValueChange={setQuality}
            style={styles.segmentedButtonsInput}
            buttons={[
              { value: "fresh", label: "Fresh" },
              { value: "good", label: "Good" },
              { value: "use-soon", label: "Use Soon" },
            ]}
          />
          <Button
            mode="contained"
            style={styles.button}
            onPress={handleInputSubmission}
          >
            Add
          </Button>
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
    marginBottom: 10,
    marginTop: 10,
  },
  title: {
    textAlign: "center",
    marginBottom: 24,
  },
  segmentedButtonsInput: {
    marginTop: 10,
  },
  //   input: {
  //     marginBottom: 16,
  //   },
  button: {
    textAlign: "center",
    marginTop: 8,
  },
  //   switchModeButton: {
  //     marginTop: 16,
  //   },
});
