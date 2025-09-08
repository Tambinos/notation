import * as React from "react";
import { View, StyleSheet } from "react-native";
import { Text, TextInput, Button } from "react-native-paper";
import { setItem, getItem } from "../utils/AsyncStorage";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Note } from "../models/note"; // no `.ts` in import

export default function NoteForm() {
  const { mode = "create", noteId } = useLocalSearchParams();
  const router = useRouter();

  const [title, setTitle] = React.useState("");
  const [info, setInfo] = React.useState("");
  const [location, setLocation] = React.useState<string | undefined>(undefined);
  const [radius, setRadius] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (mode === "edit" && noteId) {
      loadNote();
    }
  }, [mode, noteId]);

  const loadNote = async () => {
    const note: Note | null = await getItem(`note-${noteId}`);
    if (note) {
      setTitle(note.title || "");
      setInfo(note.info || "");
      setLocation(note.location);
      setRadius(note.radius);
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
    };

    await setItem(`note-${note.id}`, note);
    router.push("/"); // back to home/list
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
        value={info}
        onChangeText={setInfo}
        style={styles.input}
        multiline
      />
      <Text variant="labelMedium">
        Add any important information to your Note
      </Text>

      <View style={styles.row}>
        <Button
          mode="outlined"
          onPress={() => setLocation("Demo Location")}
          style={styles.flex}
        >
          {mode === "create" ? "Add Location" : "Select Location"}
        </Button>

        <TextInput
          label="Radius"
          value={radius}
          onChangeText={setRadius}
          style={[styles.flex, styles.input]}
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
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, gap: 10 },
  input: { marginBottom: 10 },
  row: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 10 },
  flex: { flex: 1 },
  button: { marginTop: 20, flex: 1 },
});

