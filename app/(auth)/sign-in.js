import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { KeyboardAvoidingView, ScrollView, View, Text} from "react-native";
import { Platform } from "react-native";

export default function SignInScreen() {
    const {signIn} = useAuth();

    const [email, setEmail] = useState("");
    const [password, usePassword] = useState("");
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS == "ios" ? "padding" : "height"}
        >
            <ScrollView
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View>
                    <View>
                        <Text>🥬</Text>
                    </View>
                    <Text>Welcome Back.</Text>
                    <Text>Sign in to your household fridge.</Text>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    )
}