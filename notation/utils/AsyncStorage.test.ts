import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItem, getAllItems, setItem, removeItem } from './AsyncStorage';

jest.mock('@react-native-async-storage/async-storage', () => ({
	getItem: jest.fn(),
	setItem: jest.fn(),
	removeItem: jest.fn(),
	getAllKeys: jest.fn(),
	multiGet: jest.fn(),
}));

describe('AsyncStorage helpers', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('getItem should return parsed value if stored', async () => {
		(AsyncStorage.getItem as jest.Mock).mockResolvedValueOnce(
			JSON.stringify({ foo: 'bar' })
		);

		const result = await getItem('testKey');

		expect(AsyncStorage.getItem).toHaveBeenCalledWith('testKey');
		expect(result).toEqual({ foo: 'bar' });
	});

	it('getAllItems should return an object with all parsed key-value pairs', async () => {
		(AsyncStorage.getAllKeys as jest.Mock).mockResolvedValueOnce(['a', 'b']);
		(AsyncStorage.multiGet as jest.Mock).mockResolvedValueOnce([
			['a', JSON.stringify({ one: 1 })],
			['b', JSON.stringify({ two: 2 })],
		]);

		const result = await getAllItems();

		expect(AsyncStorage.getAllKeys).toHaveBeenCalled();
		expect(AsyncStorage.multiGet).toHaveBeenCalledWith(['a', 'b']);
		expect(result).toEqual({
			a: { one: 1 },
			b: { two: 2 },
		});
	});

	it('setItem should store a stringified value', async () => {
		await setItem('testKey', { hello: 'world' });

		expect(AsyncStorage.setItem).toHaveBeenCalledWith(
			'testKey',
			JSON.stringify({ hello: 'world' })
		);
	});

	it('removeItem should throw if AsyncStorage.removeItem fails', async () => {
		(AsyncStorage.removeItem as jest.Mock).mockRejectedValueOnce(
			new Error('Failed to remove item')
		);

		await expect(removeItem('testKey')).rejects.toThrow('Failed to remove item');

		expect(AsyncStorage.removeItem).toHaveBeenCalledWith('testKey');
	});

});

