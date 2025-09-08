import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import { setItem, getItem, removeItem, clear, getAllItems } from '../utils/AsyncStorage';

export default function AsyncStorage() {
  const [key, setKey] = useState('');
  const [value, setValue] = useState('');
  const [output, setOutput] = useState('');

  const handleSave = async () => {
    await setItem(key, value);
    setOutput(`Saved { ${key}: ${value} }`);
  };

  const handleGet = async () => {
    const stored = await getItem(key);
    setOutput(stored ? `Got: ${stored}` : `No value for key: ${key}`);
  };

  const handleRemove = async () => {
    await removeItem(key);
    setOutput(`Removed key: ${key}`);
  };

  const handleClear = async () => {
    await clear();
    setOutput('Storage cleared');
  };

  const handleGetAll = async () => {
    const allItems = await getAllItems();
    setOutput(JSON.stringify(allItems, null, 2));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AsyncStorage Test Page</Text>

      <TextInput
        placeholder="Key"
        value={key}
        onChangeText={setKey}
        style={styles.input}
      />

      <TextInput
        placeholder="Value"
        value={value}
        onChangeText={setValue}
        style={styles.input}
      />

      <View style={styles.buttonRow}>
        <Button title="Save" onPress={handleSave} />
        <Button title="Get" onPress={handleGet} />
      </View>

      <View style={styles.buttonRow}>
        <Button title="Remove" onPress={handleRemove} />
        <Button title="Clear All" onPress={handleClear} />
      </View>

      <Button title="Get All Items" onPress={handleGetAll} />

      <Text style={styles.output}>{output}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 10,
  },
  output: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

