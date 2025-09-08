import { StyleSheet, Text, View, Button } from 'react-native';
import { useRouter } from 'expo-router';
export default function HomeScreen() {
	const router = useRouter();
	return (
        <View>
            <Text>index.tsx</Text>
            <Button title="Go to Create" onPress={() => router.navigate('/create')} />
        </View>
    );
}

