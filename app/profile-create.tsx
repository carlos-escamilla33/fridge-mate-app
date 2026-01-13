import { useAuth } from "@/context/auth-context";
import { useState } from "react";
import {
    KeyboardAvoidingView,
    Platform,
    View,
} from "react-native";
import { Button, Text, TextInput, useTheme } from "react-native-paper";

export default function ProfileCreateScreen() {
    const [profileFirstName, setProfileFirstName] = useState<string>("");
    const [profileLastName, setProfileLastName] = useState<string>("");
    const [error, setError] = useState("");

    const { account } = useAuth();
    const theme = useTheme();

    async function handleSubmitProfilePress() {
        if (!profileFirstName || !profileLastName) {
            setError("Please fill in all fields");
            return;
        }

    }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View>
        <Text>{`Add your profile to ${account?.account_name}`}</Text>

        <TextInput
          label="First Name"
          autoCapitalize="none"
          placeholder="First Name"
          mode="outlined"
          onChangeText={setProfileFirstName}
        />
        <TextInput
          label="Last Name"
          autoCapitalize="none"
          placeholder="Last Name"
          mode="outlined"
          onChangeText={setProfileLastName}
        />

         {error && <Text style={{ color: theme.colors.error }}>{error}</Text>}

        <Button
        mode="contained"
        onPress={handleSubmitProfilePress}
        >
            Submit
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}
