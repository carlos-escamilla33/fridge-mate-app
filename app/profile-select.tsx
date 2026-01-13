import { Profile, useAuth } from "@/context/auth-context";
import { useFocusEffect, useRouter } from "expo-router";
import { useCallback } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import ProfileCard from "./components/ProfileCard";

export default function ProfileSelectScreen() {
  const { profiles, setCurrentProfile, currentProfile, getAllProfiles } = useAuth();
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
        getAllProfiles();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
  )

  function handleProfilePress(profile: Profile): void {
    setCurrentProfile(profile);
    console.log(currentProfile);
  }

  function handleAddProfilePress() {
    router.replace("./profile-create");
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Who is using Fridge Mate?</Text>
      <View style={styles.profileContainer}>
        {profiles.map((profile) => (
          <ProfileCard key={profile.profile_id} profile={profile} handleProfilePress={handleProfilePress}/>
        ))}
        <TouchableOpacity style={styles.addBtnCard} onPress={handleAddProfilePress}>
                <View style={styles.addAvatar}>
                    <Text style={styles.symbolText}>
                        +
                    </Text>
                </View>
                <Text style={styles.addText}>Add Profile</Text>
        </TouchableOpacity>
        <View>
        </View>
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
        textAlign: "center",
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
    },

    addBtnCard: {
        alignItems: "center",
        margin: 10,
        width: 120
    },

    addAvatar: {
        width: 100,
        height: 100,
        borderRadius: 8,
        backgroundColor: "#2196F3",
        justifyContent: "center",
        alignItems: "center",
        borderWidth: 3,
        borderColor: "transparent"
    },

    symbolText: {
        fontSize: 48,
        color: "#fff",
        fontWeight: "600",
    },

    addText: {
        fontSize: 16,
        color: "#808080",
        textAlign: "center",
    }
});
