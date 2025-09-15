import React from 'react';
import renderer, { act } from 'react-test-renderer';
import Layout from '../app/_layout';

jest.mock('expo-router', () => ({
    Slot: () => 'Slot',
    router: {
        push: jest.fn(),
    },
}));

jest.mock('expo-document-picker', () => ({
    getDocumentAsync: jest.fn(),
}));

jest.mock('../utils/AsyncStorage', () => ({
    setItem: jest.fn(),
}));

jest.mock('../assets/Notation_Logo.png', () => 'Notation_Logo.png');


describe('<Layout />', () => {
    it('renders correctly and matches the snapshot', async () => {
        let tree;

        await act(async () => {
            tree = renderer.create(<Layout />);
        });

        expect(tree.toJSON()).toMatchSnapshot();
    });
});