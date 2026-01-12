import { useAuth } from '@/context/auth-context';
import { StyleSheet, Text, View } from 'react-native';
import ProfileCard from './components/ProfileCard';

export default function ProfileSelectScreen () {
    const {profiles} = useAuth();

    function onPress(id: string) {

    }

    return (
        <View style={styles.profilesContainer}>
            <Text>Who is using Fridge Mate?</Text>
            {
                profiles.map((profile) => (
                    <ProfileCard key={profile.profile_id} profile={profile}/>
                ))
            }
        </View>
    )
}

const styles = StyleSheet.create({
    profilesContainer: {
        flex: 1,
        justifyContent: "center",
    }
})

