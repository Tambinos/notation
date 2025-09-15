import React from 'react';
// 1. Import the original 'render' from the library
import { render, fireEvent, waitFor, RenderOptions } from '@testing-library/react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import OverviewScreen from './overview'; // Adjust paths as needed
import * as AsyncStorage from '../utils/AsyncStorage';

// Mocks for external dependencies
jest.mock('../utils/AsyncStorage', () => ({
    getAllItems: jest.fn(),
    removeItem: jest.fn(),
}));

jest.mock('expo-router', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

// 2. Define the wrapper with all necessary providers
const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
        <SafeAreaProvider initialMetrics={{ frame: { x: 0, y: 0, width: 0, height: 0 }, insets: { top: 0, left: 0, right: 0, bottom: 0 } }}>
            <NavigationContainer>{children}</NavigationContainer>
        </SafeAreaProvider>
    );
};

// 3. Define the custom render function that uses the wrapper
const customRender = (ui: React.ReactElement, options?: Omit<RenderOptions, 'wrapper'>) =>
    render(ui, { wrapper: AllTheProviders, ...options });


// --- YOUR TESTS ---

describe('OverviewScreen', () => {
    const mockNotes = [
        { id: '1', title: 'Test Note', owner: 'T', shared: false },
    ];

    beforeEach(() => {
        (AsyncStorage.removeItem as jest.Mock).mockClear();
        (AsyncStorage.getAllItems as jest.Mock).mockClear();
    });

    it('should delete a note successfully', async () => {
        (AsyncStorage.removeItem as jest.Mock).mockResolvedValue(undefined);

        // 4. Call 'customRender' directly instead of 'render'
        const { getByText, getByTestId, queryByText } = customRender(
            <OverviewScreen initialNotes={mockNotes} />
        );

        fireEvent.press(getByText('Test Note'));
        fireEvent.press(getByTestId('btn-delete-1'));

        await waitFor(() => {
            expect(queryByText('Test Note')).toBeNull();
            expect(getByText('Success')).toBeTruthy();
        });
    });

    it('should show an error snackbar when note deletion fails', async () => {
        (AsyncStorage.removeItem as jest.Mock).mockRejectedValue(new Error('Deletion failed'));

        // 4. Call 'customRender' here as well
        const { getByText, getByTestId } = customRender(
            <OverviewScreen initialNotes={mockNotes} />
        );

        fireEvent.press(getByText('Test Note'));
        fireEvent.press(getByTestId('btn-delete-1'));

        await waitFor(() => {
            expect(getByTestId('snackbar')).toBeTruthy();
            expect(getByText('Failed to delete the note.')).toBeTruthy();
        });
    });
});