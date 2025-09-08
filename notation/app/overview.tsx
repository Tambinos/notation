import * as React from 'react';
import { useRouter, useFocusEffect } from 'expo-router';
import { View, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, FAB, Snackbar, IconButton } from 'react-native-paper';
import { Note } from '../models/note.ts'
import * as asyncStorage from '../utils/AsyncStorage.ts';

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

      const myNotes = allNotes.filter((n) => !n.shared);
      const shared = allNotes.filter((n) => n.shared);

      setNotes(myNotes);
      setSharedNotes(shared);
    } catch (e) {
      console.error("Failed to load notes", e);
    }
  };

  const handleCardPress = (id: string) => {
    setActiveNote(activeNote === id ? null : id);
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
                <IconButton {...props} icon="share-variant" onPress={() => {}} />
                <IconButton
                  {...props}
                  icon="delete"
                  onPress={() => setSnackbarVisible(true)}
                />
              </View>
            )
          }
        />
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <SectionList
        sections={[
          { title: 'My Notes', data: notes },
          { title: 'Shared', data: sharedNotes },
        ]}
        keyExtractor={(item) => String(item.id)}
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
        Success
      </Snackbar>
    </View>
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

