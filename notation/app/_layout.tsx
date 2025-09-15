import { router, Slot } from "expo-router";
import { Image, StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import React from "react";
import { Appbar, Provider as PaperProvider } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function Layout() {

    const handleImport = async () => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: "application/json",
                copyToCacheDirectory: true,
            });

            if (!result.canceled && result.assets?.length > 0) {
                const file = result.assets[0];

                if (file.uri) {
                    const fileContent = await (await fetch(file.uri)).text();
                    const jsonData = JSON.parse(fileContent);

                    const newId = Date.now().toString();
                    jsonData.id = newId;

                    await AsyncStorage.setItem(`note-${newId}`, JSON.stringify(jsonData));

                    Alert.alert("Success", "The JSON file was imported successfully!");
                }

                router.push("/");
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "An error occurred while trying to import the file.");
        }
    };

	return (
		<PaperProvider>
			<SafeAreaView style={styles.safeArea}>
				<Appbar.Header style={styles.header} elevated={true}>
					<TouchableOpacity>
						<Image
							source={require('../assets/Notation_Logo.png')}
							style={styles.logo}
						/>
					</TouchableOpacity>
					<View style={{ flex: 1 }} />
					<Appbar.Action
						icon="upload"
						color="#5f6368"
						size={28}
						onPress={handleImport}
					/>
				</Appbar.Header>
				<Slot />
			</SafeAreaView>
		</PaperProvider>
	);
}


const styles = StyleSheet.create({
	safeArea: {
		flex: 1,
	},
	header: {
		backgroundColor: '#FFFFFF',
		justifyContent: 'space-between',
		alignItems: 'center',
		height: 60,
	},
	logo: {
		width: 100,
		height: 100,
		borderRadius: 20,
		resizeMode: 'contain',
	},
});
