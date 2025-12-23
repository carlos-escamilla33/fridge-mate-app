import { KeyboardAvoidingView, Platform, Text, View } from "react-native";

const AuthScreen = () => {
    return <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"}>
        <View>
            <Text>Create Account</Text>
        </View>
    </KeyboardAvoidingView>
}

export default AuthScreen;