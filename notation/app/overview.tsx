import * as React from 'react';
import { useRouter } from 'expo-router';
import { View, StyleSheet, SectionList, TouchableOpacity } from 'react-native';
import { Card, Text, Avatar, FAB, Snackbar, IconButton } from 'react-native-paper';

const notes = [
	{ id: '1', title: 'Brot kaufen', subtitle: 'Weissbrot, Vollkorn ...', owner: 'A' },
	{ id: '2', title: 'Brot kaufen', subtitle: 'Weissbrot, Vollkorn ...', owner: 'A' },
	{ id: '3', title: 'Brot kaufen', subtitle: 'Weissbrot, Vollkorn ...', owner: 'A' },
];

const sharedNotes = [
	{ id: '4', title: 'Brot kaufen', subtitle: 'Weissbrot, Vollkorn ...', owner: 'Y' },
	{ id: '5', title: 'Brot kaufen', subtitle: 'Weissbrot, Vollkorn ...', owner: 'B' },
	{ id: '6', title: 'Brot kaufen', subtitle: 'Weissbrot, Vollkorn ...', owner: 'C' },
];

export default function OverviewScreen() {
	const [snackbarVisible, setSnackbarVisible] = React.useState(false);
	const [activeNote, setActiveNote] = React.useState<string | null>(null);

	const router = useRouter()
	const handleCardPress = (id: string) => {
		setActiveNote(activeNote === id ? null : id);
	};


	const renderNote = ({ item }) => (
		<TouchableOpacity onPress={() => handleCardPress(item.id)}>

			<Card style={styles.card}>
				<Card.Title
					title={item.title}
					subtitle={item.subtitle}
					left={(props) => <Avatar.Text {...props} label={item.owner} />}
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
				keyExtractor={(item) => item.id}
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
				onPress={() => router.navigate('/noteForm', {mode: "create", navigation: router})}
			/>
			<FAB
				style={styles.fab}
				icon="plus"
				label="Create Note"
				onPress={() => router.navigate('/asyncStorage')}
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
