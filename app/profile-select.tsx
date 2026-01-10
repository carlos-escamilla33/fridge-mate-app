import { useAuth } from '@/context/auth-context';
import { View } from 'react-native';
import ProfileCard from './components/ProfileCard';

export default function ProfileSelectScreen () {
    const {profiles} = useAuth();
    return (
        <View>
            {
                profiles.map((profile) => (
                    <ProfileCard key={profile.profile_id} profile={profile}/>
                ))
            }
        </View>
    )
}