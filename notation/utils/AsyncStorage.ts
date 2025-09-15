import AsyncStorage from '@react-native-async-storage/async-storage';

export const getItem = async (key: string) => {
	const value = await AsyncStorage.getItem(key);
	return value != null ? JSON.parse(value) : null;
};

export const setItem = async (key: string, value: unknown) => {
	await AsyncStorage.setItem(key, JSON.stringify(value));
};

export const removeItem = async (key: string) => {
	await AsyncStorage.removeItem(key);
};

export const getAllItems = async () => {
	const keys = await AsyncStorage.getAllKeys();
	const items = await AsyncStorage.multiGet(keys);
	return items.reduce((accumulator, [key, value]) => {
		if (value !== null) {
			accumulator[key] = JSON.parse(value);
		}
		return accumulator;
	}, {} as Record<string, unknown>);
};

