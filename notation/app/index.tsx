import {StyleSheet, Text, View, Button, SafeAreaView, Platform} from 'react-native';
import {Slot, useRouter} from 'expo-router';
import OverviewScreen from "./OvervewScreen";
import Layout from "./_layout";
export default function HomeScreen() {
	const router = useRouter();
	return (
        <View>
            <Button title="Go To SecondPage.tsx" onPress={() => router.navigate('/secondPage')} />
        </View>
    );
}

