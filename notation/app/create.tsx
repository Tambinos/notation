import * as React from 'react';
import { View } from 'react-native';
import {TextInput, Text} from 'react-native-paper';
export default function HomeScreen() {
	const [title, setTitle] = React.useState("");
	return (
		<View>
			<Text variant="displayMedium">Create</Text>
			<TextInput label="Title" onChangeText={title => setTitle(title)}></TextInput>
		</View>
	);
}

