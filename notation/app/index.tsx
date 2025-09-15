import React, {useEffect} from 'react';
import OverviewScreen from './overview';
import * as Location from 'expo-location';
import {getAllItems} from "../utils/AsyncStorage";
import {Note} from "../models/note";
import Toast from "react-native-toast-message";
import {View} from "react-native";
import {StyleSheet} from 'react-native';
import {Coordinates} from "../models/coordinates";


let locationSubscription;

async function startTrackingLocation() {
    locationSubscription = await Location.watchPositionAsync(
        {
            accuracy: 6,
            timeInterval: 15,
            distanceInterval: 0,
        },
        (location) => {
            checkLocationAndNotify(location.coords);
        }
    );
}

function stopTrackingLocation() {
    if (locationSubscription) {
        locationSubscription.remove();
    }
}

function getDistance(coord1: Coordinates, coord2: Coordinates): number {
    const toRad = (x: number) => (x * Math.PI) / 180;
    const R = 6371e3;

    const φ1 = toRad(coord1.latitude);
    const φ2 = toRad(coord2.latitude);
    const Δφ = toRad(coord2.latitude - coord1.latitude);
    const Δλ = toRad(coord2.longitude - coord1.longitude);

    const a =
        Math.sin(Δφ / 2) ** 2 +
        Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) ** 2;

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}

async function checkLocationAndNotify(coords: Coordinates): Promise<void> {
    const storedNotes = await getAllItems();
    const notes: Note[] = Object.keys(storedNotes)
        .filter((key) => key.startsWith("note-"))
        .map((key) => {
            const n = storedNotes[key];
            return {
                id: n.id,
                title: n.title ?? "",
                info: n.info ?? "",
                owner: n.owner ?? "?",
                location: n.location,
                radius: n.radius,
                shared: n.shared ?? false,
            } as Note;
        });
    const nearbyNotes = notes.filter(note => getDistance(coords, note.location) < note.radius);
    if (nearbyNotes.length > 0) {
        const text2 = nearbyNotes.map((note) => note.title).join(', ');
        Toast.show({
            type: 'success',
            text1: nearbyNotes.length > 1 ? "You're nearby multiple notes!" : "You're nearby the following note!",
            text2,
            position: 'top',
            visibilityTime: 4000,
        });
    }
}


export default function HomeScreen() {
    useEffect(() => {
        (async () => {
            const {status} = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                alert('Location permission denied');
                return;
            }

            startTrackingLocation();
        })();

        return () => stopTrackingLocation();
    }, []);

    return (
        <View style={styles.container}>
            <OverviewScreen />
            <Toast />
        </View>
    )
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
});