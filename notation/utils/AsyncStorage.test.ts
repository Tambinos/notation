import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItem } from './AsyncStorage';

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

    describe('getItem', () => {
        it('should get and parse an item from AsyncStorage when it exists', async () => {
            const key = 'note';
            const value =  {
                id: 1,
                title: "Test",
                info: "Test info",
                owner: "test",
                location: { latitude: 1, longitude: 2 },
                radius: "10",
                shared: false
            };
            const stringifiedValue = JSON.stringify(value);

            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(stringifiedValue);

            const result = await getItem(key);

            expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
            expect(result).toEqual(value);
        });

        it('should return null if the item does not exist in AsyncStorage', async () => {
            const key = 'nonExistentKey';

            (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);

            const result = await getItem(key);

            expect(AsyncStorage.getItem).toHaveBeenCalledWith(key);
            expect(result).toBeNull();
        });
    });
});