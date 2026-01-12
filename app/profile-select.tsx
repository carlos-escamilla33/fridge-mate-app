import { useAuth } from "@/context/auth-context";
import { StyleSheet, Text, View } from "react-native";
import ProfileCard from "./components/ProfileCard";

export default function ProfileSelectScreen() {
  const { profiles } = useAuth();

  function onPress(id: string) {}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who is using Fridge Mate?</Text>
      <View style={styles.profileContainer}>
        {profiles.map((profile) => (
          <ProfileCard key={profile.profile_id} profile={profile} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#141414",
        justifyContent: "center",
        alignItems: "center",
        padding: 20
    },

    title: {
        fontSize: 32,
        color: "#fff",
        marginBottom: 40,
        fontWeight: "500"
    },

    profileContainer: {
        flexDirection: "row",
        flexWrap: "wrap",
        justifyContent: "center",
        gap: 20
    }
});
