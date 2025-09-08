import {Slot} from "expo-router";
import {Image, SafeAreaView, StyleSheet, TouchableOpacity, View, Alert} from "react-native";
import React from "react";
import { Appbar, Provider as PaperProvider } from 'react-native-paper';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import {setItem} from "../utils/AsyncStorage";

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
                    const fileContent = await FileSystem.readAsStringAsync(file.uri);

                    const jsonData = JSON.parse(fileContent);
                        await setItem(Date.now().toString(), jsonData);

                    Alert.alert('Success', 'The JSON file was imported successfully!');
                }
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
                    <View style={{flex: 1}}/>
                    <Appbar.Action
                        icon="upload"
                        color="#5f6368"
                        size={28}
                        onPress={handleImport}
                    />
                </Appbar.Header>
                <Slot/>
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
