import { router, Slot } from "expo-router";
import { Image, SafeAreaView, StyleSheet, TouchableOpacity, View, Alert } from "react-native";
import React from "react";
import { Appbar, Provider as PaperProvider } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import { setItem } from "../utils/AsyncStorage";
import { reload } from "expo-router/build/global-state/routing";

export default function Layout() {

	const handleImport = async () => {
		try {
			const result = await DocumentPicker.getDocumentAsync({
				type: 'application/json',
				copyToCacheDirectory: true,
			});

			if (!result.canceled) {
				const file = result.assets[0];

				if (file.uri) {
					const fileContent = await (await fetch(file.uri)).text();
					const jsonData = JSON.parse(fileContent);
					const newId = Date.now().toString();
					jsonData.id = newId;
					await setItem(`note-${newId}`, jsonData);
					Alert.alert('Success', 'The JSON file was imported successfully!');
				}
				router.push("/");
			}
		} catch (error) {
			Alert.alert('Error', 'An error occurred while trying to import the file.');
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
