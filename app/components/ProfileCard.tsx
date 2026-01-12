import { Profile } from "@/context/auth-context";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

interface ProfileCardProps {
    profile: Profile;
    // onPress: (id: string) => void;
}

export default function ProfileCard ({profile}: ProfileCardProps) {
    return (
        <TouchableOpacity style={styles.card}>
            <View style={styles.defaultAvatar}>
                <Text style={styles.avatarText}>
                    {profile.first_name.charAt(0).toUpperCase()}
                </Text>
            </View>
            <Text style={styles.name}>
                    {profile.first_name}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    card: {
        alignItems: "center",
        margin: 10,
        width: 120
    },

    defaultAvatar: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: "#2196F3",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "transparent"
    },

    avatarText: {
        fontSize: 48,
        color: "#fff",
        fontWeight: "600",
    },

    name: {
        fontSize: 16,
        color: "#808080",
        textAlign: "center",
    }
});

