import AsyncStorage from '@react-native-async-storage/async-storage';
import { getItem, getAllItems } from './AsyncStorage';

jest.mock('@react-native-async-storage/async-storage', () => ({
    getItem: jest.fn(),
    removeItem: jest.fn(),
    getAllKeys: jest.fn(),
    multiGet: jest.fn(),
}));

describe('AsyncStorage helpers', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
});
