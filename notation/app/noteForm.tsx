import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button, Snackbar } from "react-native-paper";
import { getItem } from "../utils/AsyncStorage";
import { useRouter, useLocalSearchParams } from "expo-router";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Note } from "../models/note";
import LocationPicker from "./location-picker";
import TileRenderer from "./tile-renderer";

export default function NoteForm() {
    const { mode = "create", noteId } = useLocalSearchParams();
    const router = useRouter();

    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
	const [snackbarText, setSnackbarText] = React.useState("");const [title, setTitle] = React.useState("");
    const [info, setInfo] = React.useState("");
    const [location, setLocation] = React.useState<
        { latitude: number; longitude: number } | undefined
    >(undefined);
    const [radius, setRadius] = React.useState<string | undefined>(undefined);

    const showSnackbar = (message: string) => {
		setSnackbarText(message);
		setSnackbarVisible(true);
	};React.useEffect(() => {
        if (mode === "edit" && noteId) {
            loadNote();
        }
    }, [mode, noteId]);

    const loadNote = async () => {
        try {const note: Note | null = await getItem(`note-${noteId}`);
        if (note) {
            setTitle(note.title || "");
            setInfo(note.info || "");
            setLocation(note.location);
            setRadius(note.radius);
        }
    }catch (error) {
			showSnackbar("failed to load the note.");
		}
	};

    const handleSave = async () => {
        const note: Note = {
            id: (noteId as string) || Date.now().toString(),
            title,
            info,
            owner: "A",
            location,
            radius,
        };try {
			await AsyncStorage.setItem(`note-${note.id}`, JSON.stringify(note));
		} catch (error) {
			showSnackbar("failed to save the note.");
		}


        router.push("/");
    };

    const safeCoordinate =
        location || { latitude: 46.95, longitude: 7.45 };

    return (
        <View style={{ flex: 1 }}>
			<Viewstyle={styles.container}>
            <Text variant="displayMedium">
                {mode === "create" ? "Create" : "Edit"}
            </Text>

            <TextInput
                label="Title"
                value={title}
                onChangeText={setTitle}
                style={styles.input}
            />

            <TextInput
                label="Info"
                value={info}
                onChangeText={setInfo}
                style={styles.input}
                multiline
            />
            <Text variant="labelMedium">
                Add any important information to your Note
            </Text>

            {/* 👇 Preview of location */}
            <TileRenderer
                coordinate={safeCoordinate}
                showMarker={!!location}
                size={{ width: "100%", height: 200 }}
            />

            <View style={styles.row}>
                <LocationPicker
                    mode={mode}
                    onLocationSelect={(marker) => setLocation(marker)}
                />
                <TextInput
                    label="Radius"
                    value={radius}
                    keyboardType="numeric"
                    onChangeText={setRadius}
                    style={[styles.input, styles.flex]}
                />
            </View>

            <Text>Specify the radius for sending notifications</Text>

            <View style={styles.row}>
                <Button
                    mode="outlined"
                    onPress={() => router.push("/")}
                    style={styles.button}
                >
                    Cancel
                </Button>
                <Button
                    mode="contained"
                    onPress={handleSave}
                    style={styles.button}
                    disabled={!title.trim()}
                >
                    {mode === "create" ? "Create" : "Save"}
                </Button>
            </View>
        </View>
    {/* Snackbar outside so it floats at the bottom */}
			<Snackbar
				visible={snackbarVisible}
				onDismiss={() => setSnackbarVisible(false)}
				duration={2000}
			>
				{snackbarText}
			</Snackbar>
		</View>
	);
}

const styles = StyleSheet.create({
    container: { padding: 20, gap: 10 },
    input: { marginBottom: 10 },
    row: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
    flex: { flex: 1 },
    button: { marginTop: 20, flex: 1 },
});

