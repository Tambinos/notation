import { Slot } from "expo-router";
import {Image, Platform, SafeAreaView, StyleSheet, Text, TouchableOpacity, View} from "react-native";
import React from "react";

export default function Layout() {
  return (
      <SafeAreaView style={styles.AndroidSafeArea} >
      <View style={styles.header}>
          <TouchableOpacity>
              <Image
                  source={require('../assets/Notation_Logo.png')}
                  style={styles.logo}
              />
          </TouchableOpacity>


          <TouchableOpacity>
              <Text>Done</Text>
          </TouchableOpacity>
      </View>
          <Slot />
      </SafeAreaView>
  );
}
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: '#FFFFFF',
    },
    logo: {
        width: 100,
        height: 100,
        borderRadius: 20,
        resizeMode: 'contain',
    },
          AndroidSafeArea: {
          flex: 1,
          paddingTop: Platform.OS === 'android' ? 25 : 0
      },
});
