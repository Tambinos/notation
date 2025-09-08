import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { setItem, getItem } from "../utils/AsyncStorage";
import { useRouter } from 'expo-router';

type NoteFormProps = {
	route: {
		params?: {
			mode: "create" | "edit";
			noteId?: string;
		};
	};
};

export default function NoteForm({ route }: NoteFormProps) {
	const params = route?.params || {};
	const mode = params.mode || "create";
	const noteId = params.noteId || null;
	const navigation = useRouter();

	// ✅ define state
	const [title, setTitle] = React.useState("");
	const [subtitle, setSubtitle] = React.useState("");

	React.useEffect(() => {
		if (mode === "edit" && noteId) {
			loadNote();
		}
	}, [noteId]);

	const loadNote = async () => {
		const note = await getItem(`note-${noteId}`);
		if (note) {
			setTitle(note.title || "");
			setSubtitle(note.subtitle || "");
		}
	};

	const handleSave = async () => {
		const note = {
			id: noteId || Date.now().toString(),
			title,
			subtitle,
			owner: "A", // adjust if needed
		};

		await setItem(`note-${note.id}`, note);
		navigation.navigate("/");
	};

	return (
		<View style={styles.container}>
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
				value={subtitle}
				onChangeText={setSubtitle}
				style={styles.input}
				multiline
			/>
			<Text variant="labelMedium">Add any important information to your Note</Text>

			<View style={styles.row}>
				<Button
					mode="outlined"
					onPress={() => console.log("Location picker here")}
					style={styles.flex}
				>
					{mode === "create" ? "Add Location" : "Select Location"}
				</Button>

				<TextInput
					label="Radius"
					style={[styles.flex, styles.input]}
					onChangeText={(value) => console.log("radius:", value)}
				/>
			</View>
			<Text>Specify the radius for sending notifications</Text>

			<View style={styles.row}>
				<Button
					mode="outlined"
					onPress={() => navigation.navigate("/")}
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
	);
}

const styles = StyleSheet.create({
	container: { padding: 20, gap: 10 },
	input: { marginBottom: 10 },
	row: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
	flex: { flex: 1 },
	button: { marginTop: 20, flex: 1 },
});

