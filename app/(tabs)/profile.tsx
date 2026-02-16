import { useAuth } from "@/context/auth-context";
import { View } from "react-native";
import { Section } from "../components/Section";

export default function ProfileScreen() {
  const { currentProfile } = useAuth();
  const items = [
    currentProfile?.first_name,
    currentProfile?.last_name,
    currentProfile?.notifications_enabled,
    currentProfile?.created_at,
  ];
  return (
    <View>
      <Section title="My Profile" items={items} />
    </View>
  );
}
