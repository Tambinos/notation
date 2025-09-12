import * as React from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { View, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, FAB, Snackbar, IconButton } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Note } from '../models/note.ts';
import * as asyncStorage from '../utils/AsyncStorage.ts';
import { removeItem } from "../utils/AsyncStorage.ts";
import {File, Paths} from 'expo-file-system';
import * as Sharing from 'expo-sharing';

export default function OverviewScreen() {
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [activeNote, setActiveNote] = React.useState<string | null>(null);
    const [notes, setNotes] = React.useState<Note[]>([]);
    const [sharedNotes, setSharedNotes] = React.useState<Note[]>([]);

    const router = useRouter();

    useFocusEffect(
        React.useCallback(() => {
            loadNotes();
        }, [])
    );

    async function exportAndShare(data: unknown, filename: string): Promise<void> {
        try {
            data.shared = true
            const safeFilename = filename.endsWith('.json') ? filename : `${filename}.json`;

            const file = new File(Paths.cache, safeFilename);

            await file.write(JSON.stringify(data, null, 2));

            if (!(await Sharing.isAvailableAsync())) {
                throw new Error("Sharing is not available on this device");
            }

            await Sharing.shareAsync(file.uri);
        } catch (error) {
            console.error("Error exporting and sharing file:", error);
        }
    }

     const loadNotes = async () => {
        try {
            const storedNotes = await asyncStorage.getAllItems();

            const allNotes: Note[] = Object.keys(storedNotes)
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

            setNotes(allNotes.filter((n) => !n.shared));
            setSharedNotes(allNotes.filter((n) => n.shared));
        } catch (e) {
            console.error("Failed to load notes", e);
        }
    };

    const handleCardPress = (id: string) => {
        setActiveNote(activeNote === id ? null : id);
    };

    const handleDelete = async (item: Note) => {
        try {
            await removeItem(`note-${item.id}`);
            // update state locally
            setNotes((prev) => prev.filter((n) => n.id !== item.id));
            setSharedNotes((prev) => prev.filter((n) => n.id !== item.id));
            setSnackbarVisible(true);
            if (activeNote === item.id) setActiveNote(null);
        } catch (error) {
            console.error("Failed to delete note:", error);
        }
    };

    const renderNote = ({ item }: { item: Note }) => (
        <TouchableOpacity onPress={() => handleCardPress(item.id)}>
            <Card style={styles.card}>
                <Card.Title
                    title={item.title}
                    subtitle={item.info || ""}
                    left={(props) => <Avatar.Text {...props} label={item.owner || "?"} />}
                    right={(props) =>
                        activeNote === item.id && (
                            <View style={styles.actions}>
                                <IconButton
                                    {...props}
                                    icon="share-variant"
                                    onPress={() => exportAndShare(item, `${item.title || 'export'}.json`)}
                                />
                                <IconButton
                                    {...props}
                                    icon="delete"
                                    onPress={() => handleDelete(item)}
                                />
                            </View>
                        )
                    }
                />
            </Card>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <SectionList
                sections={[
                    { title: 'My Notes', data: notes },
                    { title: 'Shared', data: sharedNotes },
                ]}
                keyExtractor={(note) => String(note.id)}
                renderItem={renderNote}
                renderSectionHeader={({ section: { title } }) => (
                    <Text style={styles.sectionTitle}>{title}</Text>
                )}
                stickySectionHeadersEnabled={false}
                ListHeaderComponent={
                    <Text style={styles.headerTitle}>Overview</Text>
                }
            />

            <FAB
                style={styles.fab}
                icon="plus"
                label="Create Note"
                onPress={() =>
                    router.push({ pathname: '/noteForm', params: { mode: "create" } })
                }
            />

            <Snackbar
                visible={snackbarVisible}
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000}
            >
                Note deleted
            </Snackbar>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    headerTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        marginHorizontal: 16,
        marginTop: 12,
    },
    sectionTitle: {
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8,
        fontWeight: 'bold',
        fontSize: 16,
    },
    card: {
        marginHorizontal: 12,
        marginVertical: 4,
    },
    fab: {
        position: 'absolute',
        right: 16,
        bottom: 16,
    },
    actions: {
        flexDirection: 'row',
    },
});
