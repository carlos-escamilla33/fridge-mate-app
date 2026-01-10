import { useAuth } from '@/context/auth-context';
import { View } from 'react-native';

export default function ProfileSelectScreen () {
    const {profiles} = useAuth();
    return (
        <View>

        </View>
    )
}