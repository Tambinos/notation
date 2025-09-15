import * as React from 'react';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import {SectionList, StyleSheet, TouchableOpacity, View} from 'react-native';
import {Avatar, Card, FAB, IconButton, Snackbar, Text} from 'react-native-paper';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Note} from '../models/note';
import {getAllItems, removeItem} from '../utils/AsyncStorage'
import {File, Paths} from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import TileRenderer from "./tile-renderer"

export default function OverviewScreen({ initialNotes }: { initialNotes?: Note[] }) {
    const [notes, setNotes] = React.useState<Note[]>(initialNotes || []);
    const [sharedNotes, setSharedNotes] = React.useState<Note[]>([]);
    const [activeNote, setActiveNote] = React.useState<string | null>(null);
    const [snackbarVisible, setSnackbarVisible] = React.useState(false);
    const [snackbarText, setSnackbarText] = React.useState("");

    const router = useRouter();

    const showSnackbar = (message: string) => {
        setSnackbarText(message);
        setSnackbarVisible(true);
    };

    useFocusEffect(
        React.useCallback(() => {
            if (!initialNotes) loadNotes(); // only load from storage if no initialNotes
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
            showSnackbar("Failed to export");
        }
    }

    const loadNotes = async () => {
        try {
            const storedNotes = await getAllItems();

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
            showSnackbar("Error loading the notes")
        }
    };

    const handleCardPress = (id: string) => {
        setActiveNote(activeNote === id ? null : id);
    };

    const handleEdit = (item: Note) => {
        router.push({
            pathname: '/noteForm',
            params: { mode: 'edit', noteId: item.id }
        });
    };const handleDelete = async (item: Note) => {
        try {
            await removeItem(`note-${item.id}`);
            setNotes((prev) => prev.filter((n) => n.id !== item.id));
            setSharedNotes((prev) => prev.filter((n) => n.id !== item.id));
            showSnackbar("Success");
            if (activeNote === item.id) setActiveNote(null);
        } catch (error) {
            showSnackbar("Failed to delete the note.");
        }
    };

    const renderNote = ({item}: { item: Note }) => (
        <TouchableOpacity onPress={() => handleCardPress(item.id)}>
            <Card style={styles.card}>
                <Card.Title
                    title={item.title}
                    left={(props) => <Avatar.Text {...props} label={item.owner || "?"}/>}
                    right={(props) =>
                        activeNote === item.id ? (
                            <View style={styles.actions}>
                                <IconButton
                                    {...props}
                                    icon="share-variant"
                                    onPress={() => exportAndShare(item, `${item.title || 'export'}`)} />
                                <IconButton
                                    {...props}
                                    icon="pencil"
                                    onPress={() => handleEdit(item)}/>
                                <IconButton
                                    {...props}
                                    icon="delete"
                                    testID={"btn-delete-" + item.id}
                                    onPress={() => handleDelete(item)}
                                />
                            </View>
                        ) : (
                            item.location && (
                                <View pointerEvents="none">
                                    <TileRenderer
                                        coordinate={item.location}
                                        showMarker={true}
                                        size={{width: 120, height: 70}}
                                    />
                                </View>
                            )
                        )
                    }
                />
                {item.info ? (
                    <Card.Content>
                        <Text>{item.info}</Text>
                    </Card.Content>
                ) : null}
            </Card>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
            <SectionList
                sections={[
                    {title: 'My Notes', data: notes},
                    {title: 'Shared', data: sharedNotes},
                ]}
                keyExtractor={(note) => String(note.id)}
                renderItem={renderNote}
                renderSectionHeader={({section: {title}}) => (
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
                    router.push({pathname: '/noteForm', params: {mode: "create"}})
                }
            />

            <Snackbar
                visible={snackbarVisible}
                testID="snackbar"
                onDismiss={() => setSnackbarVisible(false)}
                duration={2000}
            >
                {snackbarText}
            </Snackbar>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#fff'},
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