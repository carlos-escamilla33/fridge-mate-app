import { useState } from "react";
import { KeyboardAvoidingView } from "react-native-web";

export default function SignInScreen() {
    const {signIn} = useAuth();

    const [email, setEmail] = useState("");
    const [password, usePassword] = useState("");
    cosnt [errors, setErrors] = useState("");
    const [loading, setLoading] = useState(false);

    return (
        <KeyboardAvoidingView>
            
        </KeyboardAvoidingView>
    )
}