import { Profile } from "@/context/auth-context";
import { Text, View } from "react-native";

interface ProfileCardProps {
    profile: Profile;
    // onPress: (id: string) => void;
}

export default function ProfileCard ({profile}: ProfileCardProps) {
    return (
        <View>
            <Text>{profile.first_name}</Text>
            <Text>{profile.last_name}</Text>
        </View>
    )
}

