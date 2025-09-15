import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import OverviewScreen from './overview';
import * as storage from '../utils/AsyncStorage';
import * as Sharing from 'expo-sharing';

jest.mock('expo-router', () => ({
	useRouter: () => ({ push: jest.fn() }),
	useFocusEffect: (cb: any) => cb(),
}));

jest.mock('../app/tile-renderer', () => () => <></>);

const mockNotes = {
	'note-1': { id: '1', title: 'Note One', info: 'Info text', owner: 'A', shared: false },
	'note-2': { id: '2', title: 'Shared Note', info: '', owner: 'B', shared: true },
};
jest.spyOn(storage, 'getAllItems').mockResolvedValue(mockNotes);
jest.spyOn(storage, 'removeItem').mockResolvedValue();

jest.spyOn(Sharing, 'isAvailableAsync').mockResolvedValue(true);
jest.spyOn(Sharing, 'shareAsync').mockResolvedValue();

describe('OverviewScreen', () => {
	it('renders notes and shared notes in sections', async () => {
		const { getByText } = render(<OverviewScreen />);

		await waitFor(() => {
			expect(getByText('My Notes')).toBeTruthy();
			expect(getByText('Shared')).toBeTruthy();
			expect(getByText('Note One')).toBeTruthy();
			expect(getByText('Shared Note')).toBeTruthy();
		});
	});

	it('expands a note to show actions', async () => {
		const { getByText, getByRole } = render(<OverviewScreen />);
		await waitFor(() => getByText('Note One'));

		fireEvent.press(getByText('Note One'));

		expect(getByRole('button', { name: /share-variant/i })).toBeTruthy();
		expect(getByRole('button', { name: /pencil/i })).toBeTruthy();
		expect(getByRole('button', { name: /delete/i })).toBeTruthy();
	});

	it('deletes a note and shows snackbar', async () => {
		const { getByText, queryByText } = render(<OverviewScreen />);
		await waitFor(() => getByText('Note One'));

		fireEvent.press(getByText('Note One')); // expand
		fireEvent.press(getByText('Note One').parent!.findByProps({ icon: 'delete' }));

		await waitFor(() => expect(queryByText('Note One')).toBeNull());
		expect(getByText('Success')).toBeTruthy();
	});

	it('shares a note successfully', async () => {
		const { getByText } = render(<OverviewScreen />);
		await waitFor(() => getByText('Note One'));

		fireEvent.press(getByText('Note One'));
		const shareButton = getByText('Note One').parent!.findByProps({ icon: 'share-variant' });
		fireEvent.press(shareButton);

		await waitFor(() => {
			expect(Sharing.shareAsync).toHaveBeenCalled();
		});
	});
});
