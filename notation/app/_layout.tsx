import {Slot} from "expo-router";
import {Image, SafeAreaView, StyleSheet, TouchableOpacity, View} from "react-native";
import React from "react";
import { Appbar, Provider as PaperProvider } from 'react-native-paper';


export default function Layout() {
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
                        icon="download"
                        color="#5f6368"
                        size={28}
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
        justifyContent: 'space-between', // Ensures space between logo and action
        alignItems: 'center',
        height: 60, // A standard header height
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 20,
        resizeMode: 'contain',
    },
});
